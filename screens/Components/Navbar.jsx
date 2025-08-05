import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import logoLight from '../../assets/images/HC_log.png';
import logoDark from '../../assets/images/HC_white_logo.png';
import { useTheme } from './../../Context/ThemeContext';

const Navbar = () => {
  const { isDark } = useTheme();

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

      <View style={styles.logoWrapper}>
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
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('20%'),
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
    height: hp('18%'), // slightly taller for more intense fade
    zIndex: 2,
  },
  logoWrapper: {
    position: 'relative',
    width: wp('65%'),
    height: hp('18%'),
    marginTop: hp('8%'),
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
