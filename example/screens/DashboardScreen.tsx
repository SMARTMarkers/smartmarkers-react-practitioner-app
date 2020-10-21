import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { List, ListItem, Text, View, Icon, Button } from 'native-base'
import { IPatient, useFhirContext, Server } from 'smartmarkers-lib'

import ResponseView from '../components/ResponseView'
import { Platform, ScrollView } from 'react-native'
import CreateNewServiceRequestScreen from './CreateNewServiceRequestScreen'
import { Switch, Route, useHistory, useParams } from '../react-router'
import RequestList from '../components/RequestList'
import ReportList from '../components/ReportList'
import FhirResource from '../components/FhirResource'
import PatientList from '../components/PatientList'
import { getPatientName } from '../utils'
import { StyleSheet, Dimensions } from 'react-native'

const getPatient = async (patientId: string, callback: any, server?: Server) => {
  const patients = await server?.getPatients(`_id=${patientId}`)
  patients && patients[0] && callback(patients[0])
}

const DashboardScreen: React.FC<any> = () => {
  const { server } = useFhirContext()
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: '#d2d2e2',
          
          width: '100%',
          height:
            Platform.OS === 'web' ? 'calc(100vh - 56px)' : Dimensions.get('window').height - 80,
        },
        patientsSection: { paddingLeft: 0, maxWidth: 350, minWidth: 240, flex: 1 },
        patientsScrollView: {
          height:
            Platform.OS === 'web' ? 'calc(100vh - 150px)' : Dimensions.get('window').height - 150,
          backgroundColor: '#d2d2e2',
        },
        patientsHeader: { color: 'darkGray', fontSize: 24, textAlign: 'center', width: '100%' },
        content: {
          // flexGrow: 1,
          backgroundColor: 'white',
          // alignSelf: 'stretch',
          marginTop: 0,
          overflow: 'hidden',
          padding: 20 ,
          flex: 1,
          borderLeftWidth: 1,
          height: '100%',
          width: Dimensions.get('window').width - 350,
        },
        contentScrollView: { height: '100%', margin: 0, maxWidth: '100%' },
        contentHeader: {
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingBottom: 15,
        },
        newRequestButton: {
          alignSelf: 'center'
        },
      }),
    [Dimensions]
  )

  const history = useHistory()
  const backArrowIsVisible = history.location.pathname.split('/').length > 3
  const { patientId } = useParams<any>()

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

  const onCreateNewRequest = () =>
    history.push(`/create-new-service-request/${selectedPatient!.id}`)

  return (
    <View style={styles.container}>
      <List style={styles.patientsSection}>
        <ListItem itemHeader>
          <Text style={styles.patientsHeader}>Patients</Text>
        </ListItem>
        <ScrollView style={styles.patientsScrollView}>
          <PatientList
            selectedPatientId={selectedPatient?.id}
            filter={'_summary=True'}
            onItemPress={onItemPress}
          />
        </ScrollView>
      </List>
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          {selectedPatient && (
            <>
              {backArrowIsVisible && (
                <Button transparent onPress={() => history.goBack()}>
                  <Icon
                    name="arrow-back"
                    style={{ fontSize: 30, fontWeight: 'bold', color: '#002a78' }}
                  />
                </Button>
              )}
              <View style={{ flexGrow: 2 }}>
                <Text style={{ fontSize: 34, fontWeight: 'bold', flexGrow: 1, color: '#0' }}>
                    {`Name: ${getPatientName(selectedPatient)}`}
                </Text>
                  <Text style={{ color: 'gray' }}>{`Gender: ${selectedPatient.gender}`}</Text>
                  <Text style={{ color: 'gray' }}>{`Date of Birth: ${selectedPatient.birthDate}`}</Text>
                  <Text style={{ color: 'gray' }}>{`MRN: ${selectedPatient.id}`}</Text>
              </View>
              <Button onPress={onCreateNewRequest} style={styles.newRequestButton}>
                <Text>New request</Text>
              </Button>
            </>
          )}   
        </View>

        <View
            style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
            }}
        />

       <ScrollView style={styles.contentScrollView}>
          <Switch>
            <Route exact path="/dashboard/:patientId">
              <RequestList />
            </Route>
            <Route exact path="/dashboard/create-new-service-request">
              <CreateNewServiceRequestScreen patientId={selectedPatient?.id || ''} />
            </Route>
            <Route exact path="/dashboard/:patientId/:requestId/:instrumentTitle/history">
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
