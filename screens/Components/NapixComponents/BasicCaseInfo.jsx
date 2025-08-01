import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BasicCaseInfo = ({ caseInfo = {}, cnrData = {}, formatDate }) => {
  let status = 'N/A', statusColor = '#f39c12';
  if (cnrData?.pend_disp === 'D') {
    status = 'Disposed'; statusColor = '#ff1900ff';
  } else if (cnrData?.pend_disp === 'P') {
    status = 'Pending'; statusColor = '#f39c12';
  }
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Basic Case Information</Text>
      <View style={styles.infoRow}><Text style={styles.infoLabel}>CINO:</Text><Text style={styles.infoValue}>{caseInfo?.cino || cnrData?.cino || 'N/A'}</Text></View>
      <View style={styles.infoRow}><Text style={styles.infoLabel}>Case Type:</Text><Text style={styles.infoValue}>{caseInfo?.type_name || cnrData?.type_name_reg || 'N/A'}</Text></View>
      <View style={styles.infoRow}><Text style={styles.infoLabel}>Registration No:</Text><Text style={styles.infoValue}>{caseInfo?.reg_no || cnrData?.reg_no || 'N/A'}/{caseInfo?.reg_year || cnrData?.reg_year || 'N/A'}</Text></View>
      <View style={styles.infoRow}><Text style={styles.infoLabel}>Filing Date:</Text><Text style={styles.infoValue}>{formatDate(cnrData?.date_of_filing)}</Text></View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Status:</Text>
        <Text style={[styles.infoValue, { color: statusColor, fontWeight: 'bold', textTransform: "uppercase" }]}>{status}</Text>
      </View>
      {cnrData?.pend_disp === 'D' && (
        <>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Disposal Date:</Text><Text style={styles.infoValue}>{formatDate(cnrData?.date_of_decision)}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Disposal Type:</Text><Text style={styles.infoValue}>{cnrData?.disposal_type || 'N/A'}</Text></View>
        </>
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
  infoRow: { flexDirection: 'row', marginBottom: hp('1.5%'), alignItems: 'flex-start', },
  infoLabel: { fontSize: wp('4%'), fontWeight: '600', color: '#7f8c8d', width: wp('30%'), marginRight: wp('2%') },
  infoValue: { fontSize: wp('4%'), color: '#2c3e50', flex: 1, fontWeight: '500' },
});

export default BasicCaseInfo;
