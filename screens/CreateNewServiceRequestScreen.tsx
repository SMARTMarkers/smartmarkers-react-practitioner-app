import React, { useState } from "react";
import {
  ListItem,
  Text,
  Body,
  Spinner,
  Button,
  Right,
  Icon,
  View,
} from "native-base";
import {
  useFhirContext,
  TaskSchedule,
  Instrument,
} from "../smartmarkers-router";
import { ScrollView } from "react-native";
import { useParams, useHistory } from "../react-router";
import InstrumentSelectorModal from "../components/InstrumentSelectorModal";
import TaskScheduleForm from "../components/TaskScheduleForm";
import { StyleSheet } from "react-native";
import { Platform } from "react-native";
import { Modal } from "../tools/Modal";
import {
  setReports,
  setSelectedReport,
  setTasksData,
} from "../store/main/actions";
import { useDispatch } from "react-redux";

interface RouteParams {
  patientId: string;
}

const CreateNewServiceRequestScreen: React.FC<any> = ({}) => {
  const { patientId } = useParams<RouteParams>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(
    []
  );
  const [isReady, setIsReady] = useState(true);
  const { server } = useFhirContext();
  const history = useHistory();

  const [successInstruments, setSuccessInstruments] = useState<Instrument[]>(
    []
  );
  const [errorInstruments, setErrorInstruments] = useState<Instrument[]>([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const dispatch = useDispatch();

  const renderItem = (item: Instrument, key: any) => {
    const onDelete = () => {
      const newArr = selectedInstruments.filter(
        (i: Instrument) => i.id !== item.id
      );
      setSelectedInstruments(newArr);
    };
    return (
      <ListItem key={key} underlayColor="white" style={styles.listItem}>
        <Body>
          <Text style={styles.title}>{item.getTitle()}</Text>
          <Text note style={styles.note}>
            {item.getNote()}
          </Text>
        </Body>
        <Right>
          <Icon
            onPress={onDelete}
            name="trash"
            style={{ fontSize: 30, color: "#f22e3b" }}
          />
        </Right>
      </ListItem>
    );
  };

  const onSubmit = async (item: TaskSchedule) => {
    if (selectedInstruments.length > 0) {
      setIsReady(false);
      const successData: Instrument[] = [];
      const errorData: Instrument[] = [];
      for (const i of selectedInstruments) {
        await server
          ?.createServiceRequest(i, item, patientId)
          .then((res: any) => {
            successData.push(i);
          })
          .catch((e: any) => {
            errorData.push(i);
          });
      }
      setSuccessInstruments(successData);
      setErrorInstruments(errorData);
    }
  };

  const onModalSubmit = (arr: Instrument[]) => setSelectedInstruments(arr);

  const goToHomePage = () => {
    dispatch(setTasksData([]));
    dispatch(setReports([]));
    dispatch(setSelectedReport(null));
    history.push(`/dashboard/${patientId}`);
  };

  if (successInstruments.length || errorInstruments.length) {
    return (
      <Modal animationType="fade" animated transparent visible={true}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
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
            }}
          >
            {!!successInstruments.length && (
              <>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
                >
                  Following requests have been sent successfully:
                </Text>
                <View>
                  {successInstruments.map((i: Instrument) => (
                    <Text key={i.id} style={{ color: "#499f67" }}>
                      {i.getTitle()}
                    </Text>
                  ))}
                </View>
              </>
            )}
            {!!errorInstruments.length && (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 20,
                    marginTop: 20,
                  }}
                >
                  Following requests failed to sent:
                </Text>
                <View>
                  {errorInstruments.map((i: Instrument) => (
                    <Text key={i.id} style={{ color: "#f22e3b" }}>
                      {i.getTitle}
                    </Text>
                  ))}
                </View>
              </>
            )}
            <Button
              style={{ backgroundColor: "#499f67", marginTop: 20 }}
              onPress={goToHomePage}
            >
              <Text>Ok</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }

  if (!isReady) return <Spinner />;

  return (
    <ScrollView style={styles.container}>
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
          fontWeight: "bold",
          marginBottom: 20,
          width: "100%",
          textAlign: "center",
        }}
      >
        Creating new service request
      </Text>
      <Button
        style={{
          alignSelf: "flex-start",
          marginBottom: 20,
          backgroundColor: "#002a78",
        }}
        onPress={openModal}
      >
        <Text>Select instrument</Text>
      </Button>
      {selectedInstruments.map((i: Instrument) => renderItem(i, i.id))}
      {selectedInstruments.length > 0 && (
        <TaskScheduleForm onSubmit={onSubmit} />
      )}
    </ScrollView>
  );
};

export default CreateNewServiceRequestScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: Platform.OS === "web" ? "calc(100vh - 90px)" : undefined,
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
});
