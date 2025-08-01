import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PartiesInfo = ({ caseInfo = {}, cnrData = {} }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Parties</Text>
    <View style={styles.partyContainer}>
      <Text style={styles.partyType}>Petitioner:</Text>
      <Text style={styles.partyName}>{caseInfo?.pet_name || cnrData?.pet_name || 'N/A'}</Text>
      <Text style={styles.advocateName}>Advocate: {cnrData?.pet_adv || 'N/A'}</Text>
    </View>
    <View style={styles.partyContainer}>
      <Text style={styles.partyType}>Respondent:</Text>
      <Text style={styles.partyName}>{caseInfo?.res_name || cnrData?.res_name || 'N/A'}</Text>
      <Text style={styles.advocateName}>Advocate: {cnrData?.res_adv || 'N/A'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionCard: { backgroundColor: 'white', borderRadius: 12, padding: wp('4%'), marginBottom: hp('2%'),shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: wp('5%'), fontWeight: 'bold', color: '#000000ff', marginBottom: hp('2%'), borderBottomWidth: 1, borderBottomColor: '#ecf0f1', paddingBottom: hp('1%'), },
  partyContainer: { marginBottom: hp('2%'), paddingBottom: hp('1%'), borderBottomWidth: 0.5, borderBottomColor: '#ecf0f1', },
  partyType: { fontSize: wp('4%'), fontWeight: 'bold', color: '#2980b9', marginBottom: hp('0.5%'), },
  partyName: { fontSize: wp('4%'), fontWeight: '600', color: '#2c3e50', marginBottom: hp('0.5%'), },
  advocateName: { fontSize: wp('3.5%'), color: '#7f8c8d', fontStyle: 'italic', },
});

export default PartiesInfo;
