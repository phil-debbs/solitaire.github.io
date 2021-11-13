import React, {forwardRef} from 'react';
import {
  TextInput as RNTextInput,
  View,
  StyleSheet,
  Icon,
  Text,
} from 'react-native';

const TextInput = forwardRef(
  ({icon, error, touched, label, ...otherProps}, ref) => {
    const validationColor = !touched
      ? '#223e4b'
      : error
      ? '#FF5A5F'
      : '#223e4b';
    return (
      // <View
      //   style={{
      //     flexDirection: 'row',
      //     alignItems: 'center',
      //     height: 40,
      //     // borderRadius: 2,
      //     borderColor: validationColor,
      //     borderWidth: StyleSheet.hairlineWidth,
      //     padding: 2,
      //   }}>
      <View style={styles.containerStyle}>
        <Text>{label}</Text>
        <RNTextInput
          style={{...styles.input, borderColor: validationColor}}
          underlineColorAndroid="transparent"
          placeholderTextColor="rgba(34, 62, 75, 0.7)"
          ref={ref}
          {...otherProps}
        />
        <Text style={styles.errorInput}>{touched && error}</Text>
      </View>
    );
  },
);

// This creates an object of styles using React Native StyleSheet
const styles = StyleSheet.create({
  containerStyle: {
    // borderWidth: StyleSheet.hairlineWidth,
    // marginVertical: 5,
    // flex: 1,
  },
  input: {
    borderWidth: 0.5,
    // minHeight: 40,
    padding: 5,
  },
  errorInput: {color: 'red', fontSize: 12},
});

export default TextInput;
