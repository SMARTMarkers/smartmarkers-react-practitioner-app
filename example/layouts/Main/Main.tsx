import React from 'react'
import { useHistory } from '../../react-router'
import { Container, Header, Content, Button, Icon, Title, Right, Body, Left } from 'native-base'
import { useFhirContext } from 'smartmarkers-lib'
import { StyleSheet } from 'react-native'

interface MainProps {
  children: React.ReactNode
}

const Main: React.FC<MainProps> = ({ ...props }) => {
  const { children } = props
  const history = useHistory()
  const { isAuthenticated } = useFhirContext()

  const showBackArrow = ['not-found', 'settings', 'create-new-service-request'].includes(
    history.location.pathname.split('/')[1]
  )

  const onPersonPress = () => {
    history.push('/settings')
  }

  const goBack = () => history.goBack()

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

        <Body style={{ flexGrow: 5 }}>
        {<Title style={{ alignSelf: 'center' }}>
            Patient Reported Outcomes
        </Title>}
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
    </Container>
  )
}

export default Main

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexGrow: 0,
    backgroundColor: '#083892',
  },
  content: {
    flexGrow: 1,
  },
})
