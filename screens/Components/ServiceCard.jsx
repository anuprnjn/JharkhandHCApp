import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useTheme } from "../../Context/ThemeContext";
import * as Haptics from 'expo-haptics'; // import haptics

const ServiceCard = ({ service, onPress, toggleFavorite, isFavorite }) => {
  const { colors, isDark } = useTheme();

  const hexToRgba = (hex, opacity) => {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    }

    if (hex.length === 8) {
      hex = hex.substring(0, 6);
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const gradientColors = [
    hexToRgba(service.gradient[0], 0.12),
    hexToRgba(service.gradient[1], 0.06),
    isDark ? "rgba(18, 18, 18, 0.95)" : "rgba(255, 255, 255, 0.95)",
  ];

  // Handle favorite press with haptic feedback
  const onFavoritePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(service.name);
  };

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPress}
        style={[
          styles.serviceCard,
          {
            backgroundColor: colors.card,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
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

            <TouchableOpacity
              onPress={onFavoritePress}
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: isDark
                    ? "rgba(30,30,30,0.95)"
                    : "rgba(255,255,255,0.95)",
                  shadowColor: isFavorite ? "#FF3B30" : colors.text,
                  shadowOpacity: isFavorite ? 0.4 : 0.1,
                  shadowRadius: isFavorite ? 8 : 4,
                  shadowOffset: isFavorite
                    ? { width: 0, height: 3 }
                    : { width: 0, height: 2 },
                  elevation: isFavorite ? 9 : 3,
                },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#FF3B30" : colors.text}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.serviceName,
              { color: colors.text },
            ]}
            numberOfLines={2}
          >
            {service.name}
          </Text>

          <View
            style={[
              styles.accessButton,
              {
                borderTopColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Text style={[styles.accessText, { color: service.gradient[0] }]}>
              Open
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={16}
              color={service.gradient[0]}
            />
          </View>
        </View>

        <View
          style={[
            styles.shineEffect,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.96)",
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: wp("43%"),
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 23,
  },
  cardContent: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
    minHeight: 160,
    position: "relative",
    zIndex: 2,
    backgroundColor: "transparent",
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
        shadowColor: "#000",
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
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 22,
  },
  accessButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
    borderTopWidth: 1,
  },
  accessText: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  shineEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height:1,
    zIndex: 3,
  },
});

export default ServiceCard;
