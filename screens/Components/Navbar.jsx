import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import top from '../../assets/images/top_gradient.png';
import logo from '../../assets/images/HC_log.png';

const Navbar = () => {
  return (
    <View style={styles.container}>
      <Image source={top} style={styles.topImage} />
      <Image source={logo} style={styles.logo} />
    </View>
  );
}

export default Navbar;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('18%'), // Increased from 18% to accommodate more padding
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: hp('3%'), 
  },
  topImage: {
    width: wp('100%'),
    height: hp('18%'), // Keep original image height
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  logo: {
    width: wp('72%'),
    height: hp('18%'),
    resizeMode: 'contain',
    marginTop: hp('8%'),

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android shadow
    elevation: 2,
  },
});