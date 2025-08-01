import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CourtInfo = ({ regData = {}, cnrData = {}, decodeHtml }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Court Information</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>Establishment:</Text>
      <Text style={styles.infoValue}>{regData?.establishment_name || cnrData?.court_est_name || 'N/A'}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>Bench:</Text>
      <Text style={styles.infoValue}>{cnrData?.bench_name || 'N/A'}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>Judge:</Text>
      <Text style={styles.infoValue}>{decodeHtml(cnrData?.coram) || 'N/A'}</Text>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>Section:</Text>
      <Text style={styles.infoValue}>{cnrData?.judicial_branch || 'N/A'}</Text>
    </View>
  </View>
);

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

export default CourtInfo;
