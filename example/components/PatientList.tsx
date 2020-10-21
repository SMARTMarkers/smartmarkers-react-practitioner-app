import React, { useCallback } from 'react'
import { PatientList as SMARTPatientList, IPatient, AdministrativeGender } from 'smartmarkers-lib'
import { ListItem, Left, Body, Text, Icon } from 'native-base'

import { getPatientName, calculateAge } from '../utils'
import { StyleSheet } from 'react-native'

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
  const renderItem = useCallback(
    (item: IPatient, key: any) => {
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
//_id=fc200fa2-12c9-4276-ba4a-e0601d424e55,9823384d-2120-478e-9ab3-6375c594347d,27de96c6-6910-4f0f-8f10-00ce6090f447,dbf9798e-4b52-4cd9-a9eb-ec36149c859a,37e97ea5-e2dc-4770-bb7d-93d02cfebb0c
  return (
    <SMARTPatientList
      renderItem={renderItem}
      onItemPress={onItemPress} 
      filter={'_id=fc200fa2-12c9-4276-ba4a-e0601d424e55,9823384d-2120-478e-9ab3-6375c594347d,27de96c6-6910-4f0f-8f10-00ce6090f447,dbf9798e-4b52-4cd9-a9eb-ec36149c859a,37e97ea5-e2dc-4770-bb7d-93d02cfebb0c'}
      selectedId={selectedPatientId}
    />
  )
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
