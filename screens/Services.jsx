import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import ServiceCard from "./Components/ServiceCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "./Components/Navbar";
import HeadingText from "./Components/HeadingText";
import { useTheme } from "../Context/ThemeContext";

const FAVORITES_KEY = 'favorites';

const SERVICES_DATA = [
  { name: "Case Status", icon: "scale-balance", gradient: ["#667eea", "#764ba2"], route: 'CaseStatus'},
  { name: "Cause List", icon: "file-document-multiple", gradient: ["#f093fb", "#f5576c"], route: 'CauseList'},
  { name: "Orders & Judgement", icon: "gavel", gradient: ["#4facfe", "#00f2fe"], route: 'OrdersJudgement'},
  { name: "eFilings", icon: "cloud-upload", gradient: ["#2a8a4aff", "#38f9d7"], route: 'EFiling'},
  { name: "Display Board", icon: "monitor-dashboard", gradient: ["#fa709a", "#fee140"], route: 'DisplayBoard'},
  { name: "Certified Copy", icon: "certificate", gradient: ["#efc488ff", "#f88c68ff"], route: 'CertifiedCopy'},
  { name: "Calendar", icon: "calendar-month", gradient: ["#d7686bff", "#fecfef"], route: 'Calendar'},
];

const Services = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

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

  // Custom toast config to support dark mode styling
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.highlight,
          backgroundColor: isDark ? '#222' : '#e6ffe6',
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.9 : 0.25,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          color: isDark ? colors.highlight : '#006400',
          fontWeight: '600',
          fontSize: 12,
        }}
        text2Style={{ display: 'none' }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.error || '#ff3b3bff',
          backgroundColor: isDark ? '#330000' : '#ffe6e6',
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.9 : 0.25,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          color: isDark ? colors.error || '#ff3b3bff' : '#b30000',
          fontWeight: '600',
          fontSize: 16,
        }}
        text2Style={{ display: 'none' }}
      />
    ),
  };

  const toggleFavorite = async (name) => {
    const isFavorite = favorites.includes(name);

    let updated;
    if (isFavorite) {
      updated = favorites.filter(item => item !== name);
    } else {
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

  const orderedServices = [
    ...favorites
      .map(name => SERVICES_DATA.find(service => service.name === name))
      .filter(Boolean),
    ...SERVICES_DATA.filter(service => !favorites.includes(service.name)),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeadingText
          icon="scale-balance"
          heading="Services"
          subHeading="Explore and access all essential court services and e-resources below."
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

      {/* Toast Component with theme-aware config */}
      <Toast config={toastConfig} />
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

export default Services;
