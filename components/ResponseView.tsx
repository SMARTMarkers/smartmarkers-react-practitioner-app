import React from 'react'
import { View, Text, Spinner, ListItem, Body, List, Right, Icon } from 'native-base'
import { QuestionnaireResponse, QuestionnaireResponseView } from 'smartmarkers'
import { useHistory } from '../react-router'
import { useSelector } from 'react-redux'
import { Store } from '../store/models'

interface RouteParams {
  reportId: string
}

const ResponseView: React.FC<any> = () => {
  const history = useHistory()

  const selectedReport = useSelector((store: Store) => store.root.selectedReport)

  if (!selectedReport) return <Spinner />

  const goToFhirResource = () => history.push(`resource`)

  return (
    <View>
      {selectedReport && selectedReport.resourceType === 'QuestionnaireResponse' && (
        <QuestionnaireResponseView response={selectedReport as QuestionnaireResponse} />
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
