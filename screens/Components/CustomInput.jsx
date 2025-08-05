import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../Context/ThemeContext'; // adjust path if needed

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  maxLength,
  style,
  req,
  ...rest
}) => {
  const { isDark, colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
          {req === "true" ? (
            <Text style={{ color: 'red' }}> *</Text>
          ) : null}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
          style
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#999' : '#8E8E93'}
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
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 17,
    minHeight: 44,
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
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
