import React, { useState } from 'react'
import { ListItem, Text, Body, Spinner, Button, Right, Icon } from 'native-base'
import { useFhirContext, TaskSchedule, Instrument } from 'smartmarkers-lib'
import { ScrollView } from 'react-native'
import { useParams, useHistory } from 'react-router-dom'
import InstrumentSelectorModal from '../components/InstrumentSelectorModal'
import TaskScheduleForm from '../components/TaskScheduleForm'
import { StyleSheet } from 'react-native'

interface RouteParams {
  patientId: string
}

const CreateNewServiceRequestScreen: React.FC<any> = ({}) => {
  const { patientId } = useParams<RouteParams>()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([])
  const [isReady, setIsReady] = useState(true)
  const { server } = useFhirContext()
  const history = useHistory()

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const renderItem = (item: Instrument, key: any) => {
    const onDelete = () => {
      const newArr = selectedInstruments.filter((i: Instrument) => i.id !== item.id)
      setSelectedInstruments(newArr)
    }
    return (
      <ListItem key={key} underlayColor="white" style={styles.listItem}>
        <Body>
          <Text style={styles.title}>{item.getTitle()}</Text>
          <Text note style={styles.note}>
            {item.getNote()}
          </Text>
        </Body>
        <Right>
          <Icon onPress={onDelete} name="trash" style={{ fontSize: 30, color: '#f22e3b' }} />
        </Right>
      </ListItem>
    )
  }

  const onSubmit = async (item: TaskSchedule) => {
    if (selectedInstruments.length > 0) {
      setIsReady(false)
      selectedInstruments.forEach(
        async (i: Instrument) => await server?.createServiceRequest(i, item, patientId)
      )
      history.push(`/dashboard/${patientId}`)
    }
  }

  const onModalSubmit = (arr: Instrument[]) => setSelectedInstruments(arr)

  if (!isReady) return <Spinner />

  return (
    <ScrollView style={{ padding: 15 }}>
      <InstrumentSelectorModal
        patientId={patientId}
        closeModal={closeModal}
        isOpen={modalIsOpen}
        onSubmit={onModalSubmit}
        instruments={selectedInstruments}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
          width: '100%',
          textAlign: 'center',
        }}
      >
        Creating new service request
      </Text>
      <Button
        style={{ width: 'max-content', marginBottom: 20, backgroundColor: '#002a78' }}
        onPress={openModal}
      >
        <Text>Select instrument</Text>
      </Button>
      {selectedInstruments.map((i: Instrument) => renderItem(i, i.id))}
      {selectedInstruments.length > 0 && <TaskScheduleForm onSubmit={onSubmit} />}
    </ScrollView>
  )
}

export default CreateNewServiceRequestScreen

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#f0f2f8',
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 0,
    marginRight: 0,
  },
  title: { color: '#002a78', fontWeight: 'bold' },
  note: { color: '#a4a5a6' },
})
