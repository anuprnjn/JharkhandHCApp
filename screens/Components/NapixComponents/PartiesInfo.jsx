import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext';

// Functional component, can't use inline return because we need logic
const PartiesInfo = ({ caseInfo = {}, cnrData = {} }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Parties</Text>
      <View style={styles.partyContainer}>
        <Text style={styles.partyType}>Petitioner:</Text>
        <Text style={styles.partyName}>{caseInfo?.pet_name || cnrData?.pet_name || 'N/A'}</Text>
        <Text style={{color:"#6b51ffff"}}>Advocate: {cnrData?.pet_adv || 'N/A'}</Text>
      </View>
      <View style={styles.partyContainer}>
        <Text style={styles.partyType}>Respondent:</Text>
        <Text style={styles.partyName}>{caseInfo?.res_name || cnrData?.res_name || 'N/A'}</Text>
        <Text style={{color:"#6b51ffff"}}>Advocate: {cnrData?.res_adv || 'N/A'}</Text>
      </View>
    </View>
  );
};

// Dynamic styles function for theming support
const getStyles = (colors) => StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
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
  partyContainer: {
    marginBottom: hp('2%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  partyType: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: hp('0.5%'),
  },
  partyName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: colors.text,
    marginBottom: hp('0.5%'),
  },
  advocateName: {
    fontSize: wp('3.5%'),
    color: colors.secText,
    fontStyle: 'italic',
  },
});

export default PartiesInfo;
