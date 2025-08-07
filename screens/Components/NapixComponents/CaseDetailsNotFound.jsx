import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext';

const CaseDetailsNotFound = ({
  caseType,
  caseNumber,
  caseYear,
  caseTypeOptions,
  onNewSearch,
  onRetrySearch,
}) => {
  const { colors, isDark } = useTheme();

  const getCaseTypeName = () => {
    const foundType = caseTypeOptions.find(option => option.value === caseType);
    return foundType ? foundType.label : caseType;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Error Message */}
        <View style={styles.messageContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Oops! No Results Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.text }]}>
            We couldn't find any data matching your search criteria.
            The data might not exist or the details entered might be incorrect.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: isDark ? '#22c55e' : '#00a671' }]}
            onPress={onNewSearch}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>New Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor: isDark ? 'transparent' : '#ffffff',
                borderColor: '#d73226ff',
                shadowColor: isDark ? '#000' : '#000',
                shadowOpacity: isDark ? 0.7 : 0.05,
              },
            ]}
            onPress={onRetrySearch}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#d73226ff" />
            <Text
              style={[
                styles.secondaryButtonText,
                { color: '#d73226ff' },
              ]}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    padding: wp('6%'),
    justifyContent: 'center',
    zIndex: 1,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
    marginTop: -100,
  },
  errorTitle: {
    fontSize: wp('7%'),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  errorSubtitle: {
    fontSize: wp('4%'),
    textAlign: 'center',
    lineHeight: wp('6%'),
    paddingHorizontal: wp('4%'),
  },
  tipsCard: {
    borderRadius: 16,
    padding: wp('5%'),
    marginBottom: hp('4%'),
    borderLeftWidth: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  tipsTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#f59e0b',
    marginLeft: wp('2%'),
  },
  tipsList: {
    gap: hp('1%'),
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
    marginTop: hp('0.8%'),
    marginRight: wp('3%'),
  },
  tipText: {
    flex: 1,
    fontSize: wp('3.8%'),
    lineHeight: wp('5%'),
  },
  actionContainer: {
    flexDirection: 'row',
    gap: wp('4%'),
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.8%'),
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontWeight: '700',
    marginLeft: wp('2%'),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.8%'),
    borderRadius: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    marginLeft: wp('2%'),
  },
});

export default CaseDetailsNotFound;
