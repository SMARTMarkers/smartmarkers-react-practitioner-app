import React, { useState } from 'react'
import { ReportType, Report, useFhirContext, ReportFactory, PromisLineChart } from 'smartmarkers'
import { useHistory, useParams } from 'react-router-dom'
import { ListItem, Body, Right, Icon, Text, Spinner, Picker, View } from 'native-base'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../store/models'
import { setReports, setSelectedReport } from '../store/main/actions'

interface RouteParams {
  patientId: string
  requestId: string
}

const ReportList = () => {
  const { patientId, requestId } = useParams<RouteParams>()
  const history = useHistory()
  const selectedTask = useSelector((store: Store) => store.root.selectedTask)

  const [isReady, setIsReady] = React.useState(false)
  const { user, server } = useFhirContext()
  const [chartWidth, setChartWidth] = useState(0)
  const reports = useSelector((store: Store) => store.root.reports)
  const dispatch = useDispatch()

  React.useEffect(() => {
    const loadItems = async () => {
      if (server) {
        const items = await server?.getPatientReports(
          ReportType.QuestionnaireResponse,
          `patient=${patientId}&based-on=ServiceRequest/${requestId}`,
          false
        )
        console.log(`patient=${user?.id}&based-on=ServiceRequest/${requestId}`)
        const factory = new ReportFactory(server)
        const reports = items.map((i: any) => factory.createReport(i))
        dispatch(setReports(reports))
      }

      setIsReady(true)
    }
    loadItems()
  }, [requestId, user, user?.id])

  const onPress = (r: Report) => {
    dispatch(setSelectedReport(r))
    history.push(`/dashboard/${patientId}/${requestId}/history/${r.id}/report`)
  }

  const renderItem = (item: Report, key: any) => (
    <ListItem key={item.id} onPress={() => onPress(item)} style={styles.listItem}>
      <Body>
        <Text style={styles.title}>
          {new Date(item?.meta?.lastUpdated as string).toLocaleDateString('en-US')}
        </Text>
        <Text note style={styles.note}>
          {item.getNote()}
        </Text>
      </Body>
      <Right>
        <Icon style={{ color: '#002a78' }} active name="arrow-forward" />
      </Right>
    </ListItem>
  )

  const getRequestList = () => {
    if (!isReady && !reports.length) {
      return <Spinner />
    }

    if (reports?.length) {
      return <>{reports?.map((item, index) => renderItem(item, index))}</>
    } else {
      return (
        <>
          <ListItem>
            <Body>
              <Text note>No Responses Found</Text>
            </Body>
          </ListItem>
        </>
      )
    }
  }

  return (
    <>
      <View style={{ margin: 15 }}>
        <Text style={styles.headerTitle}>{selectedTask?.instrument?.getTitle()}</Text>
        <Text note>Questionnaire</Text>
      </View>
      <PromisLineChart responses={reports} />
      {getRequestList()}
    </>
  )
}

export default ReportList

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#f0f2f8',
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 0,
    marginLeft: 0,
    paddingRight: 15,
  },
  title: { color: '#002a78', fontWeight: 'bold' },
  note: { color: '#a4a5a6' },
  headerTitle: { textAlign: 'left', fontSize: 20, fontWeight: 'bold', color: '#575757' },
})
