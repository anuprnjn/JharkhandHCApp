import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext'; // Adjust path as needed

const OrdersSection = ({ interimOrders = {}, finalOrders = {}, formatDate, decodeHtml }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const [showAllInterim, setShowAllInterim] = useState(false);
  const [showAllFinal, setShowAllFinal] = useState(false);

  const interimArr = interimOrders && Object.keys(interimOrders).length > 0 ? Object.values(interimOrders) : [];
  const finalArr = finalOrders && Object.keys(finalOrders).length > 0 ? Object.values(finalOrders) : [];

  const showInterim = showAllInterim ? interimArr : interimArr.slice(0, 5);
  const showFinal = showAllFinal ? finalArr : finalArr.slice(0, 5);

  const handleViewOrder = (order, type) => {
    // Handle view order logic here
    console.log(`Viewing ${type} order:`, order);
    // You can add navigation to a detailed view or open a modal
  };

  return (
    <>
      {interimArr.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Orders Details</Text>
          {showInterim.map((order, i) => (
            <View key={i} style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.order_no}</Text>
                <View style={styles.headerRight}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewOrder(order, 'interim')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={16} color={colors.text} />
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.orderDetails} numberOfLines={2}>
                {decodeHtml(order.order_details) || 'N/A'}
              </Text>
              <Text style={styles.orderDate}>{formatDate(order.order_date)}</Text>
            </View>
          ))}
          {interimArr.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => setShowAllInterim(!showAllInterim)}
            >
              <Text style={styles.viewAllText}>
                {showAllInterim ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {finalArr.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Final Orders</Text>
          {showFinal.map((order, i) => (
            <View key={i} style={[styles.orderItem, styles.finalOrderItem]}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Final Order #{order.order_no}</Text>
                <View style={styles.headerRight}>
                  
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewOrder(order, 'final')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={16} color={colors.text} />
                    <Text style={[styles.viewButtonText, { color: colors.text }]}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.orderDetails} numberOfLines={2}>
                {decodeHtml(order.order_details) || 'N/A'}
              </Text>
              <Text style={styles.orderDate}>{formatDate(order.order_date)}</Text>
            </View>
          ))}
          {finalArr.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => setShowAllFinal(!showAllFinal)}
            >
              <Text style={styles.viewAllText}>
                {showAllFinal ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: hp('1%'),
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
    backgroundColor: isDark ? '#219b21ff' : '#e8f5e8',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 6,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: wp('4%'),
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
