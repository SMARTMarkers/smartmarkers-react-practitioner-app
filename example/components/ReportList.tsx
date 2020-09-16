import React from 'react'
import { ReportList as SmartReportList, ReportType, Report } from 'smartmarkers-lib'
import { useHistory, useParams } from 'react-router-dom'
import { ListItem, Body, Right, Icon, Text } from 'native-base'
import { StyleSheet } from 'react-native'

interface RouteParams {
  patientId: string
  requestId: string
}

const ReportList = () => {
  const { patientId, requestId } = useParams<RouteParams>()
  const history = useHistory()

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

  return (
    <SmartReportList
      type={ReportType.QuestionnaireResponse}
      onItemPress={onPress}
      useClientPatientId={false}
      filter={`patient=${patientId}&based-on=ServiceRequest/${requestId}`}
      renderItem={renderItem}
    />
  )
}

export default ReportList

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#f0f2f8',
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: { color: '#002a78', fontWeight: 'bold' },
  note: { color: '#a4a5a6' },
})
