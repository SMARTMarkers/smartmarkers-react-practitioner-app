import React from 'react'
import { PatientList as SMARTPatientList, IPatient, AdministrativeGender } from 'smartmarkers-lib'
import { ListItem, Left, Body, Text, Icon } from 'native-base'

import { getPatientName, calculateAge } from '../utils'
import { StyleSheet } from 'react-native'

interface PatientListProps {
  filter?: string
  onItemPress: (item: IPatient) => void
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

const PatientList: React.FC<PatientListProps> = ({ onItemPress, filter }) => {
  const renderItem = (item: IPatient, key: any) => {
    return (
      <ListItem
        underlayColor="#083892"
        style={styles.listItem}
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
  }

  return <SMARTPatientList renderItem={renderItem} onItemPress={onItemPress} filter={filter} />
}

export default PatientList

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
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
