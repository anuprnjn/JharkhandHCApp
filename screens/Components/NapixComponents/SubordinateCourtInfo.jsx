import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext'; // Adjust path if necessary

const SubordinateCourtInfo = ({ cnrData = {} }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Subordinate Court Information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Court No and Name:</Text>
        <Text style={styles.infoValue}>{cnrData?.lower_court_name || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Case No and Year:</Text>
        <Text style={styles.infoValue}>{cnrData?.lower_court_caseno || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Case Decision Date:</Text>
        <Text style={styles.infoValue}>{cnrData?.lower_court_dec_dt || 'N/A'}</Text>
      </View>
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
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
    infoRow: {
      flexDirection: 'row',
      marginBottom: hp('1.5%'),
      alignItems: 'flex-start',
    },
    infoLabel: {
      fontSize: wp('4%'),
      fontWeight: '600',
      color: colors.text,
      width: wp('30%'),
      marginRight: wp('2%'),
    },
    infoValue: {
      fontSize: wp('4%'),
      color: colors.text,
      flex: 1,
      fontWeight: '500',
    },
  });

export default SubordinateCourtInfo;
