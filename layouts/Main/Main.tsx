import React from "react";
import { useHistory } from "../../react-router";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Title,
  Right,
  Body,
  Left,
  Footer,
  Text,
} from "native-base";
import { useFhirContext } from "../../smartmarkers-router";
import { StyleSheet } from "react-native";

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ ...props }) => {
  const { children } = props;
  const history = useHistory();
  const { isAuthenticated } = useFhirContext();

  const showBackArrow = [
    "not-found",
    "settings",
    "create-new-service-request",
    "reportHeatMap",
    "allpatientdata",
  ].includes(history.location.pathname.split("/")[1]);

  const onPersonPress = () => {
    history.push("/settings");
  };

  const goBack = () => history.goBack();

  const onGetAllPatientsData = () => {
    history.push(`/allpatientdata`);
  };

  return (
    <Container style={styles.container}>
      <Header style={styles.header}>
        {showBackArrow && (
          <Left>
            <Button transparent onPress={goBack}>
              <Icon name="md-arrow-back" />
            </Button>
          </Left>
        )}

        {isAuthenticated && !showBackArrow && (
          <Left style={{ flexGrow: 2 }}>
            <Button
            onPress={onGetAllPatientsData}
            style={styles.newRequestButton}
          >
            <Text>All Patients Data</Text>
          </Button>
          </Left>
        )}
        <Body style={{ flexGrow: 8 }}>
          {
            <Title style={{ alignSelf: "center" }}>
              Patient Reported Outcomes
            </Title>
          }
        </Body>
        {isAuthenticated && (
          <Right>
            <Button transparent onPress={onPersonPress}>
              <Icon name="person" />
            </Button>
          </Right>
        )}
      </Header>
      <Content style={styles.content}>{children}</Content>
      <Footer
        style={{
          height: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", paddingLeft: 30, fontSize: 14 }}>
          Copyright Boston Children’s Hospital
        </Text>
      </Footer>
    </Container>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexGrow: 0,
    backgroundColor: "#083892",
  },
  content: {
    flexGrow: 1,
  },
  newRequestButton: {
    alignSelf: "center",
    marginRight: "auto"
  },
});
