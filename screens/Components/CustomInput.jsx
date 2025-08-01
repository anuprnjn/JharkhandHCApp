import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  maxLength,
  style,
  req,                            // expects string "true" or other
  placeholderTextColor = "#8E8E93",
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {req === "true" ? (
            <Text style={{ color: 'red' }}> *</Text>
          ) : null}
        </Text>
      )}
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        maxLength={maxLength}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#4B3E2F',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 17,
    color: '#000000',
    minHeight: 44,
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
    borderColor: '#C7C7CC',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.04,
        shadowRadius: 0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export default CustomInput;
