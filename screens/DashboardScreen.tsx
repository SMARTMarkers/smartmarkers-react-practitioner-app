import React, { useState, useCallback, useEffect, useMemo } from "react";
import { List, ListItem, Text, View, Icon, Button } from "native-base";
import { IPatient, useFhirContext, Server } from "../smartmarkers-router";
import { Platform, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ResponseView from "../components/ResponseView";
import CreateNewServiceRequestScreen from "./CreateNewServiceRequestScreen";
import { Switch, Route, useHistory, useParams } from "../react-router";
import RequestList from "../components/RequestList";
import ReportList from "../components/ReportList";
import FhirResource from "../components/FhirResource";
import PatientList from "../components/PatientList";
import { getPatientName } from "../utils";
import { setSelectedPatient } from "../store/main/actions";
import { Store } from "../store/models";

const getPatient = async (
  patientId: string,
  callback: any,
  server?: Server
) => {
  const patients = await server?.getPatients(`_id=${patientId}`);
  patients && patients[0] && callback(patients[0]);
};

const DashboardScreen: React.FC<any> = () => {
  const { server } = useFhirContext();
  const selectedPatient = useSelector(
    (store: Store) => store.root.selectedPatient
  );
  const dispatch = useDispatch();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          backgroundColor: "#d2d2e2",

          width: "100%",
          height:
            Platform.OS === "web"
              ? "calc(100vh - 87px)"
              : Dimensions.get("window").height - 110,
        },
        patientsSection: {
          paddingLeft: 0,
          maxWidth: 350,
          minWidth: 240,
          flex: 1,
        },
        patientsScrollView: {
          height:
            Platform.OS === "web"
              ? "calc(100vh - 180px)"
              : Dimensions.get("window").height - 180,
          backgroundColor: "#d2d2e2",
        },
        patientsHeader: {
          color: "#5d5d5d",
          fontSize: 24,
          textAlign: "center",
          width: "100%",
        },
        content: {
          // flexGrow: 1,
          backgroundColor: "white",
          // alignSelf: 'stretch',
          marginTop: 0,
          overflow: "hidden",
          padding: 20,
          flex: 1,
          borderLeftWidth: 1,
          height: "100%",
          width: Dimensions.get("window").width - 350,
        },
        contentScrollView: { height: "100%", margin: 0, maxWidth: "100%" },
        contentHeader: {
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingBottom: 15,
          borderBottomColor: "gray",
          borderBottomWidth: 1,
        },
        newRequestButton: {
          alignSelf: "center",
        },
      }),
    [Dimensions]
  );

  const history = useHistory();
  const backArrowIsVisible = history.location.pathname.split("/").length > 3;
  const { patientId } = useParams<any>();

  useEffect(() => {
    if (patientId && !selectedPatient) {
      getPatient(
        patientId,
        (patient: IPatient) => dispatch(setSelectedPatient(patient)),
        server || undefined
      );
    }
  }, [patientId]);

  const onItemPress = useCallback(async (item: IPatient) => {
    history.push(`/dashboard/${item.id}`);
    dispatch(setSelectedPatient(item));
  }, []);

  const onCreateNewRequest = () =>
    history.push(`/create-new-service-request/${selectedPatient!.id}`);

  const onGetAllPatientsData = () => {
    history.push(`/allpatientdata`);
  };
  return (
    <View style={styles.container}>
      <List style={styles.patientsSection}>
        <ListItem itemHeader>
          <Text style={styles.patientsHeader}>Patients</Text>
        </ListItem>
        <ScrollView style={styles.patientsScrollView}>
          <PatientList
            selectedPatientId={selectedPatient?.id}
            filter={"_summary=True"}
            onItemPress={onItemPress}
          />
        </ScrollView>
      </List>
      <View style={styles.content}>
        {selectedPatient && (
          <View style={styles.contentHeader}>
            {backArrowIsVisible && (
              <Button transparent onPress={() => history.goBack()}>
                <Icon
                  name="arrow-back"
                  style={{ fontSize: 30, fontWeight: "bold", color: "#002a78" }}
                />
              </Button>
            )}
            <View style={{ flexGrow: 2 }}>
              <Text
                style={{
                  fontSize: 34,
                  fontWeight: "bold",
                  flexGrow: 1,
                  color: "#000",
                }}
              >
                {`Name: ${getPatientName(selectedPatient)}`}
              </Text>
              <Text
                style={{ color: "gray" }}
              >{`Gender: ${selectedPatient.gender}`}</Text>
              <Text
                style={{ color: "gray" }}
              >{`Date of Birth: ${selectedPatient.birthDate}`}</Text>
              <Text
                style={{ color: "gray" }}
              >{`MRN: ${selectedPatient.id}`}</Text>
            </View>
            <Button
              onPress={onCreateNewRequest}
              style={styles.newRequestButton}
            >
              <Text>New request</Text>
            </Button>
          </View>
        )}

        <ScrollView style={styles.contentScrollView}>
          <Switch>
            <Route exact path="/dashboard/:patientId">
              <RequestList />
            </Route>
            <Route exact path="/dashboard/create-new-service-request">
              <CreateNewServiceRequestScreen
                patientId={selectedPatient?.id || ""}
              />
            </Route>
            <Route
              exact
              path="/dashboard/:patientId/:requestId/:instrumentTitle/history"
            >
              <ReportList />
            </Route>
            <Route
              exact
              path="/dashboard/:patientId/:requestId/history/:reportId/report"
            >
              <ResponseView />
            </Route>
            <Route path="/dashboard/:patientId/:requestId/history/:reportId/resource">
              <FhirResource />
            </Route>
          </Switch>
        </ScrollView>
      </View>
    </View>
  );
};

export default DashboardScreen;
