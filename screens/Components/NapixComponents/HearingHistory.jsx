import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext'; // Adjust path if needed

const HearingHistory = ({ history = {}, formatDate, decodeHtml }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
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
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={styles.viewAllBtn}
        >
          <Text style={styles.viewAllText}>{showAll ? 'Show Less' : 'View All'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colors, isDark) =>
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
    hearingItem: {
      backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa', // dark mode friendly background
      padding: wp('4%'),
      borderRadius: 8,
      marginBottom: hp('1%'),
      borderLeftWidth: 3,
      borderLeftColor: colors.highlight,
    },
    hearingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp('0.5%'),
    },
    hearingDate: {
      fontSize: wp('3.6%'),
      fontWeight: 'bold',
      color: colors.text,
    },
    hearingPurpose: {
      fontSize: wp('3.5%'),
      color: colors.text,
      backgroundColor: isDark ? '#164d11' : '#dcf0ffff', 
      paddingHorizontal: wp('2%'),
      paddingVertical: hp('0.3%'),
      borderRadius: 10,
    },
    judgeName: {
      fontSize: wp('3.5%'),
      color: colors.text,
      marginBottom: hp('0.8%'),
    },
    nextDate: {
      fontSize: wp('3.5%'),
      color: colors.error,
      fontWeight: '600',
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

export default HearingHistory;
