import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HearingHistory = ({ history = {}, formatDate, decodeHtml }) => {
  const [showAll, setShowAll] = useState(false);
  if (!history) return null;
  const hearingArray = Object.values(history);
  const visible = showAll ? hearingArray : hearingArray.slice(0, 5);
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Recent Hearings</Text>
      {visible.map((hearing, index) => (
        <View key={index} style={styles.hearingItem}>
          <View style={styles.hearingHeader}>
            <Text style={styles.hearingDate}>{formatDate(hearing.business_date)}</Text>
            <Text style={styles.hearingPurpose}>{hearing.purpose_of_listing || 'N/A'}</Text>
          </View>
          <Text style={styles.judgeName}>{decodeHtml(hearing.judge_name) || 'N/A'}</Text>
          {hearing.hearing_date && hearing.hearing_date !== 'Next Date Not Given' && (
            <Text style={styles.nextDate}>Next: {formatDate(hearing.hearing_date)}</Text>
          )}
        </View>
      ))}
      {hearingArray.length > 5 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>{showAll ? 'Show Less' : 'View All'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: { backgroundColor: 'white', borderRadius: 12, padding: wp('4%'), marginBottom: hp('2%'),shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: wp('5%'), fontWeight: 'bold', color: '#000000ff', marginBottom: hp('2%'), borderBottomWidth: 1, borderBottomColor: '#ecf0f1', paddingBottom: hp('1%'), },
  hearingItem: { backgroundColor: '#f8f9fa', padding: wp('4%'), borderRadius: 8, marginBottom: hp('1%'), borderLeftWidth: 3, borderLeftColor: '#2a8a4a', },
  hearingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.5%'), },
  hearingDate: { fontSize: wp('3.6%'), fontWeight: 'bold', color: '#2c3e50', },
  hearingPurpose: { fontSize: wp('3.5%'), color: '#2980b9', backgroundColor: '#e3f2fd', paddingHorizontal: wp('2%'), paddingVertical: hp('0.3%'), borderRadius: 10, },
  judgeName: { fontSize: wp('3.5%'), color: '#5c5c5cff', marginBottom: hp('0.8%'), },
  nextDate: { fontSize: wp('3.5%'), color: '#e74c3c', fontWeight: '600', },
  viewAllBtn: { alignSelf: 'center', marginTop: 10, paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#ececec', borderRadius: 6, },
  viewAllText: { color: '#324B7A', fontWeight: 'bold', fontSize: 16, },
});

export default HearingHistory;
