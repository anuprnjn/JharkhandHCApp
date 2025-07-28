import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RNPickerSelect from "react-native-picker-select";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Navbar from "../Components/Navbar";
import { useNavigation } from "@react-navigation/native";

const CaseNumber = () => {
  const [caseTypes, setCaseTypes] = useState([]);
  const [selectedCaseType, setSelectedCaseType] = useState(null);
  const [caseNumber, setCaseNumber] = useState("");
  const [caseYear, setCaseYear] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [inputsEnabled, setInputsEnabled] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false); // State for button loader

  const navigation = useNavigation();

  const fetchCaseTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://10.134.9.31:8090/mobile_api/case_type.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const formattedData = data.map((item) => ({
        label: `${item.full_form} (${item.type_name})`,
        value: item.case_type,
      }));
      setCaseTypes(formattedData);
    } catch (error) {
      Alert.alert("Network Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCaseTypes();
  }, []);

  const onRefresh = useCallback(() => {
    Alert.alert("Confirm Reset", "Are you sure you want to reset all fields?", [
      {
        text: "No",
        onPress: () => {
          setRefreshing(false);
        },
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          setCaseTypes([]);
          setSelectedCaseType(null);
          setCaseNumber("");
          setCaseYear("");
          setCaseDetails(null);
          setInputsEnabled(false);
          fetchCaseTypes();
        },
      },
    ]);
  }, []);

  const fetchCaseInfo = async () => {
    if (!selectedCaseType || !caseNumber || !caseYear) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsButtonLoading(true); // Show loader on the search button
    try {
      const response = await fetch(
        "http://10.134.9.31:8090/mobile_api/case_info_api.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            casetype_id: selectedCaseType,
            case_no: caseNumber,
            case_year: caseYear,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.success) {
        setCaseDetails(result.case_detail[0]);
      } else {
        Alert.alert("Error", "No case details found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsButtonLoading(false); 
    }
  };

  const handleCaseTypeChange = (value) => {
    setSelectedCaseType(value);
    setInputsEnabled(true);
    setIsSearchEnabled(caseNumber && caseYear);
  };

  useEffect(() => {
    if (caseNumber && caseYear) {
      setIsSearchEnabled(true);
    } else {
      setIsSearchEnabled(false);
    }
  }, [caseNumber, caseYear]);

  return (
    <View style={styles.container}>
      <Navbar />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#929359" />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#929359"
              />
            </TouchableOpacity>
            <Text style={styles.statusText}>Case Number</Text>
          </View>

          {/* Case Type Picker */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>
              Select a Case Type <Text style={{ color: "red" }}>*</Text>
            </Text>
            <RNPickerSelect
              onValueChange={handleCaseTypeChange}
              items={caseTypes}
              placeholder={{ label: "Select a case type...", value: null }}
              value={selectedCaseType}
              style={pickerSelectStyles}
            />
          </View>

          {/* Case Number and Year Inputs */}
          <Text style={styles.dropdownLabel}>
            Enter Case Number <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            style={[styles.input, !inputsEnabled && styles.disabledInput]}
            placeholder="Enter Case Number"
            keyboardType="numeric"
            editable={inputsEnabled}
            value={caseNumber}
            onChangeText={setCaseNumber}
          />
          <Text style={styles.dropdownLabel}>
            Enter Case Year <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            style={[styles.input, !inputsEnabled && styles.disabledInput]}
            placeholder="Enter Case Year"
            keyboardType="numeric"
            editable={inputsEnabled}
            value={caseYear}
            onChangeText={setCaseYear}
          />

          {/* Search Button */}
          <TouchableOpacity
            style={[
              styles.searchButton,
              !isSearchEnabled && styles.disabledButton,
            ]}
            onPress={fetchCaseInfo}
            disabled={!isSearchEnabled}
          >
            {isButtonLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>

          {/* Display Data */}
          {caseDetails && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultHeaderText}>Case Details:</Text>
              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>
                    S.No: <Text style={styles.resultValue}>1</Text>
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Case Type/Number/Year:</Text>
                  <Text style={styles.resultValue}>
                    {`${caseDetails.type_name}/${caseDetails.case_no}/${caseDetails.case_yr}`}
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Parties:</Text>
                  <Text style={styles.resultValue}>
                    {caseDetails.pet_name}{" "}
                    <Text style={styles.vsText}>Vs</Text>{" "}
                    {caseDetails.res_name}
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Status:</Text>
                  <Text style={styles.resultValue}>
                    {caseDetails.case_status}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewButton} onPress={() => {}}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    marginTop: hp("4%"),
    paddingHorizontal: wp("5%"),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("4%"),
  },
  backButton: {
    marginRight: wp("3%"),
  },
  dropdownContainer: {
    width: wp("90%"),
    marginBottom: hp("2%"),
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#929359",
  },
  dropdownLabel: {
    fontSize: 17,
    marginBottom: hp("1.5%"),
    color: "#004d40",
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: hp("2%"),
    paddingHorizontal: 10,
    fontSize: 17,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp("80%"),
    marginTop: -hp("5%"),
  },
  searchButton: {
    paddingVertical: 14,
    backgroundColor: "#3b3b3b",
    borderRadius: 8,
    alignItems: "center",
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    flexDirection: "row", // Added to align the loader and text
    justifyContent: "center", // Center the loader and text
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: hp("2%"),
    padding: 16,
    backgroundColor: "#f5f8fa",
    borderWidth: 1,
    borderColor: "#d1e0e8",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    width: wp("90%"),
    alignSelf: "center",
    marginBottom: hp("4%"),
  },

  resultHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004d40",
    marginBottom: 10,
  },

  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  resultItem: {
    width: "100%",
    paddingVertical: 12,
  },

  resultLabel: {
    fontWeight: "600",
    color: "#00796b",
    fontSize: 17,
  },

  resultValue: {
    fontSize: 17,
    color: "#000",
  },

  vsText: {
    color: "red",
    fontSize: 20,
  },

  viewButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#004d40",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  viewButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
  placeholder: {
    color: "#999",
    fontSize: 17,
  },
});

export default CaseNumber;
