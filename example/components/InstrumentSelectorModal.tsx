import React, { useState, useEffect } from 'react'
import { ListItem, Text, Body, View, Button, Right, Icon } from 'native-base'
import { Instrument, InstrumentType, InstrumentList } from 'smartmarkers-lib'
import { Modal } from '../tools/Modal'
import { ScrollView } from 'react-native'

interface InstrumentSelectorModalProps {
  patientId: string
  closeModal: () => void
  isOpen: boolean
  onSubmit: (instruments: Instrument[]) => void
  instruments: Instrument[]
}

const InstrumentSelectorModal: React.FC<InstrumentSelectorModalProps> = ({
  patientId,
  closeModal,
  isOpen,
  onSubmit,
  instruments,
}) => {
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(instruments)

  useEffect(() => {
    setSelectedInstruments(instruments)
  }, [instruments])

  const onPress = (instrument: Instrument) => {
    const filterArr = selectedInstruments.filter((i: Instrument) => i.id !== instrument.id)
    if (filterArr.length < selectedInstruments.length) {
      setSelectedInstruments(filterArr)
    } else {
      setSelectedInstruments([...selectedInstruments, instrument])
    }
  }

  const renderItem = (item: Instrument, key: any, onItemPress: (i: Instrument) => void) => {
    const isSelected = selectedInstruments.some((i: Instrument) => i.id === item.id)
    return (
      <ListItem
        key={key}
        onPress={() => onItemPress(item)}
        underlayColor="white"
        style={{
          backgroundColor: '#f0f2f8',
          borderRadius: 10,
          marginBottom: 3,
          paddingLeft: 15,
          paddingRight: 15,
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <Body>
          <Text style={{ color: '#002a78', fontWeight: 'bold' }}>{item.getTitle()}</Text>
          <Text note style={{ color: '#a4a5a6' }}>
            {item.getNote()}
          </Text>
        </Body>
        <Right>
          {isSelected && <Icon name="checkmark" style={{ fontSize: 30, color: '#499f67' }} />}
        </Right>
      </ListItem>
    )
  }

  const onSelectAll = () => {
    onSubmit(selectedInstruments)
    closeModal()
  }

  return (
    <Modal
      animationType="fade"
      animated
      transparent
      visible={isOpen}
      onRequestClose={() => {
        console.log('Modal has been closed.')
      }}
    >
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 35,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          height: 'calc(100% - 40px)',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Select instruments
        </Text>
        <ScrollView style={{ width: '100%', flexGrow: 1 }}>
          <InstrumentList
            type={InstrumentType.Questionnaire}
            onItemPress={onPress}
            patientId={patientId}
            renderItem={renderItem}
          />
        </ScrollView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: 172,
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <Button style={{ backgroundColor: '#499f67' }} onPress={onSelectAll}>
            <Text>select</Text>
          </Button>
          <Button style={{ backgroundColor: '#f22e3b' }} onPress={closeModal}>
            <Text>close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}

export default InstrumentSelectorModal
