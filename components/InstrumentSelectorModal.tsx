import React, { useState, useEffect, useMemo } from "react";
import {
  ListItem,
  Text,
  Body,
  View,
  Button,
  Right,
  Icon,
  Tabs,
  Tab,
} from "native-base";
import {
  Instrument,
  InstrumentType,
  InstrumentList,
} from "../smartmarkers-router";
import { Modal } from "../tools/Modal";
import { Dimensions, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Store } from "../store/models";
import { useParams, useHistory } from "../react-router";


interface InstrumentSelectorModalProps {
  patientId: string;
  closeModal: () => void;
  isOpen: boolean;
  onSubmit: (instruments: Instrument[]) => void;
  instruments: Instrument[];
}

const InstrumentSelectorModal: React.FC<InstrumentSelectorModalProps> = ({
  patientId,
  closeModal,
  isOpen,
  onSubmit,
  instruments,
}) => {
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(
    instruments
  );
  const Task = useSelector((store: Store) => store.root.tasks);
  const history = useHistory();
  const [maxHeight, setMaxHeight] = useState(200);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSelectVisible, setSelectVisible] = useState(false);


  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: "rgba(0,0,0,0.7)",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        listItem: {
          backgroundColor: "#f0f2f8",
          borderRadius: 10,
          marginBottom: 3,
          paddingLeft: 15,
          paddingRight: 15,
          marginLeft: 0,
          marginRight: 0,
        },
        title: { color: "#002a78", fontWeight: "bold" },
        note: { color: "#a4a5a6" },
        modalContent: {
          justifyContent: "space-between",
          alignItems: "center",
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          width: "90%",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          height: Dimensions.get("window").height - 80,
        },
        buttonsGroup: {
          display: "flex",
          flexDirection: "row",
          width: 172,
          justifyContent: "space-between",
          marginTop: 20,
        },
        popup: {
          backgroundColor: "rgba(0,0,0,0.7)",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        popupcontainer: {
          justifyContent: "space-between",
              alignItems: "center",
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
        }
      }),
    [Dimensions]
  );

  useEffect(() => {
    setSelectedInstruments(instruments);
  }, [instruments]);

  const onPress = (instrument: Instrument) => {
    const filterArr = selectedInstruments.filter(
      (i: Instrument) => i.id !== instrument.id
    );
    if (filterArr.length < selectedInstruments.length) {
      setSelectedInstruments(filterArr);
    } else {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const renderItem = (
    item: Instrument,
    key: any,
    onItemPress: (i: Instrument) => void
  ) => {
    const isSelected = selectedInstruments.some(
      (i: Instrument) => i.id === item.id
    );
    return (
      <ListItem
        key={key}
        onPress={() => onItemPress(item)}
        underlayColor="white"
        style={styles.listItem}
      >
        <Body>
          <Text style={styles.title}>{item.getTitle()}</Text>
          <Text note style={styles.note}>
            {item.getNote()}
          </Text>
        </Body>
        <Right>
          {isSelected && (
            <Icon name="checkmark" style={{ fontSize: 30, color: "#499f67" }} />
          )}
        </Right>
      </ListItem>
    );
  };

  const onSelectAll = () => {
    if (selectedInstruments.length > 0) {
    onSubmit(selectedInstruments);
    closeModal();
  }
  else{
    setSelectVisible(true)
   }
  };

  const goToHomePage = () => {
    history.push(`/dashboard/${patientId}`);
  };

  const closePopUp = () =>{
    setSelectVisible(false);
  }

  const getHeight = (layout: any) => {
    layout && layout.height && setMaxHeight(layout.height - 100);
  };

  return (
    <>
    <Modal animationType="fade" animated transparent visible={isOpen}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            Select instruments
          </Text>
          <View
            onLayout={(event: any) => getHeight(event.nativeEvent.layout)}
            style={{
              width: "100%",
              flexGrow: 1,
              maxHeight: Dimensions.get("window").height - 120,
            }}
          >
            <Tabs
              contentProps={{ style: { maxHeight: "100%" } }}
              tabContainerStyle={{ maxHeight: "100%" }}
              style={{ maxHeight: "100%" }}
            >
              <Tab
                activeTabStyle={{ backgroundColor: "#083892" }}
                tabStyle={{ backgroundColor: "#002a78" }}
                heading="Surveys"
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
                >
                  Questionnaires
                </Text>
                <View style={{ maxHeight }}>
                  <InstrumentList
                    type={InstrumentType.Questionnaire}
                    onItemPress={onPress}
                    patientId={patientId}
                    renderItem={renderItem}
                    selectedArr={selectedInstruments}
                  />
                </View>
              </Tab>
              <Tab
                activeTabStyle={{
                  backgroundColor: "#083892",
                  maxHeight: "100%",
                }}
                tabStyle={{ backgroundColor: "#002a78", maxHeight: "100%" }}
                heading="PROMIS Instruments"
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
                >
                  Computer Adaptive Questionnaires
                </Text>
                <View style={{ maxHeight }}>
                  <InstrumentList
                    type={InstrumentType.Questionnaire}
                    onItemPress={onPress}
                    patientId={patientId}
                    renderItem={renderItem}
                    usePromis
                    filter={"_summary=true"}
                    selectedArr={selectedInstruments}
                  />
                </View>
              </Tab>
            </Tabs>
          </View>
          <View style={styles.buttonsGroup}>
            <Button
              style={{ backgroundColor: "#499f67" }}
              onPress={onSelectAll}
            >
              <Text>select</Text>
            </Button>
            <Button style={{ backgroundColor: "#f22e3b" }} onPress={closeModal}>
              <Text>close</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
    
    <Modal visible={isModalVisible}>
      <View style={styles.popup}>
        <View style={styles.popupcontainer}>
         <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Already submitted the questionnaire for this Patient
          </Text>
          <View>
            {selectedInstruments.map((i: Instrument) => (
              <Text key={i.id} style={{ color: "#499f67" }}>
                {i.getTitle()}
              </Text>
            ))}
          </View>
          <Button
          style={{ backgroundColor: "#499f67", marginTop: 20 }}
          onPress={goToHomePage}>
          <Text>Ok</Text>
          </Button>
        </View>
        </View>
      </Modal>

      <Modal visible={isSelectVisible} transparent>
      <View style={styles.popup}>
        <View style={styles.popupcontainer}>
         <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Please select the Questionnaire
          </Text>
          <Button
          style={{ backgroundColor: "#499f67", marginTop: 20 }}
          onPress={closePopUp}>
          <Text>Ok</Text>
          </Button>
        </View>
        </View>
      </Modal>
    </>
  );
};

export default InstrumentSelectorModal;
