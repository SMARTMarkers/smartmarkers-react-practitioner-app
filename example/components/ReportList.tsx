import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ReportList as SmartReportList,
  ReportType,
  Report,
  IQuestionnaireResponseItemAnswer,
  IQuestionnaireResponseItem,
  QuestionnaireResponse,
  useFhirContext,
  ReportFactory,
} from 'smartmarkers-lib'
import { useHistory, useParams } from 'react-router-dom'
import { ListItem, Body, Right, Icon, Text, Spinner, Picker, View } from 'native-base'
import { Dimensions, Platform, StyleSheet } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

interface RouteParams {
  patientId: string
  requestId: string
}

const ReportList = () => {
  const { patientId, requestId } = useParams<RouteParams>()
  const history = useHistory()

  const [isReady, setIsReady] = React.useState(false)
  const [items, setItems] = React.useState<Report[] | undefined>([])
  const [pickerItems, setPickerItems] = useState<any>([])
  const [pickerValue, setPickerValue] = useState('')
  const [chartData, setChartData] = useState([])
  const { user, server } = useFhirContext()
  const [chartWidth, setChartWidth] = useState(0)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    if (!items && !items!.length) return
    const data: any = []
    items?.forEach((report: Report) => {
      const questionnaireResponse = report as QuestionnaireResponse
      if (questionnaireResponse.extension) {
        setShowChart(true)
        const scores: any = questionnaireResponse.extension.filter(
          (el: any) => el.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-scores'
        )

        if (scores[0]) {
          const theta = scores[0].extension.filter(
            (el: any) =>
              el.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-scores/theta'
          )[0]
          theta && data.push(theta.valueDecimal * 10 + 50)
        }
      }
    })
    setChartData(data)
  }, [items])

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
        setItems(reports)
      }

      setIsReady(true)
    }
    loadItems()
  }, [requestId, user, user?.id])

  const onPress = (r: Report) => {
    history.push(`/dashboard/${patientId}/${requestId}/history/${r.id}/report`)
  }

  const renderItem = (item: Report, key: any) => (
    <ListItem key={item.id} onPress={() => onPress(item)} style={styles.listItem}>
      <Body>
        <Text style={styles.title}>{item.getTitle()}</Text>
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
    if (!isReady) {
      return <Spinner />
    }

    if (items?.length) {
      return <>{items?.map((item, index) => renderItem(item, index))}</>
    } else {
      return (
        <ListItem>
          <Body>
            <Text note>NO ITEMS</Text>
          </Body>
        </ListItem>
      )
    }
  }

  const find_dimesions = (layout: any) => {
    const { x, y, width, height } = layout
    setChartWidth(width)
  }

  return (
    <>
      {!!(chartData && chartData.length) && (
        <View
          onLayout={event => {
            find_dimesions(event.nativeEvent.layout)
          }}
        >
          {!!chartWidth && showChart && (
            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
              width={chartWidth} // from react-native
              height={220}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
        </View>
      )}
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
})
