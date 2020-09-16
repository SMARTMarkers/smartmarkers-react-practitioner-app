import React from 'react'
import { TaskSchedule, WEEKDAY, DaysOfWeek, UnitsOfTime, ITiming } from 'smartmarkers-lib'
import { Form as NativeBaseForm, Button, Text, Item, Label } from 'native-base'
import { GroupItem, DateTime } from 'smartmarkers-lib/dist/components/inputs'
import { View } from 'native-base'

import ButtonGroup from '../components/ButtonGroup'
import { StyleSheet } from 'react-native'

export interface TaskScheduleFormProps {
  schedule?: TaskSchedule
  onSubmit: (taskSchedule: TaskSchedule) => {}
  submitTitle?: string
}

enum ScheduleType {
  Instant = 'Instant',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

const getScheduleTypeFromTaskSchedule = (taskSchedule: TaskSchedule) => {
  if (taskSchedule.occurrenceDateTime || taskSchedule.occurrencePeriod) {
    return ScheduleType.Instant
  } else if (taskSchedule.occurrenceTiming) {
    if (
      taskSchedule.occurrenceTiming &&
      taskSchedule.occurrenceTiming.repeat &&
      taskSchedule.occurrenceTiming.repeat.periodUnit
    ) {
      if (taskSchedule.occurrenceTiming.repeat.periodUnit == UnitsOfTime.WK) {
        return ScheduleType.Weekly
      } else if (taskSchedule.occurrenceTiming.repeat.periodUnit == UnitsOfTime.Mo) {
        return ScheduleType.Monthly
      }
    }
  }

  return ScheduleType.Instant
}

const getPrefferedDayFromTaskSchedule = (taskSchedule: TaskSchedule) => {
  if (
    taskSchedule.occurrenceTiming &&
    taskSchedule.occurrenceTiming.repeat &&
    taskSchedule.occurrenceTiming.repeat.dayOfWeek &&
    taskSchedule.occurrenceTiming.repeat.dayOfWeek.length > 0
  ) {
    return taskSchedule.occurrenceTiming.repeat.dayOfWeek[0]
  }
  return DaysOfWeek.Mon
}

const getStartDateFromTaskSchedule = (taskSchedule: TaskSchedule) => {
  if (taskSchedule.occurrenceDateTime) {
    return taskSchedule.occurrenceDateTime
  } else if (taskSchedule.occurrencePeriod && taskSchedule.occurrencePeriod.start) {
    return taskSchedule.occurrencePeriod.start
  } else if (taskSchedule.occurrenceTiming && taskSchedule.occurrenceTiming.repeat) {
    if (
      taskSchedule.occurrenceTiming.repeat.boundsPeriod &&
      taskSchedule.occurrenceTiming.repeat.boundsPeriod.start
    ) {
      return taskSchedule.occurrenceTiming.repeat.boundsPeriod.start
    }
  }

  return new Date()
}

const getEndDateFromTaskSchedule = (taskSchedule: TaskSchedule) => {
  if (taskSchedule.occurrencePeriod && taskSchedule.occurrencePeriod.end) {
    return taskSchedule.occurrencePeriod.end
  } else if (taskSchedule.occurrenceTiming && taskSchedule.occurrenceTiming.repeat) {
    if (
      taskSchedule.occurrenceTiming.repeat.boundsPeriod &&
      taskSchedule.occurrenceTiming.repeat.boundsPeriod.end
    ) {
      return taskSchedule.occurrenceTiming.repeat.boundsPeriod.end
    }
  }

  return new Date()
}

const sheduleTypes = [ScheduleType.Instant, ScheduleType.Weekly, ScheduleType.Monthly].map(
  item => ({ label: item, value: item } as GroupItem<ScheduleType>)
)

const weekDays = WEEKDAY.map(item => ({ label: item, value: item } as GroupItem<DaysOfWeek>))

const TaskScheduleForm = (props: TaskScheduleFormProps) => {
  const { onSubmit, schedule, submitTitle } = props
  const [hasNoError, setHasNoError] = React.useState(true)
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    schedule ? getStartDateFromTaskSchedule(schedule) : new Date()
  )
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    schedule ? getEndDateFromTaskSchedule(schedule) : new Date()
  )
  const [scheduleType, setScheduleType] = React.useState(
    schedule ? getScheduleTypeFromTaskSchedule(schedule) : ScheduleType.Instant
  )
  const [prefferedDay, setPrefferedDay] = React.useState(
    schedule ? getPrefferedDayFromTaskSchedule(schedule) : DaysOfWeek.Mon
  )

  const onScheduleTypeChange = (value: ScheduleType) => {
    setScheduleType(value)
  }
  const onPrefferedDayChange = (value: DaysOfWeek) => {
    setPrefferedDay(value)
  }
  const onStartDateChange = (value?: Date) => {
    setStartDate(value)
  }
  const onEndDateChange = (value?: Date) => {
    setEndDate(value)
  }
  const onSubmitPress = () => {
    if (scheduleType == ScheduleType.Instant) {
      const newSchedule = new TaskSchedule(startDate)
      onSubmit(newSchedule)
    } else if (scheduleType == ScheduleType.Weekly) {
      const timing: ITiming = {
        id: '',
        repeat: {
          boundsPeriod: {
            start: startDate,
            end: endDate,
          },
          frequency: 1,
          period: 1,
          periodUnit: UnitsOfTime.WK,
          dayOfWeek: [prefferedDay],
        },
      }
      const newSchedule = new TaskSchedule(undefined, undefined, timing)
      onSubmit(newSchedule)
    } else {
      const timing: ITiming = {
        id: '',
        repeat: {
          boundsPeriod: {
            start: startDate,
            end: endDate,
          },
          frequency: 1,
          period: 1,
          periodUnit: UnitsOfTime.Mo,
          dayOfWeek: [prefferedDay],
        },
      }
      const newSchedule = new TaskSchedule(undefined, undefined, timing)
      onSubmit(newSchedule)
    }
  }

  return (
    <NativeBaseForm testID="taskScheduleForm">
      <Item bordered={false} style={styles.headerItem}>
        <Label style={styles.headerText}>TIMING</Label>
      </Item>
      <Item style={styles.containerItem}>
        <Label style={{ flexShrink: 0, width: 120 }}>Shedule Type</Label>
        <View style={styles.buttonGroupWrapper}>
          <ButtonGroup value={scheduleType} items={sheduleTypes} onChange={onScheduleTypeChange} />
        </View>
      </Item>
      <Item style={styles.containerItem}>
        <Label style={{ flexShrink: 0, width: 120 }}>Preffered Day</Label>
        <View style={styles.buttonGroupWrapper}>
          <ButtonGroup value={prefferedDay} items={weekDays} onChange={onPrefferedDayChange} />
        </View>
      </Item>
      <Item bordered={false} style={styles.headerItem}>
        <Label style={styles.headerText}>PERIOD</Label>
      </Item>
      <Item picker={true} style={styles.containerItem}>
        <Label style={{ width: 90 }}>Start Date</Label>
        <DateTime value={startDate} minDate={new Date()} onChange={onStartDateChange} />
      </Item>
      <Item picker={true} style={styles.containerItem}>
        <Label style={{ width: 90 }}>End Date</Label>
        <DateTime value={endDate} minDate={startDate} onChange={onEndDateChange} />
      </Item>
      <Item bordered={false} style={styles.submitButtonWrapper}>
        <Button
          style={{ backgroundColor: '#499f67' }}
          testID="submitButton"
          onPress={onSubmitPress}
          disabled={!hasNoError}
        >
          <Text>Send request</Text>
        </Button>
      </Item>
    </NativeBaseForm>
  )
}

export default TaskScheduleForm

const styles = StyleSheet.create({
  headerItem: { paddingTop: 15, paddingBottom: 15 },
  headerText: { width: '100%', textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  containerItem: { justifyContent: 'space-around', paddingBottom: 15, paddingTop: 15 },
  buttonGroupWrapper: {
    width: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonWrapper: {
    borderWidth: 0,
    paddingBottom: 15,
    paddingTop: 15,
    justifyContent: 'center',
  },
})
