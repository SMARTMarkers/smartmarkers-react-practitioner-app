import React from 'react'
import { View, Text, Spinner, ListItem, Body, List, Right, Icon } from 'native-base'
import {
  useFhirContext,
  Report,
  QuestionnaireResponse,
  QuestionnaireResponseView,
} from 'smartmarkers-lib'
import { useHistory, useParams } from '../react-router'

interface RouteParams {
  reportId: string
}

const ResponseView: React.FC<any> = () => {
  const { reportId } = useParams<RouteParams>()
  const { server } = useFhirContext()
  const [isReady, setIsReady] = React.useState(false)
  const [item, setItem] = React.useState<Report | undefined>(undefined)
  const history = useHistory()

  React.useEffect(() => {
    const loadItems = async () => {
      if (server) {
        const item = (await server.getQuestionnaireResponseById(reportId)) as Report
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

  const goToFhirResource = () => history.push(`resource`)

  return (
    <View>
      {item && item.resourceType === 'QuestionnaireResponse' && (
        <QuestionnaireResponseView response={item as QuestionnaireResponse} />
      )}
      <List style={{ paddingTop: 30 }}>
        <ListItem style={{ borderTopWidth: 1 }} onPress={goToFhirResource}>
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

export default ResponseView
