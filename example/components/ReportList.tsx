import React, { useCallback } from 'react'
import {
  ReportList as SmartReportList,
  TaskScheduleStatus,
  Task,
  ReportType,
  Report,
} from 'smartmarkers-lib'
import { useHistory, useParams } from 'react-router-dom'
import { ListItem, Body, View, Right, Icon, Text } from 'native-base'

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

  return (
    <SmartReportList
      type={ReportType.QuestionnaireResponse}
      onItemPress={onPress}
      useClientPatientId={false}
      filter={`patient=${patientId}&based-on=ServiceRequest/${requestId}`}
    />
  )
}

export default ReportList
