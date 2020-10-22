import React, { useCallback } from 'react'
import { IPatient, AdministrativeGender, useFhirContext } from 'smartmarkers-lib'
import { ListItem, Left, Body, Text, Icon, Spinner } from 'native-base'

import { getPatientName, calculateAge } from '../utils'
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setPatients } from '../store/main/actions'
import { Store } from '../store/models'

interface PatientListProps {
  filter?: string
  onItemPress: (item: IPatient) => void
  selectedPatientId?: string
}

const getGenderIcon = (gender?: AdministrativeGender) => {
  let iconName: string = ''
  let color: string = ''
  if (gender === AdministrativeGender.Male) {
    iconName = 'male'
    color = '#7f7fac'
  } else if (gender === AdministrativeGender.Female) {
    iconName = 'female'
    color = '#7f7fac'
  }

  if (!iconName) return null

  return <Icon style={{ fontSize: 22, width: 'auto', color }} active name={iconName} />
}

const PatientList: React.FC<PatientListProps> = ({ onItemPress, filter, selectedPatientId }) => {
  const patients = useSelector((store: Store) => store.root.patients)
  const [isReady, setIsReady] = React.useState(false)
  const { server } = useFhirContext()
  const dispatch = useDispatch()

  const renderItem = useCallback(
    (item: IPatient) => {
      const backgroundColor = selectedPatientId === item.id ? '#babad3' : 'transparent'
      return (
        <ListItem
          underlayColor="transparent"
          style={[styles.listItem, { backgroundColor }]}
          key={item.id}
          onPress={() => onItemPress(item)}
          noBorder
        >
          <Left style={styles.genderSection}>{getGenderIcon(item.gender)}</Left>
          <Body>
            <Text style={{ color: 'black' }}>{getPatientName(item)}</Text>
            <Text style={{ color: '#6e86b5' }} note>
              {calculateAge(new Date(item.birthDate?.toString() || ''))}
            </Text>
          </Body>
        </ListItem>
      )
    },
    [selectedPatientId, filter, onItemPress]
  )

  React.useEffect(() => {
    const loadItems = async () => {
      if (server) {
        const items = await server?.getPatients(filter)
        console.log(items)
        dispatch(setPatients(items))
      }
      setIsReady(true)
    }
    loadItems()
  }, [])

  if (!isReady && !patients.length) {
    return <Spinner />
  }
  const renderItemFunc = ({ item, index }: ListRenderItemInfo<IPatient>) => {
    const elements: React.ReactElement = renderItem(item) as React.ReactElement
    return elements || null
  }
  //_id=fc200fa2-12c9-4276-ba4a-e0601d424e55,9823384d-2120-478e-9ab3-6375c594347d,27de96c6-6910-4f0f-8f10-00ce6090f447,dbf9798e-4b52-4cd9-a9eb-ec36149c859a,37e97ea5-e2dc-4770-bb7d-93d02cfebb0c
  if (patients?.length) {
    return (
      <FlatList
        data={patients || []}
        renderItem={renderItemFunc}
        keyExtractor={item => item.id}
        extraData={selectedPatientId}
      />
    )
  } else {
    return (
      <ListItem>
        <Body>
          <Text note>NO PATIENTS</Text>
        </Body>
      </ListItem>
    )
  }
}

export default PatientList

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  listItemSelected: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#babad3',
  },
  genderSection: {
    height: 38,
    maxWidth: 38,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: '#7f7fac',
    borderWidth: 2,
    borderStyle: 'solid',
  },
})
