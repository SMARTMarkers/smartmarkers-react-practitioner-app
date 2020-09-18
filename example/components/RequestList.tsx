import React, { useCallback } from 'react'
import { RequestList as SmartRequestList, TaskScheduleStatus, Task } from 'smartmarkers-lib'
import { useHistory, useParams } from 'react-router-dom'
import { ListItem, Body, Right, Icon, Text } from 'native-base'
import { StyleSheet } from 'react-native'

interface RouteParams {
  patientId: string
}

const RequestList = () => {
  const { patientId } = useParams<RouteParams>()
  const history = useHistory()
  const onItemPressRequest = (t: Task) => {
    history.push(`/dashboard/${patientId}/${t.request?.id}/history`)
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
          <Text style={styles.title}>{item.getTitle()}</Text>
          <Text note style={styles.note}>
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
  },
  title: { color: '#002a78', fontWeight: 'bold' },
  note: { color: '#a4a5a6' },
})
