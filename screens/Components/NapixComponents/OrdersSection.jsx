import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext';
import PDFViewer from '../NapixComponents/PDFViewer'; 

const OrdersSection = ({ caseInfo = {}, interimOrders = {}, finalOrders = {}, formatDate, decodeHtml }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const [showAllInterim, setShowAllInterim] = useState(false);
  const [showAllFinal, setShowAllFinal] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [loadingOrderId, setLoadingOrderId] = useState(null); // Track which order is loading

  const interimArr = interimOrders && Object.keys(interimOrders).length > 0 ? Object.values(interimOrders) : [];
  const finalArr = finalOrders && Object.keys(finalOrders).length > 0 ? Object.values(finalOrders) : [];

  const showInterim = showAllInterim ? interimArr : interimArr.slice(0, 5);
  const showFinal = showAllFinal ? finalArr : finalArr.slice(0, 5);

  const fetchPDF = async (order, type) => {
    const orderKey = `${type}-${order.order_no}-${order.order_date}`; // Create unique key for each order
    
    if (loadingOrderId === orderKey) return; // Prevent multiple clicks on same order

    setLoadingOrderId(orderKey); // Set loading for this specific order
    
    try {
      const payload = {
        cino: caseInfo?.cino || '',
        order_no: order.order_no.toString(),
        order_date: order.order_date
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

      const response = await fetch('http://10.134.8.12/jhc_app_api/searchOrderPdfHcNapix.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Get response as text first
      const responseText = await response.text();
      // Since your API returns direct base64 data, use it directly
      let pdfBase64 = responseText;

      // Clean the base64 string thoroughly
      let cleanBase64 = pdfBase64
        .replace(/\s/g, '') // Remove all whitespace
        .replace(/^data:application\/pdf;base64,/, '') // Remove data URL prefix if present
        .replace(/^data:.*;base64,/, '') // Remove any data URL prefix
        .replace(/[^A-Za-z0-9+/=]/g, ''); // Remove any non-base64 characters

      // Validate PDF - your data starts with JVBERi0x which is correct
      if (cleanBase64.length > 100 && cleanBase64.startsWith('JVBERi0x')) {
        setPdfData({
          base64Data: cleanBase64,
          order: order,
          type: type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Order #${order.order_no}`,
          fileName: `${type}_order_${order.order_no}_${order.order_date}.pdf`,
          caseInfo: caseInfo
        });
        setPdfModalVisible(true);
      } else {
        console.error('PDF validation failed');
        console.log('Length:', cleanBase64.length);
        console.log('Starts with JVBERi0x:', cleanBase64.startsWith('JVBERi0x'));
        throw new Error('Invalid PDF format received');
      }
      
    } catch (error) {
      console.error('Error fetching PDF:', error);
      
      let errorMessage = 'Failed to fetch PDF';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoadingOrderId(null); // Clear loading state
    }
  };

  const handleViewOrder = (order, type) => {
    // Validate required data
    if (!caseInfo?.cino) {
      Alert.alert('Error', 'Case information is missing');
      return;
    }
    
    if (!order?.order_no || !order?.order_date) {
      Alert.alert('Error', 'Order information is incomplete');
      return;
    }

    fetchPDF(order, type);
  };

  const closePDFModal = () => {
    setPdfModalVisible(false);
    setPdfData(null);
  };

  // Helper function to check if specific order is loading
  const isOrderLoading = (order, type) => {
    const orderKey = `${type}-${order.order_no}-${order.order_date}`;
    return loadingOrderId === orderKey;
  };

  return (
    <>
      {interimArr.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Orders Details</Text>
          {showInterim.map((order, i) => {
            const orderLoading = isOrderLoading(order, 'interim');
            return (
              <View key={`interim-${i}`} style={styles.orderItem}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Order #{order.order_no}</Text>
                  <View style={styles.headerRight}>
                    <TouchableOpacity
                      style={[styles.viewButton, orderLoading && styles.viewButtonDisabled]}
                      onPress={() => handleViewOrder(order, 'interim')}
                      activeOpacity={0.7}
                      disabled={orderLoading}
                    >
                      {orderLoading ? (
                        <Ionicons name="hourglass-outline" size={18} color="white" />
                      ) : (
                        <Ionicons name="eye-outline" size={18} color="white" />
                      )}
                      <Text style={styles.viewButtonText}>
                        {orderLoading ? 'Loading...' : 'View'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.orderDetails} numberOfLines={2}>
                  {decodeHtml ? decodeHtml(order.order_details) : order.order_details || 'N/A'}
                </Text>
                <Text style={styles.orderDate}>
                  {formatDate ? formatDate(order.order_date) : order.order_date}
                </Text>
              </View>
            );
          })}
          
          {interimArr.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => setShowAllInterim(!showAllInterim)}
            >
              <Text style={styles.viewAllText}>
                {showAllInterim ? 'Show Less' : `View All`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {finalArr.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Final Orders</Text>
          
          {showFinal.map((order, i) => {
            const orderLoading = isOrderLoading(order, 'final');
            return (
              <View key={`final-${i}`} style={[styles.orderItem, styles.finalOrderItem]}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Final Order #{order.order_no}</Text>
                  <View style={styles.headerRight}>
                    <TouchableOpacity
                      style={[styles.viewButton, orderLoading && styles.viewButtonDisabled]}
                      onPress={() => handleViewOrder(order, 'final')}
                      activeOpacity={0.7}
                      disabled={orderLoading}
                    >
                      {orderLoading ? (
                        <Ionicons name="hourglass-outline" size={18} color="white" />
                      ) : (
                        <Ionicons name="eye-outline" size={18} color="white" />
                      )}
                      <Text style={styles.viewButtonText}>
                        {orderLoading ? 'Loading...' : 'View'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.orderDetails} numberOfLines={2}>
                  {decodeHtml ? decodeHtml(order.order_details) : order.order_details || 'N/A'}
                </Text>
                <Text style={styles.orderDate}>
                  {formatDate ? formatDate(order.order_date) : order.order_date}
                </Text>
              </View>
            );
          })}
          
          {finalArr.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => setShowAllFinal(!showAllFinal)}
            >
              <Text style={styles.viewAllText}>
                {showAllFinal ? 'Show Less' : `View All (${finalArr.length})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* PDF Modal */}
    <Modal
      visible={pdfModalVisible}
      animationType="slide"
      onRequestClose={closePDFModal}
      presentationStyle="fullScreen"
    >
      {pdfData && (
        <PDFViewer
          pdfData={pdfData}
          onClose={closePDFModal} 
        />
      )}
    </Modal>
    </>
  );
};

const getStyles = (colors, isDark) => StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: hp('1%'),
  },
  orderItem: {
    backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa',
    padding: wp('3%'),
    borderRadius: 8,
    marginBottom: hp('1%'),
    borderLeftWidth: 3,
    borderLeftColor: colors.highlight,
  },
  finalOrderItem: {
    borderLeftColor: colors.error,
    backgroundColor: isDark ? '#4d1c1c' : '#fff5f5',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  orderNumber: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  orderDate: {
    fontSize: wp('3.5%'),
    color: colors.error,
    fontWeight: '600',
    paddingVertical: hp('1%'),
    borderRadius: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#219b21ff' : '#53319cff',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 6,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewButtonDisabled: {
    opacity: 0.6,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: '600',
    fontSize: wp('3.5%'),
    marginLeft: wp('1%'),
  },
  orderDetails: {
    fontSize: wp('3.2%'),
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: wp('4.5%'),
  },
  viewAllBtn: {
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: isDark ? '#444' : '#ececec',
    borderRadius: 6,
  },
  viewAllText: {
    color: isDark ? '#a0c1ff' : '#324B7A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrdersSection;
