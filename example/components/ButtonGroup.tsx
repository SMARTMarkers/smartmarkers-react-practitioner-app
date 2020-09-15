import React from 'react'
import { Text, Button, Segment, Icon, View } from 'native-base'
import { GroupItem } from 'smartmarkers-lib/dist/components/inputs'
import { StyleSheet } from 'react-native'

export interface ButtonGroupProps<T> {
  items: GroupItem<T>[]
  value?: T
  error?: string
  onChange?: (value: T) => void
}

const ButtonGroup: React.FC<ButtonGroupProps<any>> = props => {
  const { items, value, onChange, error } = props
  const hasError = !!error
  const onPress = (value: any) => () => {
    if (onChange) {
      onChange(value)
    }
  }

  const segmentStyle: any = {
    backgroundColor: 'transparent',
  }

  const buttonStyle: any = {
    backgroundColor: '#002a78',
    color: 'white',
  }

  segmentStyle.flexDirection = 'column'
  segmentStyle.height = 'auto'
  segmentStyle.alignItems = 'center'
  segmentStyle.alignSelf = 'center'
  segmentStyle.width = 'max-content'

  buttonStyle.marginBottom = 5
  buttonStyle.width = '100%'
  buttonStyle.display = 'flex'
  buttonStyle.justifyContent = 'center'

  return (
    <View style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Segment style={segmentStyle}>
        {items.map((item, index) => (
          <Button
            light
            key={index}
            first={index === 0}
            active={item.value == value}
            last={index === items.length - 1}
            onPress={onPress(item.value)}
            style={item.value == value ? styles.activeButton : styles.button}
          >
            <Text style={{ color: item.value == value ? '#002a78' : 'white' }}>{item.label}</Text>
          </Button>
        ))}
        {hasError && <Icon name="close-circle" />}
      </Segment>
    </View>
  )
}

export default ButtonGroup

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#002a78',
    color: 'white',
    marginBottom: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeButton: {
    backgroundColor: 'white',
    color: 'white',
    marginBottom: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    borderColor: '#002a78',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
})
