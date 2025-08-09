import React, { useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useTheme } from "../../Context/ThemeContext";
import * as Haptics from "expo-haptics";

const ServiceCard = ({ service, onPress, toggleFavorite, isFavorite }) => {
  const { colors, isDark } = useTheme();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteScaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteRotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const hexToRgba = (hex, opacity) => {
    hex = hex.replace("#", "");
    if (hex.length === 3)
      hex = hex.split("").map((c) => c + c).join("");
    if (hex.length === 8) hex = hex.substring(0, 6);

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const backgroundGradient = [
    hexToRgba(service.gradient[0], isDark ? 0.15 : 0.08),
    hexToRgba(service.gradient[1], isDark ? 0.08 : 0.04),
    isDark ? "rgba(18, 18, 18, 0.98)" : "rgba(255, 255, 255, 0.98)",
  ];

  // Enhanced press animations
  const handlePressIn = () => {
    Haptics.selectionAsync();
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 2,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
    ]).start();
  };

  // Favorite button animations
  const onFavoritePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scale and rotate animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(favoriteScaleAnim, {
          toValue: 0.8,
          useNativeDriver: true,
          tension: 500,
          friction: 3,
        }),
        Animated.timing(favoriteRotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(favoriteScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 4,
        }),
        Animated.timing(favoriteRotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    toggleFavorite(service.name);
  };

  const favoriteRotate = favoriteRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.rowContainer,
          {
            backgroundColor: colors.card,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.08)",
            shadowColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)",
          },
        ]}
      >
        <LinearGradient
          colors={backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rowBackground}
        />

        {/* Animated Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { 
                  scale: scaleAnim.interpolate({
                    inputRange: [0.98, 1],
                    outputRange: [1.05, 1],
                  })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[...service.gradient, hexToRgba(service.gradient[1], 0.8)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconWrapper}
          >
            <MaterialCommunityIcons
              name={service.icon}
              size={24}
              color="#fff"
            />
          </LinearGradient>
        </Animated.View>

        {/* Title with text wrapping and fixed height */}
        <Animated.View 
          style={[
            styles.titleWrapper,
            {
              transform: [{ 
                translateX: slideAnim.interpolate({
                  inputRange: [0, 2],
                  outputRange: [0, 3],
                })
              }]
            }
          ]}
        >
          <View style={styles.textContainer}>
            <Text
              style={[styles.serviceTitle, { color: colors.text }]}
              numberOfLines={2} // Allow up to 2 lines
            >
              {service.name}
            </Text>
            <Text
              style={[styles.subText, { color: isDark ? "#aaa" : "#666" }]}
              numberOfLines={1}
            >
              Tap to explore
            </Text>
          </View>
        </Animated.View>

        {/* Actions with animations */}
        <View style={styles.actionWrapper}>
          <TouchableOpacity
            onPress={onFavoritePress}
            activeOpacity={0.7}
            style={[
              styles.favoriteButton,
              {
                backgroundColor: isDark
                  ? "rgba(40,40,40,0.95)"
                  : "rgba(248,248,248,0.95)",
                borderColor: isFavorite 
                  ? hexToRgba("#FF3B30", 0.3)
                  : "transparent",
                borderWidth: isFavorite ? 1.5 : 0,
              },
            ]}
          >
            <Animated.View
              style={{
                transform: [
                  { scale: favoriteScaleAnim },
                  { rotate: favoriteRotate },
                ],
              }}
            >
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={18}
                color={isFavorite ? "#FF3B30" : colors.secText}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Animated chevron */}
          <Animated.View
            style={{
              transform: [{ 
                translateX: slideAnim.interpolate({
                  inputRange: [0, 2],
                  outputRange: [0, 4],
                })
              }]
            }}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={service.gradient[0]}
              style={{ marginLeft: 12, opacity: 0.8 }}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    width: wp("90%"),
    alignSelf: "center",
    minHeight: 84, // Fixed minimum height for all cards
    maxHeight: 84, // Fixed maximum height to prevent expansion
    ...Platform.select({
      ios: {
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  rowBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  iconContainer: {
    alignSelf: "flex-start", // Align icon to top
    marginTop: 2, // Small top margin for better alignment
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center", // Center content vertically
    height: 52, // Fixed height to match icon height
  },
  textContainer: {
    flex: 1,
    justifyContent: "center", // Center text vertically within the container
  },
  serviceTitle: {
    fontSize: 17.5,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 20, // Controlled line height for consistent spacing
    marginBottom: 2, // Small margin between title and subtitle
  },
  subText: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.8,
    lineHeight: 16, // Controlled line height
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start", // Align actions to top
    marginTop: 10, // Small top margin for better alignment
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default ServiceCard;
