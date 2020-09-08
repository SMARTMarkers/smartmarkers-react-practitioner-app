import React, { useState, useCallback } from 'react'
import { List, ListItem, Text, View, Body, Right, Icon, Left } from 'native-base'
import { IPatient, PatientList, TaskScheduleStatus, Task, NameUse, IHumanName, AdministrativeGender } from 'smartmarkers-lib'

import { RequestList } from '../components/RequestList'
import ResponseScreen from './ResponseScreen'
import { ScrollView } from 'react-native'


interface RouteParams {}

function _calculateAge(birthday: Date) { 
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs);
  const yrs = Math.abs(ageDate.getUTCFullYear() - 1970)
  const mths = Math.abs(ageDate.getUTCMonth())

  if (!mths) return `${yrs} yrs`
  return  `${yrs} yrs, ${mths} mths`
}

const getHumanNameString = (humanName: IHumanName) => {
  return (humanName.given?.concat(' ') + ' ' + (humanName.family ? humanName.family : '')).trim()
}

const getPatientName = (patient: IPatient) => {
  if (patient && patient.name && patient.name.length > 0) {
      if (patient.name.length == 1) {
          return getHumanNameString(patient.name[0])
      } else {
          const nameOfficial = patient.name.find(item => item.use && item.use == NameUse.Official)
          if (nameOfficial) {
              return getHumanNameString(nameOfficial)
          } else {
              const nameUsual = patient.name.find(item => item.use && item.use == NameUse.Usual)
              if (nameUsual) {
                  return getHumanNameString(nameUsual)
              } else {
                  return getHumanNameString(patient.name[0])
              }
          }
      }
  }
  return ''
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

  return <Icon style={{fontSize: 22, width: 'auto', color }} active name={iconName} />
}

const DashboardScreen: React.FC<any> = () => {
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null)
  const [task, setTask] = useState<Task | null>(null)

  console.log('DashboardScreen rerender')

  const onItemPress = useCallback(async (item: IPatient) => {
    setSelectedPatient(item)
    setTask(null)
  }, [setTask, setSelectedPatient])

  const onItemPressRequest = useCallback((t: Task) => {
    setTask(t)
  }, [setTask])

  const renderItem = useCallback((item: IPatient, key: any) => {
    // console.log(item.id)
    // console.log(selectedPatient?.id)
    const isSelected = item.id === selectedPatient?.id
    return(
      <ListItem
        underlayColor="#002a78"
        style={{
          backgroundColor: isSelected ? '#083892' : undefined,
          paddingLeft: 10,
          paddingRight: 10,
          borderRadius: 15
        }}
        key={key}
        onPress={() => onItemPress(item)}
        noBorder
      >
        <Left
          style={{
            height: 38,
            maxWidth: 38,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            borderColor: '#72cef4',
            borderWidth: 2,
            borderStyle: 'solid'
          }}
        >
          {getGenderIcon(item.gender)}
        </Left>
        <Body>
            <Text style={{color: 'white'}}>{getPatientName(item)}</Text>
            <Text style={{color: '#6e86b5'}} note>{_calculateAge(new Date(item.birthDate?.toString() || ''))}</Text>
        </Body>
      </ListItem>
    )
  }, [selectedPatient, onItemPress])

  return (
    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#002a78'}}>
      <List style={{ paddingLeft: 0, maxWidth: 370, minWidth: 240}}>
        <ListItem itemHeader>
          <Text style={{color: 'white', fontSize: 24, textAlign: 'center', width: '100%'}}>PATIENTS</Text>
        </ListItem>
        <ScrollView style={{height: 'calc(100vh - 118px)'}}>
          <PatientList filter={'active=true'} onItemPress={onItemPress} renderItem={renderItem} />
        </ScrollView>
      </List>
      <View style={{flexGrow: 1, backgroundColor: 'white', alignSelf: 'stretch', borderRadius: 20, margin: '20px', marginTop: 15, overflow: 'hidden'}}>
        <ScrollView style={{height: 'calc(100vh - 91px)'}}>
          {
            selectedPatient && !task && (
              <RequestList
                onItemPress={onItemPressRequest}
                filter={'status=active'}
                statuses={[
                    TaskScheduleStatus.Due,
                    TaskScheduleStatus.Upcoming,
                    TaskScheduleStatus.Overdue,
                ]}
                patientId={selectedPatient.id}
              />
            )
          }
        </ScrollView>
        {
          task && task && (
            <ResponseScreen qrId = {task?.request?.id} />
          )
        }
      </View>
    </View>
  )
}

export default DashboardScreen
