import React, { useEffect } from 'react'
import { Switch, Redirect, Route, useHistory } from '../react-router'
import { RouteWithLayout, PrivateRouteWithLayout } from '../components'
import { Main as MainLayout } from '../layouts'

import {
  SettingsScreen,
  LoginScreen,
  DashboardScreen,
  CreateNewServiceRequestScreen,
} from '../screens'
import { useFhirContext, LoginCallback } from 'smartmarkers-lib'

const Routes: React.FC = () => {
  const fhirContext = useFhirContext()
  const history = useHistory()

  return (
    <Switch>
      <Redirect exact from="/" to={`/dashboard`} />
      {fhirContext.isAuthenticated && <Redirect exact from="/login" to={`/dashboard`} />}
      <RouteWithLayout exact path="/login" component={LoginScreen} layout={MainLayout} />
      {/* <Route
        exact
        path="/auth-callback"
        render={() => (
          <LoginCallback
            redirect={() => {
              history.push('/dashboard')
            }}
            loginCallback={fhirContext.loginCallback}
          />
        )}
      /> */}
      <PrivateRouteWithLayout
        component={DashboardScreen}
        layout={MainLayout}
        exact
        path={[
          '/dashboard',
          '/dashboard/:patientId',
          '/dashboard/create-new-service-request',
          '/dashboard/:patientId/:requestId/history',
          '/dashboard/:patientId/:requestId/history/:reportId/report',
          '/dashboard/:patientId/:requestId/history/:reportId/resource',
        ]}
        isAuthenticated={fhirContext.isAuthenticated}
      />
      <PrivateRouteWithLayout
        exact
        component={CreateNewServiceRequestScreen}
        layout={MainLayout}
        path="/create-new-service-request/:patientId"
        isAuthenticated={fhirContext.isAuthenticated}
      />
      <PrivateRouteWithLayout
        component={SettingsScreen}
        exact
        layout={MainLayout}
        path="/settings"
        isAuthenticated={fhirContext.isAuthenticated}
      />
      <Redirect to="/not-found" />
    </Switch>
  )
}

export default Routes
