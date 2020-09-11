import React from 'react'
import { List, ListItem, Text, Body, Spinner } from 'native-base'
import {
  useFhirContext,
  TaskScheduleForm,
  TaskSchedule,
  Instrument,
  InstrumentType,
} from 'smartmarkers-lib'

interface CreateServiceRequestScreenProps {
  instrumentId: string
  patientId: string
  onSubmitCallback?: () => void
}

const CreateServiceRequestScreen: React.FC<CreateServiceRequestScreenProps> = ({
  patientId,
  instrumentId,
  onSubmitCallback,
}) => {
  const [instrument, setInstrument] = React.useState<Instrument | undefined>(undefined)
  const [isReady, setIsReady] = React.useState(false)
  const { server } = useFhirContext()

  React.useEffect(() => {
    const loadInstrument = async () => {
      const instrument = await server?.getInstrument(InstrumentType.Questionnaire, instrumentId)
      setInstrument(instrument)
      setIsReady(true)
    }
    loadInstrument()
  }, [])

  const onSubmit = async (item: TaskSchedule) => {
    if (instrument) {
      setIsReady(false)
      await server?.createServiceRequest(instrument, item, patientId)
      onSubmitCallback && onSubmitCallback()
    }
  }

  if (!isReady) {
    return <Spinner />
  }

  return (
    <List>
      <ListItem noIndent>
        <Body>
          <Text>Create Service Request with {instrument?.getTitle()}</Text>
        </Body>
      </ListItem>
      <TaskScheduleForm onSubmit={onSubmit} />
    </List>
  )
}

export default CreateServiceRequestScreen
