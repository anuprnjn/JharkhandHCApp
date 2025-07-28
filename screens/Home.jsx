import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import nic from '../assets/images/NIC.png';
import logo from '../assets/images/HC_log.png';
import bg from '../assets/images/bg_mask.jpg';

const Home = ({ navigation }) => {

  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('DrawerNavigator', { screen: 'Services' });
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent"
        translucent={true}
      />
      <Image 
        source={bg} 
        resizeMode='contain' 
        style={styles.backgroundImage}
      />
      <Image 
        source={logo} 
        style={styles.logo}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handlePress}
        disabled={loading} 
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" /> 
        ) : (
          <>
            <Text style={styles.buttonText}>Continue</Text>
            <MaterialCommunityIcons 
              name="arrow-right-circle" 
              size={24} 
              color="white" 
              style={styles.buttonIcon}
            />
          </>
        )}
      </TouchableOpacity>

      <Image source={nic} style={styles.nicLogo} />
      <Text style={styles.footerText}>Designed & developed by NIC Jharkhand.</Text>
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundImage: {
      width: wp('100%'),
      height: hp('100%'),
      position: "absolute",
      top: 0,
    },
    logo: {
      width: wp('62%'),
      height: hp('9%'),
      position: "absolute",
      top: hp('8.5%'),
      alignSelf: "center",
    },
    button: {
      position: "absolute", 
      bottom: hp('20%'), 
      width: wp('40%'), 
      height: hp('6%'),
      alignItems: "center", 
      justifyContent: "center", 
      flexDirection: "row",
      borderRadius: 50, 
      backgroundColor: "#929359",
      padding: 10,
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 5 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 6,
      elevation: 8, 
    },
    buttonText: {
      textAlign: "center", 
      color: "white", 
      fontSize: 20,
    },
    buttonIcon: {
      marginLeft: 10,
    },
    nicLogo: {
      width: wp('50%'), 
      height: hp('7%'), 
      position: "absolute", 
      bottom: hp('10%'), 
      resizeMode: "contain",
    },
    footerText: {
      position: "absolute",
      bottom: hp('5%'),
      textAlign: "center",
      fontSize: 14,
      color: "#000",
      fontWeight: "500",
    }
  });
  