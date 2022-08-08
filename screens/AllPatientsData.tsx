import React, { useState } from "react";
import {
  Text,
  List,
  ListItem,
  Left,
  Button,
  Icon,
  Body,
  Right,
  View,
  Col,
  Row,
  Spinner,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../store/models";
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
import { StyleSheet, Dimensions } from "react-native";
import { str } from "./resource2";

const AllPatientsData: React.FC<any> = () => {
  const [isReady, setIsReady] = React.useState(false);
  const reports = useSelector((store: Store) => store.root.reports);
  const [maxRangeValue, setMaxRangeValue] = useState<number>();
  const [sectionData, setSectionData] = useState<IHeatMap[]>([]);

  React.useEffect(() => {
    loadBulkResponse();
  }, []);

  const loadBulkResponse = async () => {
    let arr: any = [];
    let objcs = str.split("\n");
    objcs.forEach((element) => {
      let a = IsJsonString(element);
      arr.push(a);
    });
    let heatMapObj = TransformReports(arr, {});
    setSectionData(heatMapObj.heatMapArray);
    setMaxRangeValue(heatMapObj.maxCount);
    setIsReady(true);
  };

  const IsJsonString = (str: any) => {
    try {
      var json = JSON.parse(str);
      return json;
    } catch (e) {
      return false;
    }
  };

  const getHeatMap = () => {
    if (!isReady) {
      return <Spinner />;
    }

    if (maxRangeValue) {
      return (
        <>
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
          <ListItem>
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
    <ListItem itemHeader>
        <Text note>HEAT MAP</Text>
      </ListItem>
      {getHeatMap()}
    </List>
  );
};

export default AllPatientsData;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#f0f2f8",
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 0,
    marginLeft: 0,
    paddingRight: 15,
  },
  title: { color: "#002a78", fontWeight: "bold" },
  note: { color: "#a4a5a6" },
});
