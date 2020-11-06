import React from 'react'
import { Switch, Redirect } from '../react-router'
import { RouteWithLayout, PrivateRouteWithLayout } from '../components'
import { Main as MainLayout } from '../layouts'

import {
  SettingsScreen,
  LoginScreen,
  DashboardScreen,
  CreateNewServiceRequestScreen,
} from '../screens'
import { useFhirContext } from 'smartmarkers'

const Routes: React.FC = () => {
  const fhirContext = useFhirContext()

  return (
    <Switch>
      <Redirect exact from="/" to={`/dashboard`} />
      {fhirContext.isAuthenticated && <Redirect exact from="/login" to={`/dashboard`} />}
      <RouteWithLayout exact path="/login" component={LoginScreen} layout={MainLayout} />
      <PrivateRouteWithLayout
        component={DashboardScreen}
        layout={MainLayout}
        exact
        path={[
          '/dashboard',
          '/dashboard/:patientId',
          '/dashboard/create-new-service-request',
          '/dashboard/:patientId/:requestId/:instrumentTitle/history',
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
