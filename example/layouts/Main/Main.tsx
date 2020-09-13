import React from 'react'
import { useHistory } from '../../react-router'
import { Container, Header, Content, Button, Icon, Title, Right, Body } from 'native-base'
import { useFhirContext } from 'smartmarkers-lib'

interface MainProps {
  children: React.ReactNode
}

const Main: React.FC<MainProps> = ({ ...props }) => {
  const { children } = props
  const history = useHistory()
  const { user, isAuthenticated } = useFhirContext()
  const isPatient = user && user.resourceType.toLowerCase() == 'patient'

  const onPersonPress = () => {
    history.push('/settings')
  }

  return (
    <Container>
      <Header style={{ backgroundColor: '#083892' }}>
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
