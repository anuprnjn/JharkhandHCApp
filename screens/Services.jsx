import React, { useState } from "react";
import { View, StyleSheet, ScrollView, StatusBar, TextInput, TouchableOpacity, Text } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import ServiceCard from "./Components/ServiceCard";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Services = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const navigation = useNavigation();

    const services = [
        { name: "Case Status", icon: "scale-balance", gradient: ["#667eea", "#764ba2"], route: 'CaseStatus'},
        { name: "Cause List", icon: "file-document-multiple", gradient: ["#f093fb", "#f5576c"], route: 'CauseList'},
        { name: "Orders & Judgement", icon: "gavel", gradient: ["#4facfe", "#00f2fe"], route: 'OrdersJudgement'},
        { name: "eFilings", icon: "cloud-upload", gradient: ["#2a8a4aff", "#38f9d7"], route: 'EFiling'},
        { name: "Display Board", icon: "monitor-dashboard", gradient: ["#fa709a", "#fee140"], route: 'DisplayBoard'},
        { name: "Certified Copy", icon: "certificate", gradient: ["#efc488ff", "#f88c68ff"], route: 'CertifiedCopy'},
        { name: "E-Pass", icon: "card-account-details", gradient: ["#58b4afff", "#ef86a7ff"], route: 'EPass' },
        { name: "Calendar", icon: "calendar-month", gradient: ["#d7686bff", "#fecfef"], route: 'Calendar'},
        { name: "VC Link", icon: "video", gradient: ["#667eea", "#764ba2"], route: 'VCLink'},
        { name: "Legal Aid", icon: "account-group", gradient: ["#70cdf5ff", "#ff80a8ff"], route: 'LegalAid'},
    ];

    const filteredServices = services
        .filter(service =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        )
        .sort((a, b) => {
            const aFav = favorites.includes(a.name);
            const bFav = favorites.includes(b.name);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
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
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {/* Header with Search Bar */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search services..."
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
            </View>

            <LinearGradient 
                colors={['#ffffff', '#eeffefff', '#fff0deff']} 
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
                            {filteredServices.map((service, index) => (
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
                            <Text style={styles.noResultsTitle}>No services found</Text>
                            <Text style={styles.noResultsDescription}>
                                {searchQuery ? 
                                    `No services match "${searchQuery}". Try a different search term.` :
                                    "No services available at the moment."
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

export default Services;