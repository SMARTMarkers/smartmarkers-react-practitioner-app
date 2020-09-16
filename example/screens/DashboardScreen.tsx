import React, { useState, useCallback, useEffect } from 'react'
import { List, ListItem, Text, View, Icon, Button } from 'native-base'
import { IPatient, useFhirContext, Server } from 'smartmarkers-lib'

import ResponseView from '../components/ResponseView'
import { ScrollView } from 'react-native'
import CreateNewServiceRequestScreen from './CreateNewServiceRequestScreen'
import { Switch, Route, useHistory, useParams } from 'react-router-dom'
import RequestList from '../components/RequestList'
import ReportList from '../components/ReportList'
import FhirResource from '../components/FhirResource'
import PatientList from '../components/PatientList'
import { getPatientName } from '../utils'
import { StyleSheet } from 'react-native'

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

  const onCreateNewRequest = () =>
    history.push(`/create-new-service-request/${selectedPatient!.id}`)

  return (
    <View style={styles.container}>
      <List style={styles.patientsSection}>
        <ListItem itemHeader>
          <Text style={styles.patientsHeader}>PATIENTS</Text>
        </ListItem>
        <ScrollView style={styles.patientsScrollView}>
          <PatientList filter={''} onItemPress={onItemPress} />
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', flexGrow: 1, color: '#002a78' }}>
                  {getPatientName(selectedPatient)}
                </Text>
                <Text note>
                  {`GEN: ${selectedPatient.gender} DOB: ${selectedPatient.birthDate}`}
                </Text>
                <Text note>{`MRN: ${selectedPatient.id}`}</Text>
              </View>
              <Button onPress={onCreateNewRequest} style={styles.newRequestButton}>
                <Text>New request</Text>
              </Button>
            </>
          )}
        </View>
        <ScrollView style={styles.contentScrollView}>
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#002a78',
  },
  patientsSection: { paddingLeft: 0, maxWidth: 370, minWidth: 240 },
  patientsScrollView: { height: 'calc(100vh - 118px)' },
  patientsHeader: { color: 'white', fontSize: 24, textAlign: 'center', width: '100%' },
  content: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    borderRadius: 20,
    margin: '20px',
    marginTop: 15,
    overflow: 'hidden',
    padding: 20,
  },
  contentScrollView: { height: 'calc(100vh - 176px)', padding: 10 },
  contentHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  newRequestButton: {
    width: 'max-content',
    alignSelf: 'center',
    flexGrow: 0,
    backgroundColor: '#002a78',
  },
})
