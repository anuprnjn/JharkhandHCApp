import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from 'react-native-toast-message';
import Navbar from "../Components/Navbar";
import ServiceCard from "../Components/ServiceCard";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CaseStatus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const cards = [
    {
      name: "Case Number",
      icon: "file-document-outline",
      gradient: ["#2a8a4a", "#38f9d7"],
      route: "CaseNumber",
    },
    {
      name: "Filing Number",
      icon: "file-document-edit-outline",
      gradient: ["#f093fb", "#f5576c"],
      route: "FilingNumber",
    },
    {
      name: "Case Type",
      icon: "file-certificate-outline",
      gradient: ["#fa709a", "#fee140"],
      route: "CaseType",
    },
    {
      name: "FIR Number",
      icon: "police-badge-outline",
      gradient: ["#667eea", "#764ba2"],
      route: "FIRNumber",
    },
    {
      name: "Party Name",
      icon: "account-group-outline",
      gradient: ["#4facfe", "#00f2fe"],
      route: "PartyName",
    },
  ];

  const filteredServices = cards
    .filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    .sort((a, b) => {
      const aFav = favorites.includes(a.name);
      const bFav = favorites.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.name.localeCompare(b.name);
    });

    const toggleFavorite = async (name) => {
        const updated = favorites.includes(name)
            ? favorites.filter(item => item !== name)
            : [...favorites, name];

        setFavorites(updated);
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(updated));
        } catch (error) {
            console.error("Failed to save favorites", error);
        }
        Toast.show({
            type: 'success',
            text1: favorites.includes(name) ? 'Removed from favorites' : `${name} added to favorites`,
            position: 'bottom',
            visibilityTime: 2000,
        });
    };

  const handleCardPress = (route) => {
    navigation.navigate(route);
    console.log(route);
    return;
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Navbar />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search case status options..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <MaterialCommunityIcons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content with Gradient Background */}
      <LinearGradient 
        colors={['#ffffff', '#fafbfc', '#f4f6f8']} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Services Grid or No Results */}
          {filteredServices.length > 0 ? (
            <View style={styles.servicesGrid}>
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.name}
                  service={service}
                  onPress={() => handleCardPress(service.route)}
                  toggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(service.name)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons 
                name="file-search-outline" 
                size={64} 
                color="#D1D5DB" 
              />
              <Text style={styles.noResultsTitle}>No options found</Text>
              <Text style={styles.noResultsDescription}>
                {searchQuery ? 
                  `No case status options match "${searchQuery}". Try a different search term.` :
                  "No case status options available at the moment."
                }
              </Text>
              {searchQuery && (
                <TouchableOpacity 
                  style={styles.clearSearchButton}
                  onPress={clearSearch}
                >
                  <Text style={styles.clearSearchButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
    marginLeft: 12,
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: wp('5%'),
    paddingBottom: 80,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // No Results Styles
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('15%'),
    paddingHorizontal: wp('10%'),
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  noResultsDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  clearSearchButton: {
    backgroundColor: '#27b099',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#27b099',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CaseStatus;