import React from 'react'
import { View, Text, Spinner, ListItem, Body, List, Right, Icon } from 'native-base'
import {
  useFhirContext,
  Report,
  QuestionnaireResponse,
  QuestionnaireResponseView,
} from 'smartmarkers-lib'
import { useHistory } from 'react-router-dom'

interface RouteParams {
  qrId: string
}

const ResponseScreen: React.FC<RouteParams> = ({ qrId }) => {
  const { server } = useFhirContext()
  const [isReady, setIsReady] = React.useState(false)
  const [item, setItem] = React.useState<Report | undefined>(undefined)
  const history = useHistory()

  React.useEffect(() => {
    const loadItems = async () => {
      if (server) {
        const item = (await server.getQuestionnaireResponseById(qrId)) as Report
        if (item) {
          setItem(item)
        }
      }

      setIsReady(true)
    }
    loadItems()
  }, [])

  if (!isReady) {
    return <Spinner />
  }

  const goToFhirResource = () => history.push(`/dashboard/history/report/resource`)

  return (
    <View>
      {item && item.resourceType === 'QuestionnaireResponse' && (
        <QuestionnaireResponseView response={item as QuestionnaireResponse} />
      )}
      <List>
        <ListItem style={{ marginTop: '30px', borderTopWidth: 1 }} onPress={goToFhirResource}>
          <Body>
            <Text>FHIR Resource</Text>
          </Body>
          <Right>
            <Icon active name="arrow-forward" />
          </Right>
        </ListItem>
      </List>
    </View>
  )
}

export default ResponseScreen
