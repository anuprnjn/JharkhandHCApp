import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../Components/Navbar';
import CustomDropdown from '../Components/CustomDropdown';
import Button from '../Components/Button';
import CustomInput from '../Components/CustomInput';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Modular Information Sections:
import BasicCaseInfo from '../Components/NapixComponents/BasicCaseInfo';
import PartiesInfo from '../Components/NapixComponents/PartiesInfo';
import CourtInfo from '../Components/NapixComponents/CourtInfo';
import SubordinateCourtInfo from '../Components/NapixComponents/SubordinateCourtInfo';
import HearingHistory from '../Components/NapixComponents/HearingHistory';
import OrdersSection from '../Components/NapixComponents/OrdersSection';
import CategoryDetails from '../Components/NapixComponents/CategoryDetails';
import CaseDetailsNotFound from '../Components/NapixComponents/CaseDetailsNotFound';

const CaseFilling = () => {
  const [caseTypeOptions, setCaseTypeOptions] = useState([]);
  const [caseType, setCaseType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const fetchCaseTypes = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "http://10.134.8.12/jhc_app_api/fetchCaseTypeHcNapix.php",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format received');
      }

      const caseTypesArray = Object.values(data);

      if (caseTypesArray.length === 0) {
        setCaseTypeOptions([]);
        return;
      }

      const formattedData = caseTypesArray.map((item, index) => {
        if (!item || typeof item !== 'object') {
          console.warn(`Invalid item at index ${index}:`, item);
          return null;
        }

        const label = item.type_name || 'Unknown Case Type';
        const value = item.case_type || `unknown_${index}`;

        return {
          label: label,
          value: value,
        };
      }).filter(Boolean);
      setCaseTypeOptions(formattedData);

    } catch (error) {
      
      let errorMessage = 'Failed to load case types';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your internet connection.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Server returned invalid data.';
      }

      Alert.alert(
        "Loading Error", 
        errorMessage,
        [
          {
            text: "Retry",
            onPress: () => fetchCaseTypes(),
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCaseTypes(); }, []);

  const handleCaseTypeSelect = (item) => {
    setCaseType(item.value); if (error) setError(false);
  };

  const searchCaseByNumber = async (searchData) => {
    try {
      setSearchLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "http://10.134.8.12/jhc_app_api/searchByfilingNoHcNapix.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(searchData),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response that failed to parse:', responseText);
        throw new Error('Invalid JSON response from server');
      }

      // Handle different response formats
      if (data && typeof data === 'object') {
        // Check for RECORD_NOT_FOUND status
        if (data.status_code === "628" && data.status === "RECORD_NOT_FOUND") {
          setShowNotFound(true);
          setSearchResults(null);
          setShowResults(false);
        } else if (data.error) {
          Alert.alert('Search Error', data.error);
          setSearchResults(null);
          setShowResults(false);
          setShowNotFound(false);
        } else if (data.message && data.message.toLowerCase().includes('no data found')) {
          setShowNotFound(true);
          setSearchResults(null);
          setShowResults(false);
        } else {
          // Success - show the response
          setSearchResults(data);
          setShowResults(true);
          setShowNotFound(false);
        }
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Search API Error:', error);
      
      let errorMessage = 'Failed to search case';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Search timed out. Please try again.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Server returned invalid data.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      }

      Alert.alert(
        "Search Error", 
        errorMessage,
        [
          {
            text: "Retry",
            onPress: () => handleSearchCase(),
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      
      setSearchResults(null);
      setShowResults(false);
      setShowNotFound(false);
      
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchCase = async () => {
    if (!caseType || !caseNumber || !caseYear) { setError(true); return; }
    if (caseYear.length !== 4 || isNaN(caseYear)) {
      Alert.alert('Validation Error', 'Please enter a valid 4-digit year');
      return;
    }
    setError(false); setShowResults(false); setSearchResults(null); setShowNotFound(false);
    const searchData = { case_type: caseType, fil_no: caseNumber, fil_year: caseYear };
    await searchCaseByNumber(searchData);
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setSearchResults(null);
    setShowNotFound(false);
    setCaseType('');
    setCaseNumber('');
    setCaseYear('');
    setError(false);
  };

  const handleRetrySearch = () => {
    setShowNotFound(false);
    handleSearchCase();
  };

  /** --- Utility functions --- **/
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };
  const decodeHtmlEntities = text => {
    if (!text) return text;
    return text
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  };

  /** --- Main Render For Results --- **/
  const renderCaseDetails = () => {
    if (!searchResults) return null;
    const regData = searchResults.registration_data;
    const cnrData = searchResults.cnr_data;
    const caseInfo = regData?.casenos?.case1;

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Case Details Found</Text>
          <TouchableOpacity onPress={handleNewSearch} style={styles.newSearchButton}>
            <Ionicons name="add-circle-outline" size={20} color="#2a8a4a" />
            <Text style={styles.newSearchText}>New Search</Text>
          </TouchableOpacity>
        </View>

        <BasicCaseInfo caseInfo={caseInfo} cnrData={cnrData} formatDate={formatDate} />
        <PartiesInfo caseInfo={caseInfo} cnrData={cnrData} />
        <CourtInfo regData={regData} cnrData={cnrData} decodeHtml={decodeHtmlEntities} />
        <SubordinateCourtInfo cnrData={cnrData} />
        <HearingHistory history={cnrData?.historyofcasehearing} formatDate={formatDate} decodeHtml={decodeHtmlEntities} />
        <OrdersSection
          interimOrders={cnrData?.interimorder}
          finalOrders={cnrData?.finalorder}
          formatDate={formatDate}
          decodeHtml={decodeHtmlEntities}
        />
        <CategoryDetails category={cnrData?.category_details} />
      </View>
    );
  };

  // Show case not found screen
  if (showNotFound) {
    return (
      <View style={styles.container}>
        <Navbar />
        <CaseDetailsNotFound
          caseType={caseType}
          caseNumber={caseNumber}
          caseYear={caseYear}
          caseTypeOptions={caseTypeOptions}
          onNewSearch={handleNewSearch}
          onRetrySearch={handleRetrySearch}
        />
      </View>
    );
  }

  // Show case results
  if (showResults && searchResults) {
    return (
      <View style={styles.container}>
        <Navbar />
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {renderCaseDetails()}
        </ScrollView>
      </View>
    );
  }

  // Show search form
  return (
    <View style={styles.container}>
      <Navbar />
      {/* <Text style={styles.title}>Search case by Case Number</Text> */}
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>
          High Court Case Types <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <CustomDropdown
          data={caseTypeOptions}
          value={caseType}
          onSelect={handleCaseTypeSelect}
          placeholder="Select Case Type"
          title="High Court Case Types"
          searchPlaceholder="Search case types..."
          disabled={loading || searchLoading}
          loading={loading}
          searchable={true}
          style={styles.dropdown}
        />
        {caseTypeOptions.length === 0 && !loading && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCaseTypes}
          >
            <Text style={styles.retryText}>Retry Loading Case Types</Text>
          </TouchableOpacity>
        )}
        <CustomInput
          label="Filling Number"
          value={caseNumber}
          onChangeText={(text) => { setCaseNumber(text); if (error) setError(false); }}
          placeholder="Enter Filling Number"
          keyboardType="numeric"
          req="true"
          editable={!searchLoading}
        />
        <CustomInput
          label="Filling Year"
          value={caseYear}
          onChangeText={(text) => { setCaseYear(text); if (error) setError(false); }}
          placeholder="Enter Filling Year (e.g., 2025)"
          keyboardType="numeric"
          maxLength={4}
          req="true"
          editable={!searchLoading}
        />
        {error && (
          <Text style={styles.erro_message}>
            Please Fill all Required fields !
          </Text>
        )}
        <Button
          onPress={handleSearchCase}
          text={searchLoading ? 'Searching...' : 'Search Case'}
          disabled={loading || searchLoading}
        />
        {searchLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2a8a4a" />
            <Text style={styles.loadingText}>Searching for case...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
    marginTop: -1,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4B3E2F',
    fontWeight: 700
  },
  dropdown: {
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  erro_message: {
    color: 'red',
    fontSize: 14,
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
    color: '#666',
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
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  newSearchButton: {
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
});

export default CaseFilling;