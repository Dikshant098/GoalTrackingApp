// CustomTextInput.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/styles'; // Adjust import paths as necessary
import { TextInput } from 'react-native-paper';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        mode='outlined'
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        {...props}
        activeOutlineColor={Colors.primaryColor}
        outlineColor={Colors.lightGrayColor}
        // underlineColor='white'
        // activeUnderlineColor={Colors.primaryColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.fixPadding,
  },
  label: {
    ...Fonts.grayColor16Regular,
    marginBottom: Sizes.fixPadding - 5.0,
  },
  input: {
    backgroundColor:Colors.whiteColor,
    ...Fonts.blackColor16Regular,
  },
});

export default CustomTextInput;
