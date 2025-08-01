import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

const CaseDetailsNotFound = ({ 
  caseType, 
  caseNumber, 
  caseYear, 
  caseTypeOptions, 
  onNewSearch, 
  onRetrySearch 
}) => {
  const getCaseTypeName = () => {
    const foundType = caseTypeOptions.find(option => option.value === caseType);
    return foundType ? foundType.label : caseType;
  };

  return (
    <View style={styles.container}>
      {/* Floating Elements Background */}
      <View style={styles.floatingElements}>
        <View style={[styles.floatingCircle, styles.circle1]} />
        <View style={[styles.floatingCircle, styles.circle2]} />
        <View style={[styles.floatingCircle, styles.circle3]} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Error Illustration */}

        {/* Error Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.errorTitle}>Oops! No Results Found</Text>
          <Text style={styles.errorSubtitle}>
            We couldn't find any case matching your search criteria.
            The case might not exist or the details might be incorrect.
          </Text>
        </View>

        {/* Help Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#f59e0b" />
            <Text style={styles.tipsTitle}>Try These Tips</Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Verify the case number is correct</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Check if the case year matches</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Ensure correct case type is selected</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={onNewSearch}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>New Search</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={onRetrySearch}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#d73226ff" />
            <Text style={styles.secondaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    position: 'relative',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: '#f59e0b',
    top: hp('10%'),
    right: wp('10%'),
  },
  circle2: {
    width: 60,
    height: 60,
    backgroundColor: '#ef4444',
    top: hp('60%'),
    left: wp('5%'),
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: '#f59e0b',
    bottom: hp('20%'),
    right: wp('20%'),
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
    marginTop: -50
  },
  errorTitle: {
    fontSize: wp('7%'),
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  errorSubtitle: {
    fontSize: wp('4%'),
    color: '#64748b',
    textAlign: 'center',
    lineHeight: wp('6%'),
    paddingHorizontal: wp('4%'),
  },
  searchInfo: {
    gap: hp('1.5%'),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: wp('3.2%'),
    color: '#64748b',
    fontWeight: '500',
    marginBottom: hp('0.2%'),
  },
  infoValue: {
    fontSize: wp('3.8%'),
    color: '#1e293b',
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: wp('5%'),
    marginBottom: hp('4%'),
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  tipsTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#92400e',
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
    color: '#78350f',
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
    backgroundColor: '#00a671ff',
    paddingVertical: hp('1.8%'),
    borderRadius: 12,
    shadowColor: '#6a6889ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    backgroundColor: '#ffffff',
    paddingVertical: hp('1.8%'),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d73226ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#d73226ff',
    fontSize: wp('4%'),
    fontWeight: '700',
    marginLeft: wp('2%'),
  },
});

export default CaseDetailsNotFound;