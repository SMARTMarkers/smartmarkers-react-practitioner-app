import React, { useCallback } from "react";
import {
  IPatient,
  AdministrativeGender,
  useFhirContext,
} from "../smartmarkers-router";
import { ListItem, Left, Body, Text, Icon, Spinner, Button } from "native-base";

import { getPatientName, calculateAge } from "../utils";
import { FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../store/main/actions";
import { Store } from "../store/models";
import axios from 'axios'

interface PatientListProps {
  filter?: string;
  onItemPress: (item: IPatient) => void;
  selectedPatientId?: string;
}

const getGenderIcon = (gender?: AdministrativeGender) => {
  let iconName: string = "";
  let color: string = "";
  if (gender === AdministrativeGender.Male) {
    iconName = "male";
    color = "#7f7fac";
  } else if (gender === AdministrativeGender.Female) {
    iconName = "female";
    color = "#7f7fac";
  }

  if (!iconName) return null;

  return (
    <Icon
      style={{ fontSize: 22, width: "auto", color }}
      active
      name={iconName}
    />
  );
};

const PatientList: React.FC<PatientListProps> = ({
  onItemPress,
  filter,
  selectedPatientId,
}) => {
  const patients = useSelector((store: Store) => store.root.patients);
  const [isReady, setIsReady] = React.useState(false);
  const { server } = useFhirContext();
  const dispatch = useDispatch();
  const [count, setcount] = React.useState(0);
  const [isNext, setIsNext] = React.useState(false);
  const [Url, setUrl] = React.useState(`https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImoiOiIxIiwiZSI6ImVmYjVkNGNlLWRmZmMtNDdkZi1hYTZkLTA1ZDM3MmZkYjQwNyJ9/fhir/Patient?_summary=True`);


 

  const renderItem = useCallback(
    (item: IPatient) => {
      const backgroundColor =
        selectedPatientId === item.id ? "#babad3" : "transparent";
      return (
        <ListItem
          underlayColor="transparent"
          style={[styles.listItem, { backgroundColor }]}
          key={item.id}
          onPress={() => onItemPress(item)}
          noBorder
        >
          <Left style={styles.genderSection}>{getGenderIcon(item.gender)}</Left>
          <Body>
            <Text style={{ color: "black" }}>{getPatientName(item)}</Text>
            <Text style={{ color: "#6e86b5" }} note>
              {calculateAge(new Date(item.birthDate?.toString() || ""))}
            </Text>
          </Body>
        </ListItem>
      );
    },
    [selectedPatientId, filter, onItemPress]
  );

  const commonapi = async (response:any) =>{
    let resdata : any[] = []
    let newdata : IPatient[] = []
          resdata = response?.data?.entry;
          for (let j = 0; j < response.data.link.length; j++) {
            if(response.data.link[j].relation === 'next'){
              setUrl(response.data.link[j].url)
              setIsNext(true)
            }
            if (response.data.entry.length < 50){
              setIsNext(false);
            }         
          }
          for(let i=0 ; i<resdata.length; i++ ){
            newdata.push(resdata[i].resource)
          }
          dispatch(setPatients([...patients,...newdata]));
          setIsReady(true);
  }
  
  React.useEffect(() => {
    const loadItems = async () => {
      if (server) {
        const response = await server?.getPatientsbyaxios(filter,''); 
        if (response) {
          commonapi(response)
        }
      }
    }
    loadItems();
  }, []);

  if (!isReady && !patients.length) {
    return <Spinner />;
  }
  const renderItemFunc = ({ item, index }: ListRenderItemInfo<IPatient>) => {
    const elements: React.ReactElement = renderItem(item) as React.ReactElement;
    return elements || null;
  };

  const handleOnEndReached = async () => {
    if (isNext) {
      if (server) {
        const response = await server?.getPatientsbyaxios('',Url);
        if (response) {
          commonapi(response)
        }
      }
    }
  };

  if (patients?.length) {
    return (
      <>
      <FlatList
        data={patients || []}
        renderItem={renderItemFunc}
        keyExtractor={(item) => item.id}
        extraData={selectedPatientId}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
      />
      </>
    );
  } else {
    return (
      <ListItem>
        <Body>
          <Text note>NO PATIENTS</Text>
        </Body>
      </ListItem>
    );
  }
};

export default PatientList;

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  listItemSelected: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#babad3",
  },
  genderSection: {
    height: 38,
    maxWidth: 38,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderColor: "#7f7fac",
    borderWidth: 2,
    borderStyle: "solid",
  },
});
