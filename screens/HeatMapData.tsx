import React, { useState } from "react";
import {
  ReportType,
  useFhirContext,
  ReportFactory,
  HeatMap,
  TransformReports,
  IHeatMap,
} from "../smartmarkers-router";
import { useHistory, useParams } from "react-router-dom";
import {
  ListItem,
  Body,
  Text,
  Spinner,
  View,
  List,
} from "native-base";
import { StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../store/models";
import {
  setReports,
} from "../store/main/actions";

interface RouteParams {
  patientId: string;
  requestId: string;
}

export const HeatMapData: React.FC<any> = () => {
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
  const reports = useSelector((store: Store) => store.root.reports);
  const selectedTasks = useSelector((store: Store) => store.root.selectedTask);
  const dispatch = useDispatch();

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
        if (reports.length > 0) {
          let heatMapObj = TransformReports(reports, selectedTasks);
          setSectionData(heatMapObj.heatMapArray);
          setMaxRangeValue(heatMapObj.maxCount);
        }
      }
      setIsReady(true);
    };
    loadItems();
  }, [requestId, user, user?.id]);
  
  const titledata= () =>{
    return(
        <View style = {styles.metadata}>
        <Text style={{ color: "gray" }}>Tittle - {selectedTask?.instrument?.getTitle()}</Text>
        <Text style={{ color: "gray" }}>Subtitle - Number of Responses: {selectedTask?.instrument?.item.length}</Text>
        </View>
        )
  }

  const getHeatMap = () => {
    if (!isReady && !reports.length) {
      return <Spinner />;
    }

    if (reports?.length && maxRangeValue) {
      return (
        <>
          {titledata()}
          <HeatMap
            sections={sectionData}
            colors={["#F0B22C", "#E77F24", "#E04931", "#732671"]}
            maxValue={maxRangeValue}
          />
        </>
      );
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
      {getHeatMap()}
    </List>
  );
};

export default HeatMapData;

const styles = StyleSheet.create({
  metadata: {
    justifyContent: "center",
    alignItems: "center"
  }
});
