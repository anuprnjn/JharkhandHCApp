import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Context/ThemeContext';

const SamplePDFViewer = () => {
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  // Your base64 PDF string here
  const base64PDFString = "BASE64_STRING";

  const validateBase64PDF = (base64String) => {
    if (!base64String || base64String.length < 100) {
      return false;
    }
    return base64String.startsWith('JVBERi0x');
  };

  const openWithExternalApp = async (uri) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        type: 'application/pdf',
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
      });
      navigation.goBack(); // Return after opening
    } catch (error) {
      console.error('Error opening external app:', error);
      Alert.alert('Error', 'No PDF viewer found or failed to open.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const createPDFFile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!validateBase64PDF(base64PDFString)) {
        throw new Error('Invalid PDF data');
      }

      const fileName = `temp_pdf_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64PDFString, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists && fileInfo.size > 0) {
        setPdfUri(fileUri);

        if (Platform.OS === 'android') {
          await openWithExternalApp(fileUri);
        }
      } else {
        throw new Error('Failed to create PDF file');
      }

    } catch (error) {
      console.error('PDF error:', error);
      setError(error.message);
      Alert.alert('Error', `Failed to open PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createPDFFile();
  }, []);

  const handleClose = () => {
    navigation.goBack();
  };

  if (Platform.OS === 'ios' && pdfUri) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>PDF Viewer</Text>
          <View style={styles.placeholder} />
        </View>
        <WebView
          source={{ uri: pdfUri }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.highlight} />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          )}
          originWhitelist={['*']}
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit
          bounces={false}
        />
      </SafeAreaView>
    );
  }

  // Loading state or nothing to render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.highlight} />
        <Text style={styles.loadingText}>Preparing PDF...</Text>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
      elevation: 2,
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    placeholder: {
      width: 40,
    },
    webview: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
  });

export default SamplePDFViewer;
