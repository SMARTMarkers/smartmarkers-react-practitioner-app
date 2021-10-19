import React, { useState } from "react";
import {
  ReportType,
  Report,
  useFhirContext,
  ReportFactory,
  PromisLineChart,
  HeatMap,
  TransformReports,
  IHeatMap,
} from "../smartmarkers-router";
import { useHistory, useParams } from "react-router-dom";
import {
  ListItem,
  Body,
  Right,
  Icon,
  Text,
  Spinner,
  View,
  Button,
  Row,
  Col,
  List,
} from "native-base";
import { StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../store/models";
import {
  setReports,
  setSelectedReport,
  setSelectedPatient,
} from "../store/main/actions";
import { getPatientName } from "../utils";
import HeatMapData from "./HeatMapData";

interface RouteParams {
  patientId: string;
  requestId: string;
}

const ReportHeatMapList: React.FC = () => {
  const { patientId, requestId } = useParams<RouteParams>();
  const [sectionData, setSectionData] = useState<IHeatMap[]>([]);
  const [maxRangeValue, setMaxRangeValue] = useState<number>();

  const history = useHistory();
  const selectedTask = useSelector((store: Store) => store.root.selectedTask);
  const selectedPatient = useSelector(
    (store: Store) => store.root.selectedPatient
  );

  const [isReady, setIsReady] = React.useState(false);
  const { user, server } = useFhirContext();
  const [chartWidth, setChartWidth] = useState(0);
  const reports = useSelector((store: Store) => store.root.reports);
  const selectedTasks = useSelector((store: Store) => store.root.selectedTask);
  const dispatch = useDispatch();
  const ids = [
    "87a339d0-8cae-418e-89c7-8651e6aab3c6",
    "67cbf090-4ddb-4799-99ff-a28abe2740b1",
    "c20ccf5d-19ac-4dfe-bdc3-3d1d6344facc",
    "d64b37f5-d3b5-4c25-abe8-23ebe8f5a04e",
    "bfe0a5d7-986b-46ed-b355-9ca232c4688e",
    "cd94c5d0-a196-4991-bdcc-6923d6590598",
    "b218cee9-019d-47a4-b161-e97c0fd6f736",
    "32cd9fa4-7a32-4de1-bce2-548e37151540",
  ];

  const onCreateNewRequest = () =>
    history.push(`/create-new-service-request/${selectedPatient!.id}`);

  React.useEffect(() => {
    const loadItems = async () => {
      if (server) {
        const items = await server?.getPatientReports(
          ReportType.QuestionnaireResponse,
          `patient=${patientId}&based-on=ServiceRequest/${requestId}`,
          false
        );
        const factory = new ReportFactory(server);
        const reports = items.map((i: any) => factory.createReport(i));
        dispatch(setReports(reports));
      }
      setIsReady(true);
    };
    loadItems();
  }, [requestId, user, user?.id]);

  const onPress = (r: Report) => {
    dispatch(setSelectedReport(r));
    history.push(`/dashboard/${patientId}/${requestId}/history/${r.id}/report`);
  };

  const renderItem = (item: Report, key: any) => (
    <>
      <ListItem
        key={item.id}
        onPress={() => onPress(item)}
        style={styles.listItem}
      >
        <Row>
          <Body>
            <Text style={styles.title}>
              {new Date(item?.meta?.lastUpdated as string).toLocaleDateString(
                "en-US"
              )}
              <Text style={styles.time}>
                &nbsp;
                {new Date(item.meta?.lastUpdated as string).toLocaleTimeString(
                  "en-US"
                )}
              </Text>
            </Text>
            <Text note style={styles.note}>
              {item.getNote()}
            </Text>
          </Body>
          <Right>
            <Icon style={{ color: "#002a78" }} active name="arrow-forward" />
          </Right>
        </Row>
      </ListItem>
    </>
  );

  const getRequestList = () => {
    if (!isReady && !reports.length) {
      return <Spinner />;
    }

    if (reports?.length) {
      return <>{reports?.map((item, index) => renderItem(item, index))}</>;
    } else {
      return (
        <>
          <ListItem style={{ marginLeft: 0 }}>
            <Body>
              <Text note>No Responses Found</Text>
            </Body>
          </ListItem>
        </>
      );
    }
  };

  return (    
    <List>
    <View style={{ padding: 10 }}>
        {selectedPatient && (
          <Row
            size={12}
            style={{
              borderBottomColor: "gray",
              borderBottomWidth: 1,
              paddingBottom: 15,
            }}
          >
            <Col size={9}>
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
            </Col>
            <Col size={3} style={{ justifyContent: "center" }}>
              <Button
                onPress={onCreateNewRequest}
                style={styles.newRequestButton}
              >
                <Text>New request</Text>
              </Button>
            </Col>
          </Row>
        )}
        </View>
        <PromisLineChart responses={reports} />
      <View style={{ margin: 15 }}>
        <Text style={styles.headerTitle}>
          {selectedTask?.instrument?.getTitle()}
        </Text>
        <Text note>Questionnaire</Text>
      </View>
      <ListItem itemHeader>
        <Text>RESPONSES</Text>
      </ListItem>
      {getRequestList()}
      <ListItem itemHeader>
        <Text>HEAT MAP</Text>
      </ListItem>
      <HeatMapData/>
    </List>
  );
};

export default ReportHeatMapList;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#f0f2f8",
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 0,
    marginLeft: 15,
    marginRight:15,
    paddingRight: 15,
  },
  title: { color: "#002a78", fontWeight: "bold" , marginLeft: 29 },
  time:{ color: "#a7a7a7" },
  note: { color: "#a4a5a6", marginLeft: 29 },
  headerTitle: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: "#575757",
    marginTop: 10,
    marginBottom: 6,
  },
  content: {
    backgroundColor: "white",
    marginTop: 0,
    overflow: "hidden",
    padding: 20,
    flex: 1,
    borderLeftWidth: 1,
    height: "100%",
    width: Dimensions.get("window").width,
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
    justifyContent: "center",
    alignSelf: "center",
  },
});
