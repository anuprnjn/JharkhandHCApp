import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../Components/Navbar';

const CaseNumber = () => {
  const [caseType, setCaseType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseYear, setCaseYear] = useState('');

  const handleSearch = () => {
    console.log('Searching case:', { caseType, caseNumber, caseYear });
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Case Type</Text>
        <View style={styles.dropdownWrapper}>
          <RNPickerSelect
            onValueChange={(value) => setCaseType(value)}
            placeholder={{ label: 'Select Case Type', value: '' }}
            items={[
              { label: 'Civil', value: 'civil' },
              { label: 'Criminal', value: 'criminal' },
              { label: 'Family', value: 'family' },
              { label: 'Other', value: 'other' },
            ]}
            style={pickerSelectStyles}
            value={caseType}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Ionicons name="chevron-down" size={20} color="#000" />;
            }}
          />
        </View>

        <Text style={styles.label}>Case Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Case Number"
          keyboardType="numeric"
          value={caseNumber}
          onChangeText={setCaseNumber}
        />

        <Text style={styles.label}>Case Year</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Case Year"
          keyboardType="numeric"
          value={caseYear}
          onChangeText={setCaseYear}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search Case</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CaseNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#ffffffff',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
    marginTop: 10
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#4B3E2F',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4B3E2F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

});

// Styles for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
});
