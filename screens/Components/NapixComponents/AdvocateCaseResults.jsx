import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const AdvocateCaseResults = ({ searchResults, advocateName, caseYear, caseStatus }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  const handleCasePress = (caseData) => {
    navigation.navigate('CaseDetailsScreen', { caseData });
  };

  const renderCaseItem = (caseKey, caseData, index) => {
    return (
      <TouchableOpacity 
        key={caseKey} 
        style={[styles.caseCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={() => handleCasePress(caseData)}
        activeOpacity={0.7}
      >
        <View style={styles.caseHeader}>
          <View style={[styles.caseTypeBadge, { backgroundColor: colors.highlight + '15' }]}>
            <Text style={[styles.caseTypeBadgeText, { color: colors.highlight }]}>
              (#{index + 1})
            </Text>
          </View>
          <View style={styles.caseNumberContainer}>
            <Text style={[styles.caseNumber, { color: colors.text }]}>
              {caseData.type_name}/{caseData.reg_no}/{caseData.reg_year}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.secText} />
          </View>
        </View>

        <View style={styles.caseDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.secText }]}>Petitioner</Text>
              <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
                {caseData.pet_name}
              </Text>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <View style={styles.detailRow}>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.secText }]}>Respondent</Text>
              <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
                {caseData.res_name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const casesArray = Object.entries(searchResults.casenos || {});
  const totalCases = casesArray.length;

  return (
    <View style={styles.container}>
      <View style={[styles.summaryCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.summaryHeader}>
          <Ionicons name="analytics-outline" size={24} color={colors.highlight} />
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Search Summary</Text>
        </View>
        
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Advocate:</Text>
            <Text style={[styles.summaryValue, { color: colors.highlight, fontWeight: 'bold', fontSize: 20 }]}>{advocateName}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Year:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{caseYear}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Status:</Text>
            <Text style={[styles.summaryValue, { color: colors.error, fontWeight: "700" }]}>
              {caseStatus === 'P' ? 'PENDING' : 'DISPOSED'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Total Cases:</Text>
            <Text style={[styles.summaryValue, { color: colors.highlight, fontWeight: 'bold' }]}>
              {totalCases}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Court:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]} numberOfLines={2}>
              {searchResults.establishment_name}
            </Text>
          </View>
        </View>
      </View>

      {/* User Instructions */}
      <View style={[styles.instructionsCard, { backgroundColor: colors.highlight + '10', borderColor: colors.border }]}>
        <View style={styles.instructionsHeader}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={[styles.instructionsTitle, { color: colors.info }]}>Instructions</Text>
        </View>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          Click on any case below to view detailed case info.
        </Text>
      </View>

      <View style={styles.casesSection}>
        <Text style={[styles.casesSectionTitle, { color: colors.text }]}>
          Cases ({totalCases})
        </Text>
        
        {casesArray.map(([caseKey, caseData], index) => renderCaseItem(caseKey, caseData, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    padding: wp('4%'),
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: hp('2%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  summaryTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  summaryContent: {
    gap: hp('1%'),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  summaryLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
    flex: 0.4,
  },
  summaryValue: {
    fontSize: wp('3.8%'),
    flex: 0.6,
    textAlign: 'right',
  },
  instructionsCard: {
    padding: wp('4%'),
    borderRadius: 12,
    marginBottom: hp('2%'),
    borderWidth: 1,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  instructionsTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  instructionsText: {
    fontSize: wp('3.5%'),
    lineHeight: wp('5.5%'),
  },
  casesSection: {
    marginTop: hp('1%'),
  },
  casesSectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  caseCard: {
    borderRadius: 16,
    marginBottom: hp('2%'),
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: 'hidden',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    paddingBottom: wp('3%'),
  },
  caseNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    flex: 1,
    justifyContent: 'flex-end',
  },
  caseTypeBadge: {
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 25,
  },
  caseTypeBadgeText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  caseNumber: {
    fontSize: wp('4%'),
    fontWeight: '700',
    textAlign: 'right',
  },
  caseDetails: {
    paddingHorizontal: wp('4%'),
    paddingBottom: wp('4%'),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: hp('1%'),
  },
  iconContainer: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: wp('3.6%'),
    lineHeight: wp('5.2%'),
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginVertical: hp('0.5%'),
    marginLeft: wp('10%'),
  },
});


export default AdvocateCaseResults;
