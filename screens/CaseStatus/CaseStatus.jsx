import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import Navbar from "../Components/Navbar";
import ServiceCard from "../Components/ServiceCard";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CaseStatus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  
  // Define the AsyncStorage key
  const FAVORITES_KEY = '@case_status_favorites';

  const SERVICES_DATA = [
    {
      name: "Advocate Name",
      icon: "file-certificate-outline",
      gradient: ["#fa709a", "#fee140"],
      route: "CaseAdvocateName",
    },
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
      route: "CaseFilling",
    },
    {
      name: "Party Name",
      icon: "account-group-outline",
      gradient: ["#4facfe", "#00f2fe"],
      route: "PartyName",
    },
  ];

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        if (jsonValue != null) {
          setFavorites(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error("Failed to load favorites", error);
      }
    };
    loadFavorites();
  }, []);

  // handle favorite button
  const toggleFavorite = async (name) => {
    const isFavorite = favorites.includes(name);

    let updated;
    if (isFavorite) {
      updated = favorites.filter(item => item !== name);
    } else {
      // put new favorite at front, keeping all others behind (no dupe)
      updated = [name, ...favorites.filter(item => item !== name)];
    }

    setFavorites(updated);

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save favorites", error);
    }

    Toast.show({
      type: 'success',
      text1: isFavorite ? 'Removed from favorites' : `${name} added to favorites`,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const handleCardPress = (route) => {
    navigation.navigate(route);
  };

  // Favorited cards first, most recent favorite at the top
  const orderedServices = [
    ...favorites
      .map(name => SERVICES_DATA.find(service => service.name === name))
      .filter(Boolean), // drop any old keys that don't exist
    ...SERVICES_DATA.filter(service => !favorites.includes(service.name)),
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.servicesGrid}>
          {orderedServices.map((service) => (
            <ServiceCard
              key={service.name}
              service={service}
              onPress={() => handleCardPress(service.route)}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(service.name)}
            />
          ))}
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    backgroundColor: '#4B3E2F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#4B3E2F',
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