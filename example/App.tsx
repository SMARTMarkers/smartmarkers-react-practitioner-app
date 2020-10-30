import React, { useState } from 'react'
import { Router } from './react-router'
import Routes from './navigation/Routes'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { FhirProvider, FhirProviderProps } from 'smartmarkers-lib'
import { serverUrl } from './urls'
import { Provider } from 'react-redux'

import { store } from './store'

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false)

  React.useEffect(() => {
    const loadAssets = async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      })
      setIsReady(true)
    }
    loadAssets()
  }, [])

  if (!isReady) {
    return <AppLoading />
  }

  const redirectUri = Linking.makeUrl('auth-callback')
  // Practitioner
  // const iss =
  // "https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImIiOiIzMjZiNDY3NS0wYmM4LTRkYmQtYjQwNi1hNTU2NGMyODI0MDEsMTU1ZDNkODAtZjNmMC00YjM5LTkyMDctMGQxMjJjZjk0YTExIiwiZSI6IjM3ODgxMDg2LTdiMDUtNGIxOC1hMjc5LTA4ZTMzMWY1MGU5YiJ9/fhir";
  // Patient
  // const iss =
  //  "https://launch.smarthealthit.org/v/r4/sim/eyJrIjoiMSIsImoiOiIxIiwiYiI6Ijg3YTMzOWQwLThjYWUtNDE4ZS04OWM3LTg2NTFlNmFhYjNjNiJ9/fhir";

  // const iss =
  //     'https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImIiOiIzMjZiNDY3NS0wYmM4LTRkYmQtYjQwNi1hNTU2NGMyODI0MDEiLCJpIjoiMSIsImoiOiIxIiwiZSI6ImVmYjVkNGNlLWRmZmMtNDdkZi1hYTZkLTA1ZDM3MmZkYjQwNyJ9/fhir'
  // const iss = "https://launch.smarthealthit.org/v/r4/sim/eyJrIjoiMSIsImoiOiIxIiwiYiI6IjMyNmI0Njc1LTBiYzgtNGRiZC1iNDA2LWE1NTY0YzI4MjQwMSJ9/fhir";
  // const iss =
  //   'https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImIiOiIxNTVkM2Q4MC1mM2YwLTRiMzktOTIwNy0wZDEyMmNmOTRhMTEiLCJpIjoiMSIsImoiOiIxIiwiZSI6ImVmYjVkNGNlLWRmZmMtNDdkZi1hYTZkLTA1ZDM3MmZkYjQwNyJ9/fhir'
  const iss = serverUrl
  const scope =
    'openid fhirUser offline_access user/*.* patient/*.* launch/encounter launch/patient profile'
  const settings: FhirProviderProps = {
    client_id: 'my_web_app',
    scope,
    iss,
    redirectUri,
    promisSettings: {
      url: 'https://mss.fsm.northwestern.edu/AC_API_CR/2018-10/',
      token: '',
      identifier: '',
    },
  }

  return (
    <FhirProvider {...settings}>
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    </FhirProvider>
  )
}

export default App
