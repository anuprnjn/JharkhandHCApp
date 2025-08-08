import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext'; // Adjust the path as needed

const BasicCaseInfo = ({ caseInfo = {}, cnrData = {}, formatDate }) => {
  const { colors, isDark } = useTheme();

  let status = 'N/A', statusColor = colors.highlight;
  if (cnrData?.pend_disp === 'D') {
    status = 'Disposed';
    statusColor = isDark ? '#ff453aff' : '#ff1900ff'; 
  } else if (cnrData?.pend_disp === 'P') {
    status = 'Pending';
    statusColor = '#f39c12';
  }

  // Styles depend on theme colors
  const styles = getStyles(colors);

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Basic Case Information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>CINO:</Text>
        <Text style={{ 
          color: colors.highlight, 
          fontWeight: 'bold', 
          fontSize: 16 
        }}>{caseInfo?.cino || cnrData?.cino || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Case No:</Text>
        <Text style={styles.infoValue}>
          {caseInfo?.type_name || cnrData?.type_name_reg || 'N/A'}/
          {caseInfo?.reg_no || cnrData?.reg_no || 'N/A'}/
          {caseInfo?.reg_year || cnrData?.reg_year || 'N/A'}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Filing Date:</Text>
        <Text style={styles.infoValue}>{formatDate(cnrData?.date_of_filing)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Status:</Text>
        <Text style={[
          styles.infoValue,
          {
            color: statusColor,
            fontWeight: 'bold',
            textTransform: "uppercase"
          }
        ]}>
          {status}
        </Text>
      </View>
      {cnrData?.pend_disp === 'D' && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Disposal Date:</Text>
            <Text style={styles.infoValue}>{formatDate(cnrData?.date_of_decision)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Disposal Type:</Text>
            <Text style={styles.infoValue}>{cnrData?.disposal_type || 'N/A'}</Text>
          </View>
        </>
      )}
    </View>
  );
};

// Generate styles depending on theme colors
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

export default BasicCaseInfo;
