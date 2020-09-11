import React, { useState, useCallback } from 'react'
import { List, ListItem, Text, View, Body, Right, Icon, Left, Button } from 'native-base'
import {
  IPatient,
  PatientList,
  TaskScheduleStatus,
  Task,
  NameUse,
  IHumanName,
  AdministrativeGender,
  ReportType,
  ReportList,
  InstrumentList,
  InstrumentType,
  RequestList,
  Instrument,
  Report,
} from 'smartmarkers-lib'

// import { RequestList } from '../components/RequestList'
import ResponseScreen from './ResponseScreen'
import CreateServiceRequestScreen from './CreateServiceRequestScreen'
import { ScrollView } from 'react-native'

interface RouteParams {}

enum ContentType {
  ServiceRequestList,
  History,
  InstrumentList,
  ServiceRequestCreator,
  ResponseScreen,
}

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

const DashboardScreen: React.FC<any> = () => {
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null)
  const [task, setTask] = useState<Task | null>(null)
  const [contentType, setContentType] = useState(ContentType.ServiceRequestList)
  const [instrument, setInstrument] = useState<Instrument | null>(null)
  const [report, setReport] = useState<Report | null>(null)

  const onItemPress = useCallback(
    async (item: IPatient) => {
      setSelectedPatient(item)
      setContentType(ContentType.ServiceRequestList)
      setTask(null)
    },
    [setTask, setSelectedPatient]
  )

  console.log({ selectedPatient })

  const onItemPressRequest = useCallback(
    async (t: Task) => {
      setTask(t)
      setContentType(ContentType.History)
    },
    [setTask]
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

  const renderRequestListItem = useCallback(
    (item: Task, key: any, onItemPress: (item: Task) => void, isLast: boolean) => (
      <ListItem
        key={key}
        onPress={() => onItemPress(item)}
        noBorder
        style={{
          backgroundColor: '#f0f2f8',
          borderRadius: 10,
          marginBottom: 3,
        }}
      >
        <Body>
          <Text style={{ color: '#002a78', fontWeight: 'bold' }}>{item.getTitle()}</Text>
          <Text note style={{ color: '#a4a5a6' }}>
            {item.getNote()} {item.schedule ? TaskScheduleStatus[item.schedule?.status] : ''}
          </Text>
        </Body>
        <Right>
          <Icon style={{ color: '#002a78' }} active name="arrow-forward" />
        </Right>
      </ListItem>
    ),
    []
  )

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
            <>
              <Text style={{ fontSize: 24, fontWeight: 'bold', paddingLeft: 15, flexGrow: 1 }}>
                {getPatientName(selectedPatient)}
              </Text>
              <Button
                onPress={() => setContentType(ContentType.InstrumentList)}
                style={{ width: 'max-content', alignSelf: 'flex-end', flexGrow: 0 }}
              >
                <Text>New request</Text>
              </Button>
            </>
          )}
        </View>
        <ScrollView style={{ height: 'calc(100vh - 111px)', padding: 10 }}>
          {selectedPatient && contentType === ContentType.ServiceRequestList && (
            <RequestList
              onItemPress={onItemPressRequest}
              filter={'status=active'}
              statuses={[
                TaskScheduleStatus.Due,
                TaskScheduleStatus.Upcoming,
                TaskScheduleStatus.Overdue,
              ]}
              patientId={selectedPatient.id}
              renderItem={renderRequestListItem}
            />
          )}
          {/*
          task && contentType === ContentType.History && (
            <ResponseScreen qrId = {task?.request?.id} />
            )*/}
          {contentType === ContentType.InstrumentList && (
            <InstrumentList
              type={InstrumentType.Questionnaire}
              onItemPress={(e: any) => {
                setInstrument(e)
                setContentType(ContentType.ServiceRequestCreator)
              }}
              patientId={selectedPatient?.id}
            />
          )}
          {contentType === ContentType.History && (
            <ReportList
              type={ReportType.QuestionnaireResponse}
              onItemPress={(r: Report) => {
                setReport(r)
                setContentType(ContentType.ResponseScreen)
              }}
              useClientPatientId={false}
              filter={`patient=${selectedPatient?.id}&based-on=ServiceRequest/${task?.request?.id}`}
            />
          )}
          {contentType === ContentType.ServiceRequestCreator && (
            <CreateServiceRequestScreen
              patientId={selectedPatient!.id}
              instrumentId={instrument!.id}
              onSubmitCallback={() => setContentType(ContentType.ServiceRequestList)}
            />
          )}
          {contentType === ContentType.ResponseScreen && <ResponseScreen qrId={report!.id} />}
        </ScrollView>
      </View>
    </View>
  )
}

export default DashboardScreen
