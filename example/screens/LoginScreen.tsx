import React, { useEffect } from 'react'
import { Text, Button, Form } from 'native-base'
import { useFhirContext } from 'smartmarkers-lib'
import { useHistory } from 'react-router-dom'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession()

const discovery = {
  authorizationEndpoint:
    'https://launch.smarthealthit.org/v/r4/sim/eyJrIjoiMSIsImoiOiIxIiwiYiI6ImE2ODg5YzZkLTY5MTUtNGZhYy05ZDJmLWZjNmM0MmIzYTgyZSJ9/auth/authorize',
  tokenEndpoint:
    'https://launch.smarthealthit.org/v/r4/sim/eyJrIjoiMSIsImoiOiIxIiwiYiI6ImE2ODg5YzZkLTY5MTUtNGZhYy05ZDJmLWZjNmM0MmIzYTgyZSJ9/auth/token',
}

const serverUrl =
  'https://launch.smarthealthit.org/v/r4/sim/eyJrIjoiMSIsImoiOiIxIiwiYiI6ImE2ODg5YzZkLTY5MTUtNGZhYy05ZDJmLWZjNmM0MmIzYTgyZSJ9/fhir'

const LoginScreen: React.FC<any> = () => {
  const redirectUri = makeRedirectUri({
    native: '/',
  })
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: 'code',
      clientId: 'my_web_app',
      scopes: [
        'openid',
        'fhirUser',
        'offline_access',
        'user/*.*',
        'patient/*.*',
        'launch/encounter',
        'launch/patient',
        'profile',
      ],
      redirectUri,
      extraParams: {
        aud: serverUrl,
      },
    },
    discovery
  )

  const fhirContext = useFhirContext()
  const onLoginPress = () => {
    promptAsync()
  }

  const history = useHistory()

  useEffect(() => {
    if (response) {
      const data: any = {
        code: (response as any).params.code,
        grant_type: 'authorization_code',
        redirectUri,
        client_id: 'my_web_app',
      }
      var formBody: any = []
      for (var property in data) {
        var encodedKey = encodeURIComponent(property)
        var encodedValue = encodeURIComponent(data[property])
        formBody.push(encodedKey + '=' + encodedValue)
      }
      formBody = formBody.join('&')
      fetch(discovery.tokenEndpoint, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formBody,
      })
        .then((res: any) => res.json())
        .then(async (tokenResponse: any) => {
          await fhirContext.loginCallback(tokenResponse, serverUrl)
          history.push('/dashboard')
        })
        .catch((e: any) => console.log(e))
    }
  }, [response])
  return (
    <Form>
      <Text style={{ alignSelf: 'center', padding: 32 }}>Login by pressing Login button</Text>
      <Button full primary style={{ alignSelf: 'center', margin: 20 }} onPress={onLoginPress}>
        <Text>Login</Text>
      </Button>
    </Form>
  )
}

export default LoginScreen
