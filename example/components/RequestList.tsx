import React, { useCallback } from 'react'
import { RequestList as SmartRequestList, TaskScheduleStatus, Task } from 'smartmarkers-lib'
import { useHistory, useParams } from '../react-router'
import { ListItem, Body, Right, Icon, Text } from 'native-base'
import { StyleSheet } from 'react-native'

// TODO-RS: replace line below with {item.request.getRequesterName()}



interface RouteParams {
  patientId: string
}

const RequestList = () => {
  const { patientId } = useParams<RouteParams>()
  const history = useHistory()
  const onItemPressRequest = (t: Task) => {
    history.push(`/dashboard/${patientId}/${t.request?.id}/${t.getTitle()}/history`)
  }

  const renderRequestListItem = useCallback(
    (item: Task, key: any, onItemPress: (item: Task) => void, isLast: boolean) => (
      
      <ListItem
        key={key}
        underlayColor="transparent"
        onPress={() => onItemPress(item)}
        noBorder
        style={styles.listItem}
      >
        <Body>
          <Text note>#{item.request.id} | { new Date(item.request?.meta?.lastUpdated).toLocaleDateString('en-US')} </Text>        
          <Text>Instrument: <Text style={styles.title}>{item.getTitle()}</Text></Text>
          <Text>Requested by: { item.request.getRequester() } </Text>
        </Body>
        <Right>
          <Icon style={{ color: '#002a78' }} active name="arrow-forward" />
        </Right>
      </ListItem>
    ),
    []
  )

  return (
    <SmartRequestList
      onItemPress={onItemPressRequest}
      filter={'status=active'}
      statuses={[TaskScheduleStatus.Due, TaskScheduleStatus.Upcoming, TaskScheduleStatus.Overdue]}
      patientId={patientId}
      renderItem={renderRequestListItem}
    />
  )
}

export default RequestList

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#f0f2f8',
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 0,
    fontWeight: 'bold'
  },
  title: { color: '#002a78', fontWeight: 'bold' },
  note: { color: '#a4a5a6' },
})
