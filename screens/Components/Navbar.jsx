import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import logoLight from '../../assets/images/HC_log.png';
import logoDark from '../../assets/images/HC_white_logo.png';
import { useTheme } from './../../Context/ThemeContext';

const Navbar = () => {
  const { isDark, colors, setThemeMode } = useTheme();
  const styles = getStyles(colors, isDark);
  const navigation = useNavigation();
  const route = useRoute();
  
  const lightLogoOpacity = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const darkLogoOpacity = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(lightLogoOpacity, {
        toValue: isDark ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(darkLogoOpacity, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDark]);
  
  // Check if current screen should show back button
  const isServicesPage = route.name === 'Services';
  const shouldShowBackButton = route.name !== 'Home' && !isServicesPage;
  
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback to Home if no previous screen
      navigation.navigate('Home');
    }
  };
  
  // Indian flag corners, as before
  const flagGradientLight = [
    'rgba(255, 153, 51, 0.93)',
    'rgba(255,255,255,0.96)',
    'rgba(54, 245, 37, 0.88)',
  ];
  const flagGradientDark = [
    'rgba(255,153,51,0.93)',
    '#121212',
    'rgba(54,245,37,0.91)',
  ];
  
  // More intense bottom fade
  const bottomFadeLight = [
    'rgba(255, 255, 255, 1)', // very solid
    'rgba(255, 255, 255, 1)', // remains solid for most
    'rgba(255, 255, 255, 0.09)', // sharp fade to transparent
    'rgba(255, 255, 255, 0)',
  ];
  const bottomFadeDark = [
    'rgba(18, 18, 18, 1)',
    'rgba(18, 18, 18, 1)',     
    'rgba(18, 18, 18, 0.79)',
    'rgba(18, 18, 18, 0)'
  ];
  
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {/* Flag gradient, orange/greeen in corners */}
      <LinearGradient
        colors={isDark ? flagGradientDark : flagGradientLight}
        start={{ x: -0.1, y: 0 }}
        end={{ x: 1, y: -0.5 }}
        style={styles.gradientBg}
      />
       
      {/* More intense bottom fade overlay */}
      <LinearGradient
        colors={isDark ? bottomFadeDark : bottomFadeLight}
        start={{ x: -0.9, y: 1 }}
        end={{ x: -0.9, y: -0.10 }}
        style={styles.bottomFade}
      />
       
      <View style={styles.contentWrapper}>
        {/* If Services page → show theme toggle, else back button */}
        {isServicesPage ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDark ? 'moon-outline' : 'sunny-outline'} 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
        ) : (
          shouldShowBackButton && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </TouchableOpacity>
          )
        )}
        
        {/* Logo */}
        <View style={[
          styles.logoWrapper, 
          (shouldShowBackButton || isServicesPage) ? styles.logoWithBackButton : styles.logoWithoutBackButton
        ]}>
          <Animated.Image
            source={logoLight}
            style={[styles.logo, { opacity: lightLogoOpacity }]}
          />
          <Animated.Image
            source={logoDark}
            style={[styles.logo, styles.logoOverlay, { opacity: darkLogoOpacity }]}
          />
        </View>
      </View>
    </View>
  );
};

export default Navbar;

const getStyles = (colors, isDark) =>
  StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('21%'),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: hp('1%'),
    marginTop: -25,
    overflow: 'hidden',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp('18%'), 
    zIndex: 2,
  },
  contentWrapper: {
    position: 'relative',
    width: wp('100%'),
    height: hp('18%'),
    marginTop: hp('8%'),
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
  backButton: {
    position: 'absolute',
    left: wp('5%'),
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 6,
    padding: 8,
    borderRadius: 20,
    backgroundColor: isDark ? colors.card : 'rgba(24, 24, 24, 0.04)',
  },
  logoWrapper: {
    position: 'relative',
    width: wp('64%'),
    height: hp('18%'),
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWithBackButton: {
    marginLeft: wp("5%"), 
  },
  logoWithoutBackButton: {
    marginLeft: 0, 
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 5,
  },
  logoOverlay: {
    zIndex: 5,
  },
});