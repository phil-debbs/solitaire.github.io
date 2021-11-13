// import React from 'react';
// import {
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import PropTypes from 'prop-types';

// const Button = ({
//   label,
//   instructions,
//   containerStyle,
//   textStyle,
//   isSubmitting,
//   disabled,
//   indicatorColor,
//   ...props
// }) => {
//   return (
//     <TouchableOpacity
//       onPress={() => {
//         if (instructions) instructions();
//       }}
//       disabled={disabled || isSubmitting}
//       style={containerStyle}>
//       {isSubmitting ? (
//         <ActivityIndicator color={indicatorColor} />
//       ) : (
//         <Text style={textStyle}>{label}</Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   containerStyle: {
//     marginVertical: 4,
//     width: 245,
//     // backgroundColor: 'grey',
//     backgroundColor: '#0099ff',
//     paddingVertical: 4,
//     borderRadius: 5,
//   },
//   textStyle: {
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 15,
//   },
// });

// Button.defaultProps = {
//   text: '',
//   isSubmitting: false,
//   indicatorColor: 'white',
//   ...styles, // this would spread the styles object
// };

// const stylePropsType = PropTypes.oneOfType([
//   PropTypes.arrayOf(PropTypes.object),
//   PropTypes.object,
// ]);

// Button.propTypes = {
//   containerStyle: stylePropsType,
//   textStyle: stylePropsType,
// };

// export default Button;

import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

export default function Button({
  label,
  onPress,
  isSubmitting,
  disabled,
  style,
}) {
  return (
    <TouchableOpacity
      disabled={disabled || isSubmitting}
      style={{
        ...style,
        borderRadius: 3,
        marginVertical: 4,
        paddingVertical: 4,
        // height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0099ff',
      }}
      activeOpacity={0.7}
      onPress={onPress}>
      <Text style={{fontSize: 15, color: 'white', textTransform: 'uppercase'}}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
