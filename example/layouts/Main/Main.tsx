import React from 'react'
import { useHistory } from '../../react-router'
import { Container, Header, Content, Button, Icon, Title, Right, Body, Left } from 'native-base'
import { useFhirContext } from 'smartmarkers-lib'

interface MainProps {
  children: React.ReactNode
}

const Main: React.FC<MainProps> = ({ ...props }) => {
  const { children } = props
  const history = useHistory()
  const { user, isAuthenticated } = useFhirContext()

  const showBackArrow = ['not-found', 'settings', 'create-new-service-request'].includes(
    history.location.pathname.split('/')[1]
  )

  const onPersonPress = () => {
    history.push('/settings')
  }

  const goBack = () => history.goBack()

  return (
    <Container>
      <Header style={{ backgroundColor: '#083892' }}>
        {showBackArrow && (
          <Left>
            <Button transparent onPress={goBack}>
              <Icon name="md-arrow-back" />
            </Button>
          </Left>
        )}
        <Body style={{ flexGrow: 5 }}></Body>
        {isAuthenticated && (
          <Right>
            <Button transparent onPress={onPersonPress}>
              <Icon name="person" />
            </Button>
          </Right>
        )}
      </Header>
      <Content>{children}</Content>
    </Container>
  )
}

export default Main
