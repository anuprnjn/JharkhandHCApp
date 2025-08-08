import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../Components/Navbar';
import Button from '../Components/Button';
import CustomInput from '../Components/CustomInput';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../Context/ThemeContext';
import AdvocateCaseResults from '../Components/NapixComponents/AdvocateCaseResults';
import HeadingText from '../Components/HeadingText';
import CaseDetailsNotFound from '../Components/NapixComponents/CaseDetailsNotFound';
import { API_BASE_URL } from '@env';

const AdvocateName = () => {
  const { colors, isDark } = useTheme();
  const [advocateName, setAdvocateName] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [caseStatus, setCaseStatus] = useState('P'); 
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const handleSearchCase = async () => {
    if (!advocateName.trim() || !caseYear.trim()) {
      setError(true);
      return;
    }
    if (caseYear.length !== 4 || isNaN(caseYear)) {
      Alert.alert('Validation Error', 'Please enter a valid 4-digit year');
      return;
    }

    setError(false);
    setShowResults(false);
    setSearchResults(null);
    setShowNotFound(false);

    const searchData = {
      pend_disp: caseStatus,
      advocate_name: advocateName.trim(),
      reg_year: caseYear
    };

    await searchCaseByAdvocate(searchData);
  };

  const searchCaseByAdvocate = async (searchData) => {
    try {
      setSearchLoading(true);
      const response = await fetch(`${API_BASE_URL}/searchAdvocateHcNapix.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data?.status_code === "628" && data?.status === "RECORD_NOT_FOUND") {
        setShowNotFound(true);
      } else if (data?.establishment_name && data?.casenos) {
        setSearchResults(data);
        setShowResults(true);
        setShowNotFound(false);
      } else {
        setShowNotFound(true);
      }
    } catch (error) {
      console.error('Search Error:', error);
      Alert.alert("Search Error", "Something went wrong while searching cases for this advocate.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setSearchResults(null);
    setShowNotFound(false);
    setAdvocateName('');
    setCaseYear('');
    setCaseStatus('P');
    setError(false);
  };

  const handleRetrySearch = () => {
    setShowNotFound(false);
    handleSearchCase();
  };

  const RadioButton = ({ label, value, selected, onSelect }) => (
    <TouchableOpacity
      style={[
        styles.radioContainer,
        { 
          borderColor: colors.border,
          backgroundColor: selected 
            ? (isDark ? colors.highlight + '10' : (colors.highlight2 || colors.highlight) + '10')
            : 'transparent'
        }
      ]}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.radioCircle,
        { 
          borderColor: selected 
            ? (isDark ? colors.highlight : colors.highlight || colors.highlight)
            : colors.secText
        }
      ]}>
        {selected && (
          <View
            style={[
              styles.radioSelected,
              { 
                backgroundColor: colors.highlight
              }
            ]}
          />
        )}
      </View>
      <Text style={[
        styles.radioLabel, 
        { 
          color: selected ? colors.text : colors.text,
          fontWeight: selected ? '600' : '500'
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Not Found Component
  if (showNotFound) {
    return (
        <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navbar />
        <CaseDetailsNotFound
          caseType="N/A"
          caseNumber="N/A"
          caseYear={caseYear}
          caseTypeOptions="N/A"
          onNewSearch={handleNewSearch}
          onRetrySearch={handleRetrySearch}
        />
      </View>
        </>
    );
  }

  // Results Component
  if (showResults && searchResults) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navbar />
       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
            <View style={styles.titleContainer}>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors.highlight} />
                <Text style={[styles.resultsTitle, { color: colors.text }]}>
                Cases Details Found
                </Text>
            </View>
            <TouchableOpacity onPress={handleNewSearch} style={styles.newSearchHeaderButton}>
                <Ionicons name="add-circle-outline" size={20} color="#2a8a4a" />
                <Text style={styles.newSearchText}>New Search</Text>
            </TouchableOpacity>
            </View>
            <AdvocateCaseResults 
            searchResults={searchResults} 
            advocateName={advocateName}
            caseYear={caseYear}
            caseStatus={caseStatus}
            />
        </View>
        </ScrollView>
      </View>
    );
  }

  // Search Form
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <HeadingText
          icon="account-search"
          iconType="material-community"
          heading="Search Case by Advocate name"
          subHeading="Search cases by advocate name, year and status."
        />

        <CustomInput
          label="Advocate Name"
          value={advocateName}
          onChangeText={(text) => {
            setAdvocateName(text);
            if (error) setError(false);
          }}
          placeholder="Enter Advocate Name"
          req="true"
          editable={!searchLoading}
        />

        <CustomInput
          label="Case Year"
          value={caseYear}
          onChangeText={(text) => {
            setCaseYear(text);
            if (error) setError(false);
          }}
          placeholder="Enter Case Year"
          keyboardType="numeric"
          maxLength={4}
          req="true"
          editable={!searchLoading}
        />

        <View style={styles.radioSection}>
          <Text style={[styles.radioSectionTitle, { color: colors.text }]}>
            Case Status <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.radioGroup}>
            <RadioButton
              label="Pending"
              value="P"
              selected={caseStatus === 'P'}
              onSelect={setCaseStatus}
            />
            <RadioButton
              label="Disposed"
              value="D"
              selected={caseStatus === 'D'}
              onSelect={setCaseStatus}
            />
          </View>
        </View>

        {error && (
          <Text style={styles.errorMessage}>
            Please fill all required fields!
          </Text>
        )}

        <Button
          onPress={handleSearchCase}
          text={searchLoading ? 'Searching...' : 'Search Cases'}
          disabled={searchLoading}
        />

        {searchLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.highlight2 || colors.highlight} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Searching for cases...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  radioSection: {
    marginBottom: 20,
  },
  radioSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultsContainer: {
    padding: wp('4%'),
    paddingBottom: hp('10%'),
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  resultsTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    marginLeft: wp('2%'),
  },
    titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    },
  newSearchHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: 20,
  },
  newSearchText: {
    color: '#2a8a4a',
    fontWeight: '600',
    marginLeft: wp('1%'),
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
    maxWidth: 350,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  searchCriteria: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  notFoundButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 5,
  },
  newSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  newSearchButtonText: {
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default AdvocateName;