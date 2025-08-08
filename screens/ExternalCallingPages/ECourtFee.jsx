import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ECourtFee = () => {
 
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator 
          size="large" 
          color="#4B3E2F" 
          style={styles.loader} 
        />
      )}

      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: 'https://www.shcilestamp.com/estamp_CFS_home.html' }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}   
          onLoad={() => setLoading(false)}  
          showsVerticalScrollIndicator={false}  
          showsHorizontalScrollIndicator={false}     
        />
      </View>
    </View>
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

export default ECourtFee;
