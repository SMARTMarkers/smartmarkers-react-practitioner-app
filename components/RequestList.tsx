import React, { useCallback } from "react";
import {
  TaskScheduleStatus,
  Task,
  useFhirContext,
} from "../smartmarkers-router";
import { useHistory, useParams } from "../react-router";
import { ListItem, Body, Right, Icon, Text, Spinner, Item } from "native-base";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { setTasksData, setSelectedTask } from "../store/main/actions";
import { Store } from "../store/models";

interface RouteParams {
  patientId: string;
}

const RequestList = () => {
  const { patientId } = useParams<RouteParams>();
  const [isReady, setIsReady] = React.useState(false);
  const { server } = useFhirContext();
  const history = useHistory();
  const dispatch = useDispatch();
  const tasks = useSelector((store: Store) => store.root.tasks);
  const [isheatmap, setIsheatmap] = React.useState<any | null>(null);

  const onItemPressRequest = (t: Task) => {
    if (t.instrument !== undefined) {
      dispatch(setSelectedTask(t));
      history.push(
        `/reportHeatMap/${patientId}/${t.request?.id}/${t.getTitle()}/history`
      );
    }
  };

  const renderRequestListItem = useCallback(
    (
      item: Task,
      key: any,
      onItemPress: (item: Task) => void,
      isLast: boolean
    ) => (
      <ListItem
        key={key}
        underlayColor="transparent"
        onPress={() => onItemPress(item)}
        noBorder
        style={styles.listItem}
      >
        <Body>
          <Text note>
            #{item?.request?.id} |{" "}
            {new Date(
              item?.request?.meta?.lastUpdated as string
            ).toLocaleDateString("en-US")}{" "}
          </Text>
          <Text>
            Instrument: <Text style={styles.title}>{item.getTitle()}</Text>
          </Text>
          <Text>Requested by: {item?.request?.getRequester()} </Text>
        </Body>
        <Right>
          <Icon style={{ color: "#002a78" }} active name="arrow-forward" />
        </Right>
      </ListItem>
    ),
    []
  );

  const renderStatues = (items: Task[], status: string, index: number) => (
    <>
      <ListItem key={status} itemHeader>
        <Text style={{ fontWeight: "bold" }}>{status.toUpperCase()}</Text>
      </ListItem>
      {items.map((item, index) =>
        renderRequestListItem(
          item,
          index,
          onItemPressRequest,
          index == items.length - 1
        )
      )}
    </>
  );

  React.useEffect(() => {
    setIsReady(false);
    const loadItems = async () => {
      if (server) {
        const tasks = (await server.getPatientTasksByRequests(
          "status=active",
          patientId,
          ''
        )) as Task[];
        dispatch(setTasksData(tasks));
      }
      setIsReady(true);
    };
    loadItems();

    const heatmaploadItems = async () => {
      if (server) {
        const tasks = (await server.getPatientTasksByRequests(
          "status=active",
          patientId,
          "data"
        )) as Task[];
        dispatch(setTasksData(tasks));
        setIsheatmap(tasks)
      }
      setIsReady(true);
    };
    heatmaploadItems();
  }, [patientId]);

  if (!isReady && !tasks.length) {
    return <Spinner />;
  }

 const heatmapid = (tasks: any) =>{
   const statusesItems: any = {};
  for (let status of [
    TaskScheduleStatus.Completed,
    TaskScheduleStatus.Due,
    TaskScheduleStatus.Upcoming,
    TaskScheduleStatus.Overdue,
  ]) {
    statusesItems[TaskScheduleStatus[status]] = tasks.filter(
      (value: any) => value.schedule?.status == status
    );
  }
  return (
    <>
      {Object.keys(statusesItems).map(
        (key: string, index) =>
          statusesItems[key] &&
          statusesItems[key].length > 0 &&
          renderStatues(statusesItems[key], key, index)
      )}
    </>
  );
 }

  const statusesItems: any = {};
  for (let status of [
    TaskScheduleStatus.Completed,
    TaskScheduleStatus.Due,
    TaskScheduleStatus.Upcoming,
    TaskScheduleStatus.Overdue,
  ]) {
    statusesItems[TaskScheduleStatus[status]] = tasks.filter(
      (value: any) => value.schedule?.status == status
    );
  }

  return (
    <>
      {Object.keys(statusesItems).map(
        (key: string, index) =>
          statusesItems[key] &&
          statusesItems[key].length > 0 &&
          renderStatues(statusesItems[key], key, index)
      )}
    </>
  );
};

export default RequestList;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#f0f2f8",
    borderRadius: 10,
    marginBottom: 3,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 0,
    fontWeight: "bold",
  },
  title: { color: "#002a78", fontWeight: "bold" },
  note: { color: "#a4a5a6" },
});
