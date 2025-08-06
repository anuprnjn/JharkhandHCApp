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
import { useTheme } from '../../../Context/ThemeContext';

const PDFViewer = ({ pdfData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [error, setError] = useState(null);
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const base64PDFString = pdfData?.base64Data || pdfData;

  const validateBase64PDF = (base64String) => {
    return base64String?.startsWith('JVBERi0x') && base64String.length > 100;
  };

  const openWithExternalApp = async (uri) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        type: 'application/pdf',
        flags: 1,
      });
      onClose(); // ✅ Use prop
    } catch (error) {
      console.error('Error opening external app:', error);
      Alert.alert('Error', 'No PDF viewer found or failed to open.', [
        { text: 'OK', onPress: onClose }, // ✅ Use prop
      ]);
    }
  };

  const createPDFFile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!base64PDFString) throw new Error('No PDF data provided');
      if (!validateBase64PDF(base64PDFString)) throw new Error('Invalid PDF format');

      const fileName = pdfData?.fileName || `temp_pdf_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64PDFString, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists || fileInfo.size === 0) throw new Error('Failed to create PDF');

      setPdfUri(fileUri);

      if (Platform.OS === 'android') {
        openWithExternalApp(fileUri);
      }
    } catch (error) {
      console.error('PDF error:', error);
      setError(error.message);
      Alert.alert('Error', `Failed to open PDF: ${error.message}`, [
        { text: 'OK', onPress: onClose }, // ✅ Use prop
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfData) createPDFFile();
  }, [pdfData]);

  const handleRetry = () => pdfData && createPDFFile();

  // Error screen
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent />
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>PDF Viewer</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="document-text-outline" size={64} color={colors.text} />
          <Text style={styles.errorTitle}>Failed to Load PDF</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // iOS viewer
  if (Platform.OS === 'ios' && pdfUri) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent />
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{pdfData?.title || 'PDF Viewer'}{pdfData?.orders?.order_date}</Text>
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
          onError={() => setError('Failed to load PDF in viewer')}
          originWhitelist={['*']}
          allowFileAccess
          javaScriptEnabled
        />
      </SafeAreaView>
    );
  }

  // Android fallback UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{pdfData?.title || 'PDF Viewer'}</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.highlight} />
        <Text style={styles.loadingText}>Preparing PDF...</Text>
      </View>
    </SafeAreaView>
  );
};

export default PDFViewer;

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
      paddingTop: Platform.OS === 'android' ? 40 : 20,
      paddingBottom: 12,
      backgroundColor: colors.cards,
    },
    backButton: {
      padding: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    placeholder: {
      width: 32, // space to balance the close icon
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
    },
    webview: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 20,
    },
    errorMessage: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 20,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
