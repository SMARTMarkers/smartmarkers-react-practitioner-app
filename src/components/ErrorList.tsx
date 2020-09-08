import React from 'react'
import { View, Text } from 'react-native'

export interface ErrorListProps {
    errors: Error[]
}

const ErrorList: React.FC<ErrorListProps> = props => {
    const { errors } = props
    return (
        <View style={{ flexDirection: 'column' }}>
            <Text>Errors</Text>
            {errors.map((error, i) => {
                return (
                    <Text key={i} style={{ color: 'red' }}>
                        {error.stack}
                    </Text>
                )
            })}
        </View>
    )
}

export default ErrorList
