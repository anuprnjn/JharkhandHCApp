// components/ServiceCard.js
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const ServiceCard = ({ service, onPress, toggleFavorite, isFavorite }) => {
    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity 
                activeOpacity={0.95} 
                onPress={onPress} 
                style={styles.serviceCard}
            >
                {/* Background gradient overlay */}
                
                {/* Card content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        {/* Icon with gradient background */}
                        <LinearGradient
                            colors={service.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconContainer}
                        >
                            <MaterialCommunityIcons 
                                name={service.icon} 
                                size={24} 
                                color="#FFFFFF" 
                            />
                        </LinearGradient>
                        
                        {/* Favorite button */}
                        <TouchableOpacity 
                            onPress={() => toggleFavorite(service.name)}
                            style={styles.favoriteButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={20}
                                color={isFavorite ? "#4B3E2F" : "#8E8E93"}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Service name */}
                    <Text style={styles.serviceName} numberOfLines={2}>
                        {service.name}
                    </Text>
                    
                    {/* Access button */}
                    <View style={styles.accessButton}>
                        <Text style={[styles.accessText, { color: service.gradient[0] }]}>
                            Open
                        </Text>
                        <MaterialCommunityIcons 
                            name="arrow-top-right" 
                            size={16} 
                            color={service.gradient[0]} 
                        />
                    </View>
                </View>
                
                {/* Subtle shine effect */}
                <View style={styles.shineEffect} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        width: wp('43%'),
        marginBottom: 16,
        // Modern shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        // Modern shadow for Android
        elevation: 8,
    },
    serviceCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        position: 'relative',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    cardContent: {
        padding: 20,
        flex: 1,
        justifyContent: 'space-between',
        minHeight: 160,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    favoriteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1C1C1E",
        marginBottom: 6,
        lineHeight: 22,
    },
    serviceDescription: {
        fontSize: 14,
        color: "#8E8E93",
        lineHeight: 18,
        marginBottom: 16,
    },
    accessButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
    },
    accessText: {
        fontSize: 13,
        fontWeight: "600",
        marginRight: 4,
    },
    shineEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default ServiceCard;