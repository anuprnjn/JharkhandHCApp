import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Navbar from '../Components/Navbar';
import HeadingText from '../Components/HeadingText';

const PartyName = () => {
 
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
          icon="magnify"
          iconType="material-community"
          heading="Search case by party name"
          subHeading="Search your case by filling below form."
        />
        <WebView
          source={{ uri: 'https://hcservices.ecourts.gov.in/ecourtindiaHC/cases/ki_petres.php?state_cd=7&dist_cd=1&court_code=1&stateNm=Jharkhand' }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          javaScriptEnabled={true}
          injectedJavaScript={`
            // Hide scrollbars using CSS
            const style = document.createElement('style');
            style.innerHTML = '::-webkit-scrollbar { display: none; }';
            document.head.appendChild(style);
            true;
          `}
          showsVerticalScrollIndicator={false}  
          showsHorizontalScrollIndicator={false} 
        />
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewContainer: {
    flex: 1,
    marginTop: hp('2%'),
    backgroundColor: '#FFFFFF',
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

export default PartyName;
