import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from "../Components/Navbar";
import ServiceCard from "../Components/ServiceCard";
import HeadingText from "../Components/HeadingText";
import { useTheme } from "../../Context/ThemeContext"; // ⬅️ Import Theme Context

const CaseStatus = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const { colors, isDark } = useTheme(); // ⬅️ Use theme

  const FAVORITES_KEY = '@case_status_favorites';

  const SERVICES_DATA = [
    {
      name: "Advocate Name",
      icon: "file-certificate-outline",
      gradient: ["#fa709a", "#fee140"],
      route: "CaseType",
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

  const toggleFavorite = async (name) => {
    const isFavorite = favorites.includes(name);
    const updated = isFavorite
      ? favorites.filter(item => item !== name)
      : [name, ...favorites.filter(item => item !== name)];

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

  const orderedServices = [
    ...favorites
      .map(name => SERVICES_DATA.find(service => service.name === name))
      .filter(Boolean),
    ...SERVICES_DATA.filter(service => !favorites.includes(service.name)),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeadingText
          icon="gavel"
          heading="Check the Case Status"
          subHeading="Use multiple search options to check case progress."
        />
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
  },
  scrollContent: {
    padding: wp('5%'),
    paddingBottom: 80,
    flexGrow: 1,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default CaseStatus;
