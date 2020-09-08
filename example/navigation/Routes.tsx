import React from 'react'
import { Switch, Redirect, Route, useHistory } from '../react-router'
import { RouteWithLayout, PrivateRouteWithLayout } from '../components'
import { Main as MainLayout } from '../layouts'

import {
    SettingsScreen,
    LoginScreen,
    DashboardScreen
} from '../screens'
import { useFhirContext, LoginCallback } from 'smartmarkers-lib'

const Routes: React.FC = () => {
    const fhirContext = useFhirContext()
    const history = useHistory()

    return (
        <Switch>
            <Redirect exact from="/" to={`/dashboard`} />
            <RouteWithLayout exact path="/login" component={LoginScreen} layout={MainLayout} />
            <Route
                exact
                path="/auth-callback"
                render={() => (
                    <LoginCallback
                        redirect={() => {history.push("/dashboard");}}
                        loginCallback={fhirContext.loginCallback}
                    />
                )}
            />
            <PrivateRouteWithLayout
                component={DashboardScreen}
                exact
                layout={MainLayout}
                path="/dashboard"
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
