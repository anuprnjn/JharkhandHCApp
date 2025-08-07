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

// 🌓 THEME: Import useTheme hook
import { useTheme } from '../../Context/ThemeContext';

// Modular Sections
import BasicCaseInfo from '../Components/NapixComponents/BasicCaseInfo';
import PartiesInfo from '../Components/NapixComponents/PartiesInfo';
import CourtInfo from '../Components/NapixComponents/CourtInfo';
import SubordinateCourtInfo from '../Components/NapixComponents/SubordinateCourtInfo';
import HearingHistory from '../Components/NapixComponents/HearingHistory';
import OrdersSection from '../Components/NapixComponents/OrdersSection';
import CategoryDetails from '../Components/NapixComponents/CategoryDetails';
import CaseDetailsNotFound from '../Components/NapixComponents/CaseDetailsNotFound';
import HeadingText from '../Components/HeadingText';

const CaseFilling = () => {

  const { colors, isDark } = useTheme(); 
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') throw new Error('Empty response from server');
      let data = JSON.parse(responseText);
      const caseTypesArray = Object.values(data);
      const formattedData = caseTypesArray.map((item, index) => ({
        label: item.type_name || 'Unknown Case Type',
        value: item.case_type || `unknown_${index}`,
      }));
      setCaseTypeOptions(formattedData);
    } catch (error) {
      Alert.alert(
        "Loading Error",
        "Failed to load case types. Napix not responding.",
        [
          { text: "Retry", onPress: () => fetchCaseTypes() },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCaseTypes(); }, []);
  const handleCaseTypeSelect = (item) => { setCaseType(item.value); if (error) setError(false); };

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

  const searchCaseByNumber = async (searchData) => {
    try {
      setSearchLoading(true);
      const response = await fetch("http://10.134.8.12/jhc_app_api/searchByfilingNoHcNapix.php", {
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
      } else {
        setSearchResults(data);
        setShowResults(true);
        setShowNotFound(false);
      }
    } catch (error) {
      Alert.alert("Search Error", "Something went wrong while searching the case.");
    } finally {
      setSearchLoading(false);
    }
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

  const renderCaseDetails = () => {
    if (!searchResults) return null;
    const regData = searchResults.filing_data;
    const cnrData = searchResults.cnr_data;
    const caseInfo = regData?.casenos?.case1;
    return (
      <View style={[styles.resultsContainer]}>
        <View style={styles.resultsHeader}>
         <View style={styles.titleContainer}>
            <Ionicons name="checkmark-circle-outline" size={24} color={colors.highlight} />
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
            Cases Details Found
          </Text>
          </View>
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
        <OrdersSection caseInfo={caseInfo} interimOrders={cnrData?.interimorder} finalOrders={cnrData?.finalorder} formatDate={formatDate} decodeHtml={decodeHtmlEntities} />
        <CategoryDetails category={cnrData?.category_details} />
      </View>
    );
  };

  if (showNotFound) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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

  if (showResults && searchResults) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navbar />
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {renderCaseDetails()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <HeadingText
          icon="magnify"
          iconType="material-community"
          heading="Search case by Filling Number"
          subHeading="Search your case by filling number."
        />
        <Text style={[styles.label, { color: colors.text }]}>
          <Text>High Court Case Types </Text>
          <Text style={{ color: 'red' }}>*</Text>
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
          placeholder="Enter Filling Year"
          keyboardType="numeric"
          maxLength={4}
          req="true"
          editable={!searchLoading}
        />
        {error && (
          <Text style={[styles.erro_message, { color: 'red' }]}>
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
            <ActivityIndicator size="large" color={colors.highlight} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Searching for case...</Text>
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
   titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 20,
  },
  erro_message: {
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
    marginLeft: 4
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
