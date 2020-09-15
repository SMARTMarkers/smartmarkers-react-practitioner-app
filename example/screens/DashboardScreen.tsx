import React, { useState, useCallback, useEffect } from 'react'
import { List, ListItem, Text, View, Body, Icon, Left, Button } from 'native-base'
import {
  IPatient,
  PatientList,
  NameUse,
  IHumanName,
  AdministrativeGender,
  useFhirContext,
  Server,
} from 'smartmarkers-lib'

import ResponseView from '../components/ResponseView'
import { ScrollView } from 'react-native'
import CreateNewServiceRequestScreen from './CreateNewServiceRequestScreen'
import { Switch, Route, useHistory, useParams } from 'react-router-dom'
import RequestList from '../components/RequestList'
import ReportList from '../components/ReportList'
import FhirResource from '../components/FhirResource'

function _calculateAge(birthday: Date) {
  var ageDifMs = Date.now() - birthday.getTime()
  var ageDate = new Date(ageDifMs)
  const yrs = Math.abs(ageDate.getUTCFullYear() - 1970)
  const mths = Math.abs(ageDate.getUTCMonth())

  if (!mths) return `${yrs} yrs`
  return `${yrs} yrs, ${mths} mths`
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

  return <Icon style={{ fontSize: 22, width: 'auto', color }} active name={iconName} />
}

const getPatient = async (patientId: string, callback: any, server?: Server) => {
  const patients = await server?.getPatients(`_id=${patientId}`)
  patients && patients[0] && callback(patients[0])
}

const DashboardScreen: React.FC<any> = () => {
  const { server } = useFhirContext()
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null)

  const history = useHistory()
  const backArrowIsVisible = history.location.pathname.split('/').length > 3
  const { patientId } = useParams()

  useEffect(() => {
    if (patientId) {
      getPatient(patientId, setSelectedPatient, server || undefined)
    }
  }, [patientId, setSelectedPatient])

  const onItemPress = useCallback(
    async (item: IPatient) => {
      history.push(`/dashboard/${item.id}`)
      setSelectedPatient(item)
    },
    [setSelectedPatient]
  )

  const renderItem = (item: IPatient, key: any) => {
    return (
      <ListItem
        underlayColor="#083892"
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          borderRadius: 10,
        }}
        key={item.id}
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
            borderStyle: 'solid',
          }}
        >
          {getGenderIcon(item.gender)}
        </Left>
        <Body>
          <Text style={{ color: 'white' }}>{getPatientName(item)}</Text>
          <Text style={{ color: '#6e86b5' }} note>
            {_calculateAge(new Date(item.birthDate?.toString() || ''))}
          </Text>
        </Body>
      </ListItem>
    )
  }

  const onCreateNewRequest = () =>
    history.push(`/create-new-service-request/${selectedPatient!.id}`)

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#002a78',
      }}
    >
      <List style={{ paddingLeft: 0, maxWidth: 370, minWidth: 240 }}>
        <ListItem itemHeader>
          <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', width: '100%' }}>
            PATIENTS
          </Text>
        </ListItem>
        <ScrollView style={{ height: 'calc(100vh - 118px)' }}>
          <PatientList filter={''} onItemPress={onItemPress} renderItem={renderItem} />
        </ScrollView>
      </List>
      <View
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
          alignSelf: 'stretch',
          borderRadius: 20,
          margin: '20px',
          marginTop: 15,
          overflow: 'hidden',
          padding: 20,
        }}
      >
        <View
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          {selectedPatient && (
            <View
              style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100%' }}
            >
              {backArrowIsVisible && (
                <Button transparent onPress={() => history.goBack()}>
                  <Icon
                    name="arrow-back"
                    style={{ fontSize: 30, fontWeight: 'bold', color: '#002a78' }}
                  />
                </Button>
              )}
              <Text style={{ fontSize: 24, fontWeight: 'bold', flexGrow: 1, color: '#002a78' }}>
                {getPatientName(selectedPatient)}
              </Text>
              <Button
                onPress={onCreateNewRequest}
                style={{
                  width: 'max-content',
                  alignSelf: 'flex-end',
                  flexGrow: 0,
                  backgroundColor: '#002a78',
                }}
              >
                <Text>New request</Text>
              </Button>
            </View>
          )}
        </View>
        <ScrollView style={{ height: 'calc(100vh - 176px)', padding: 10 }}>
          <Switch>
            <Route exact path="/dashboard/:patientId">
              <RequestList />
            </Route>
            <Route exact path="/dashboard/create-new-service-request">
              <CreateNewServiceRequestScreen patientId={selectedPatient?.id || ''} />
            </Route>
            <Route exact path="/dashboard/:patientId/:requestId/history">
              <ReportList />
            </Route>
            <Route exact path="/dashboard/:patientId/:requestId/history/:reportId/report">
              <ResponseView />
            </Route>
            <Route path="/dashboard/:patientId/:requestId/history/:reportId/resource">
              <FhirResource />
            </Route>
          </Switch>
        </ScrollView>
      </View>
    </View>
  )
}

export default DashboardScreen
