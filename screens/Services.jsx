import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  Text 
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import ServiceCard from "./Components/ServiceCard";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "./Components/Navbar";

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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
    header: {
        paddingTop: StatusBar.currentHeight || 40,
        paddingHorizontal: wp('5%'),
        backgroundColor: '#FFFFFF',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
        marginTop: -25
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
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

export default Services;