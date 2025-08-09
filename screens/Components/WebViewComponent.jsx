import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Navbar from './Navbar';
import HeadingText from './HeadingText';
import { useTheme } from '../../Context/ThemeContext';

const WebViewComponent = ({ route }) => { 
  const { district_name, title } = route.params; 
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
 
  const [loading, setLoading] = useState(true);
  return (
    <>
    <View style={styles.container}>
    <Navbar/>
      {loading && (
        <ActivityIndicator 
          size="large" 
          color="#4B3E2F" 
          style={styles.loader} 
        />
      )}

      <View style={styles.webViewContainer}>
        <HeadingText
          icon=""
          iconType="material-community"
          heading={`Display board of ${district_name.charAt(0).toUpperCase() + district_name.slice(1)}`}
          subHeading={`Welcome to display board of ${district_name}.`}
        />
        <WebView
          source={{ uri: `https://www.jharkhandhighcourt.nic.in/displayboard/${district_name}/` }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}   
          onLoad={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
            setLoading(false);
          }}
          showsVerticalScrollIndicator={false}  
          showsHorizontalScrollIndicator={false}    
        />

      </View>
    </View>
    </>
  );
};

const getStyles = (colors, isDark) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background ,
  },
  webViewContainer: {
    flex: 1,
    marginTop: hp('2%'),
    backgroundColor: colors.background,
    padding: wp('2%'),
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    position: 'absolute',
    top: '50%',            
    left: '50%',          
    transform: [{ translateX: -25 }, { translateY: -25 }], 
    zIndex: 1,             
  },
});

export default WebViewComponent;
