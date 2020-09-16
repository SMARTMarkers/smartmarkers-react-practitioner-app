import React from 'react'
import { Spinner } from 'native-base'
import { useFhirContext, Report, QuestionnaireResponse, FhirResourceView } from 'smartmarkers-lib'
import { useParams } from 'react-router-dom'

interface RouteParams {
  reportId: string
}

const FhirResource: React.FC<any> = () => {
  const { reportId } = useParams<RouteParams>()
  const { server } = useFhirContext()
  const [isReady, setIsReady] = React.useState(false)
  const [item, setItem] = React.useState<Report | undefined>(undefined)

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

  return <FhirResourceView response={item as QuestionnaireResponse} />
}

export default FhirResource
