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
    color = '#72cef4'
  } else if (gender === AdministrativeGender.Female) {
    iconName = 'female'
    color = '#f98bc9'
  }

  if (!iconName) return null

  return <Icon style={{ fontSize: 22, width: 'auto', color }} active name={iconName} />
}

const PatientList: React.FC<PatientListProps> = ({ onItemPress, filter, selectedPatientId }) => {
  const renderItem = useCallback(
    (item: IPatient, key: any) => {
      const backgroundColor = selectedPatientId === item.id ? '#083892' : 'transparent'
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
            <Text style={{ color: 'white' }}>{getPatientName(item)}</Text>
            <Text style={{ color: '#6e86b5' }} note>
              {calculateAge(new Date(item.birthDate?.toString() || ''))}
            </Text>
          </Body>
        </ListItem>
      )
    },
    [selectedPatientId, filter, onItemPress]
  )

  return (
    <SMARTPatientList
      renderItem={renderItem}
      onItemPress={onItemPress}
      filter={filter}
      selectedId={selectedPatientId}
    />
  )
}

export default PatientList

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
  },
  listItemSelected: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    backgroundColor: '#083892',
  },
  genderSection: {
    height: 38,
    maxWidth: 38,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: '#72cef4',
    borderWidth: 2,
    borderStyle: 'solid',
  },
})
