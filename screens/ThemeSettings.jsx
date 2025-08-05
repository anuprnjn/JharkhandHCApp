// Screens/ThemeSettings.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../Context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Navbar from './Components/Navbar';
import HeadingText from './Components/HeadingText';

const ThemeSettings = () => {
  const { themeMode, setThemeMode, colors, isDark } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const Option = ({ label, mode, icon }) => {
    const isSelected = themeMode === mode;
    return (
      <TouchableOpacity
        onPress={() => setThemeMode(mode)}
        style={[
          styles.option,
          {
            backgroundColor: isSelected ? colors.card : 'transparent',
            borderColor: isSelected ? colors.secText : colors.border,
          },
        ]}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name={icon}
            size={22}
            color={isSelected ? colors.text : colors.text}
            style={{ marginRight: 12 }}
          />
          <Text style={[styles.optionText, { color: colors.text }]}>
            {label}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.text} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Navbar />
      <Animated.View
        style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}
      >
        <HeadingText
          icon="theme-light-dark"
          iconType="material-community"
          heading="Change Your App Theme"
          subHeading="Select to Change the app theme."
        />

        <View style={styles.optionsWrapper}>
          <Option label="Light Mode" mode="light" icon="sunny-outline" />
          <Option label="Dark Mode" mode="dark" icon="moon-outline" />
        </View>
        
      </Animated.View>
    </>
  );
};

export default ThemeSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    marginTop: -10
  },
  optionsWrapper: {
    marginTop: hp('3%'),
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp('2%'),
    borderWidth: 1.2,
    borderRadius: 14,
    marginBottom: hp('2%'),
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: hp('1.8%'),
    fontWeight: '500',
  },
  note: {
    marginTop: hp('4%'),
    fontSize: hp('2%'),
    opacity: 0.8,
    textAlign: 'center',
  },
});
