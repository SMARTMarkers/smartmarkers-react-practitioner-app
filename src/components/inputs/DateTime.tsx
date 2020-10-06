import React from "react";
import { Item, Text, Button, Left, Right, Icon } from "native-base";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";

export interface DateTimeProps {
  mode?: "date" | "time" | "datetime";
  value?: Date | string;
  onChange?: (date?: Date) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  buttonColor?: string;
}

export const DateTime: React.FC<DateTimeProps> = (props) => {
  const [show, setShow] = React.useState(false);
  const { mode, value, onChange, error, minDate, maxDate, buttonColor } = props;
  const onLocalChange = (event: Event, date?: Date) => {
    setShow(false);
    if (onChange) {
      onChange(date);
    }
  };

  const onSelectPress = () => {
    setShow(true);
  };

  const dateValue = value ? new Date(value) : new Date();
  const hasError = !!error;
  return (
    <Item regular error={hasError}>
      <Left>
        <Text style={{ paddingLeft: 15, paddingRight: 15 }}>
          {value ? new Date(value).toLocaleDateString() : ""}
        </Text>
        {hasError && <Icon name="close-circle" />}
      </Left>
      <Right>
        <Button
          style={buttonColor ? { backgroundColor: buttonColor } : {}}
          onPress={onSelectPress}
        >
          <Text>Select</Text>
        </Button>
      </Right>
      {show && (
        <DateTimePicker
          value={dateValue}
          minimumDate={minDate}
          maximumDate={maxDate}
          locale={"en"}
          timeZoneOffsetInMinutes={0}
          onChange={onLocalChange}
          mode={mode ? mode : "date"}
        />
      )}
    </Item>
  );
};
