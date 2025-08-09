import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import ServiceCard from "./Components/ServiceCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "./Components/Navbar";
import HeadingText from "./Components/HeadingText";
import { useTheme } from "../Context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const FAVORITES_KEY = 'favorites';
const RECENT_KEY = 'recent_services';

const SERVICES_DATA = [
  { name: "Case Status", icon: "scale-balance", gradient: ["#667eea", "#764ba2"], route: 'CaseStatus' },
  { name: "Cause List", icon: "file-document-multiple", gradient: ["#ff6b6b", "#feca57"], route: 'CauseList' },
  { name: "Orders & Judgement", icon: "gavel", gradient: ["#5f27cd", "#00d2d3"], route: 'OdersAndJudgementIndex' },
  { name: "Display Board", icon: "monitor-dashboard", gradient: ["#fd79a8", "#fdcb6e"], route: 'DisplayBoard' },
  { name: "Certified Copy", icon: "certificate", gradient: ["#6c5ce7", "#fd79a8"], route: 'CertifiedCopy' },
  { name: "eFilings", icon: "cloud-upload", gradient: ["#00b894", "#00cec9"], route: 'E-Fillings' },
  { name: "Telephone Directory", icon: "phone", gradient: ["#0984e3", "#74b9ff"], route: 'TelephoneDirectory' },
  { name: "Neutral Citation", icon: "file-find", gradient: ["#a29bfe", "#fd79a8"], route: 'NeutralCitation' },
  { name: "Roster", icon: "account-group", gradient: ["#fd7272", "#ff7675"], route: 'Roster' },
  { name: "Status of Filing & Copying", icon: "file-document-edit", gradient: ["#fdcb6e", "#fd79a8"], route: 'FilingCopyStatus' },
  { name: "Calendar", icon: "calendar-month", gradient: ["#55a3ff", "#003d82"], route: 'CalendarPage' },
];

// Animated ServiceCard Wrapper (unchanged)
const AnimatedServiceCard = ({ service, onPress, toggleFavorite, isFavorite, index, isVisible }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      const delay = index * 120;
      
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 7,
          }),
        ]).start();
      }, delay);
    }
  }, [isVisible, index]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ],
        opacity: opacityAnim,
      }}
    >
      <ServiceCard
        service={service}
        onPress={onPress}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
    </Animated.View>
  );
};

// Recent Service Card Component
const RecentServiceCard = ({ service, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.recentCard, { backgroundColor: colors.cardBackground }]}
  >
    <LinearGradient
      colors={service.gradient}
      style={styles.recentIcon}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <MaterialCommunityIcons name={service.icon} size={25} color="#fff" />
    </LinearGradient>
    <Text style={[styles.recentText, { color: colors.text }]} numberOfLines={1}>
      {service.name}
    </Text>
  </TouchableOpacity>
);

const Services = () => {
  const [favorites, setFavorites] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  // Header animation
  const headerOpacityAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const [favs, recents] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(RECENT_KEY)
        ]);
        if (favs != null) setFavorites(JSON.parse(favs));
        if (recents != null) setRecentServices(JSON.parse(recents));
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadStorage();
  }, []);

  // Trigger animations when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (isLoaded) {
        setCardsVisible(false);
        headerOpacityAnim.setValue(0);
        headerSlideAnim.setValue(-30);
        
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(headerOpacityAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.spring(headerSlideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 80,
              friction: 8,
            }),
          ]).start();
          
          setTimeout(() => {
            setCardsVisible(true);
          }, 200);
        }, 100);
      }
    }, [isLoaded])
  );

  // Custom toast config to support dark mode styling
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.highlight,
          backgroundColor: isDark ? '#222' : '#ffffffff',
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.9 : 0.25,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          color: isDark ? colors.text : '#000000ff',
          fontWeight: '600',
          fontSize: 14,
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

  // Add to recent services
  const addToRecent = async (serviceName) => {
    const updated = [serviceName, ...recentServices.filter(item => item !== serviceName)].slice(0, 4);
    setRecentServices(updated);
    try {
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save recents", error);
    }
  };

  const handleCardPress = (route, serviceName) => {
    addToRecent(serviceName);
    navigation.navigate(route);
  };

  // Filter services based on search query
  const filteredServices = SERVICES_DATA.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const orderedServices = [
    ...favorites
      .map(name => filteredServices.find(service => service.name === name))
      .filter(Boolean),
    ...filteredServices.filter(service => !favorites.includes(service.name)),
  ];

  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <Navbar />
      </View>
    );
  }

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
        {/* Animated Header */}
        <HeadingText
          icon="scale-balance"
          heading="Services"
          subHeading="Explore and access all essential court services and e-resources below."
        />

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.card : '#f5f6fa' }]}>
          <Ionicons name="search" size={20} style={{ marginRight: 8 }} color={colors.secText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search services..."
            placeholderTextColor={colors.secText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Recently Accessed */}
        {recentServices.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: colors.highlight }]}>Recently Visited</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
              {recentServices.map((serviceName, index) => {
                const service = SERVICES_DATA.find(s => s.name === serviceName);
                if (!service) return null;
                return (
                  <RecentServiceCard
                    key={index}
                    service={service}
                    onPress={() => handleCardPress(service.route, service.name)}
                    colors={colors}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.servicesGrid}>
          {orderedServices.map((service, index) => (
            <AnimatedServiceCard
              key={`${service.name}-${index}`}
              service={service}
              onPress={() => handleCardPress(service.route, service.name)}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(service.name)}
              index={index}
              isVisible={cardsVisible}
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
  // Search Bar Styles
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginVertical: -3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 18
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  // Recent Services Styles
  recentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    textAlign:"start",    
    marginLeft: 3
  },
  recentScroll: {
    marginTop: 5,
  },
  recentCard: {
    width: wp('22%'),
    padding: 12,
    borderRadius: 12,
    marginRight: 5,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentText: {
    fontSize: wp("3.5%"),
    textAlign: 'start',
    fontWeight: '500',
  },
});

export default Services;
