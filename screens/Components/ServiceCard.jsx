// components/ServiceCard.js
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as Haptics from 'expo-haptics';

const ServiceCard = ({ service, onPress, toggleFavorite, isFavorite }) => {
    // Function to extract hex color and convert to rgba
    const hexToRgba = (hex, opacity) => {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Handle 3-digit hex
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        // Handle 8-digit hex (with alpha)
        if (hex.length === 8) {
            hex = hex.substring(0, 6);
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Handle favorite toggle with haptics
    const handleFavoritePress = () => {
        // Trigger haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        toggleFavorite(service.name);
    };

    // Create gradient colors with proper opacity
    const gradientColors = [
        hexToRgba(service.gradient[0], 0.12),
        hexToRgba(service.gradient[1], 0.06),
        'rgba(255, 255, 255, 0.95)'
    ];

    // Dynamic heart button shadow style
    const getHeartButtonStyle = () => {
        const baseStyle = {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            justifyContent: 'center',
            alignItems: 'center',
        };

        if (isFavorite) {
            return {
                ...baseStyle,
                ...Platform.select({
                    ios: {
                        shadowColor: '#FF3B30',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                    },
                    android: {
                        elevation: 4,
                        shadowColor: '#FF3B30',
                    },
                }),
            };
        } else {
            return {
                ...baseStyle,
                ...Platform.select({
                    ios: {
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    },
                    android: {
                        elevation: 2,
                    },
                }),
            };
        }
    };

    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity 
                activeOpacity={0.95} 
                onPress={onPress} 
                style={styles.serviceCard}
            >
                {/* Card Background Gradient - Platform Independent */}
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientOverlay}
                />
                
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
                                size={28} 
                                color="#FFFFFF" 
                            />
                        </LinearGradient>
                        
                        {/* Favorite button with dynamic shadow */}
                        <TouchableOpacity 
                            onPress={handleFavoritePress}
                            style={getHeartButtonStyle()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={20}
                                color={isFavorite ? "#FF3B30" : "#8E8E93"}
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
                            Launch
                        </Text>
                        <MaterialCommunityIcons 
                            name="launch" 
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
        // Platform-specific shadow
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
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
        borderRadius: 23, // Slightly less than card to prevent overflow
    },
    cardContent: {
        padding: 20,
        flex: 1,
        justifyContent: 'space-between',
        minHeight: 160,
        position: 'relative',
        zIndex: 2, // Higher zIndex to ensure content is above gradient
        backgroundColor: 'transparent',
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
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
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
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        zIndex: 3,
    },
});

export default ServiceCard;
