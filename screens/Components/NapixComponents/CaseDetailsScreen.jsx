import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Context/ThemeContext';
import Navbar from '../Navbar';

const CaseDetailsScreen = ({ route, navigation }) => {
  const { colors, isDark } = useTheme();
  const { caseData } = route.params;
  
  const [detailsData, setDetailsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://10.134.8.12/jhc_app_api/searchByCNRNapix.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          cino: caseData.cino
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);
      
      if (data && data.cino) {
        setDetailsData(data);
      } else {
        throw new Error('Invalid response data');
      }
      
    } catch (error) {
      console.error('Error fetching case details:', error);
      Alert.alert(
        "Error", 
        "Failed to fetch case details. Please try again later.",
        [
          { text: "OK" },
          { text: "Go Back", onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '' || dateString === '0000-00-00') return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Text style={[styles.detailLabel, { color: colors.secText }]}>{label}</Text>
      </View>
      <View style={styles.detailRight}>
        <Text style={[styles.detailValue, { color: colors.text }]} selectable>
          {value || 'N/A'}
        </Text>
      </View>
    </View>
  );

  const SectionHeader = ({ title }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.highlight + '10' }]}>
      <Text style={[styles.sectionTitle, { color: colors.highlight }]}>{title}</Text>
      <View style={[styles.headerLine, { backgroundColor: colors.border }]} />
    </View>
  );

  // Case Summary Component
  const CaseSummaryCard = () => (
    <View style={[styles.caseSummaryCard, { 
        backgroundColor: colors.background,
        shadowColor: isDark ? '#000' : colors.highlight + '40',
        borderColor: colors.border
      }]}>
      {/* Header Section */}
      <View style={styles.caseSummaryHeader}>
        <View style={styles.caseInfo}>
          <Text style={[styles.caseTitle, { color: colors.highlight }]}>
            Case Details
          </Text>
        </View>
      </View>
      <View style={[styles.headerLine, { backgroundColor: colors.border }]} />
      
      {/* Parties Section */}
      <View style={styles.partiesSection}>
        <Text style={[styles.partiesLabel, { color: colors.secText }]}>
          Parties Involved
        </Text>
        <View style={styles.partiesContainer}>
          <View style={styles.partyBlock}>
            <Text style={[styles.partyLabel, { color: colors.secText }]}>Petitioner</Text>
            <Text style={[styles.partyName, { color: colors.text }]} numberOfLines={2}>
              {caseData.pet_name}
            </Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: colors.highlight }]}>Vs</Text>
          </View>
          
          <View style={styles.partyBlock}>
            <Text style={[styles.partyLabel, { color: colors.secText }]}>Respondent</Text>
            <Text style={[styles.partyName, { color: colors.text }]} numberOfLines={2}>
              {caseData.res_name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCaseBasicInfo = () => (
    <View style={[styles.section, { backgroundColor: colors.background,
        shadowColor: isDark ? '#000' : colors.highlight + '40',
        borderColor: colors.border }]}>
      <SectionHeader title="Basic Information" />
      <View style={styles.sectionContent}>
        <DetailRow 
          label="CINO" 
          value={detailsData.cino} 
        />
        <DetailRow 
          label="Case Number" 
          value={`${detailsData.type_name_reg}/${detailsData.reg_no}/${detailsData.reg_year}`} 
        />
        <DetailRow 
          label="Filling Number" 
          value={`${detailsData.type_name_reg}/${detailsData.fil_no}/${detailsData.fil_year}`} 
        />
        <DetailRow 
          label="Date of Filing" 
          value={formatDate(detailsData.date_of_filing)} 
        />
        <DetailRow 
          label="Date of Registration" 
          value={formatDate(detailsData.dt_regis)} 
        />
        <View style={styles.statusRow}>
          <View style={styles.detailLeft}>
            <Text style={[styles.detailLabel, { color: colors.secText }]}>Status</Text>
          </View>
          <View style={styles.detailRight}>
            <View style={[styles.statusBadge, { 
              backgroundColor: detailsData.pend_disp === 'P' ? colors.info + '15' : colors.error + '15' 
            }]}>
              <Text style={[styles.statusText, { 
                color: detailsData.pend_disp === 'P' ? colors.info : colors.error 
              }]}>
                {detailsData.pend_disp === 'P' ? 'PENDING' : 'DISPOSED'}
              </Text>
            </View>
          </View>
        </View>
        
        {detailsData.pend_disp === 'D' && (
          <DetailRow 
            label="Date of Decision" 
            value={formatDate(detailsData.date_of_decision)} 
          />
        )}
      </View>
    </View>
  );

  const renderCourtInfo = () => (
    <View style={[styles.section, { backgroundColor: colors.background,
        shadowColor: isDark ? '#000' : colors.highlight + '40',
        borderColor: colors.border }]}>
      <SectionHeader title="Court Information" />
      
      <View style={styles.sectionContent}>
        <DetailRow 
          label="Court" 
          value={detailsData.court_est_name} 
        />
        
        <DetailRow 
          label="Bench Type" 
          value={detailsData.bench_name} 
        />
        
        <DetailRow 
          label="Judicial Branch" 
          value={detailsData.judicial_branch} 
        />
        
        {detailsData.short_order && (
          <DetailRow 
            label="Short Order" 
            value={detailsData.short_order} 
          />
        )}
      </View>
    </View>
  );

  const renderPartyInfo = () => (
    <View style={[styles.section, { backgroundColor: colors.background,
        shadowColor: isDark ? '#000' : colors.highlight + '40',
        borderColor: colors.border }]}>
      <SectionHeader title="Party Information" />
      
      <View style={styles.sectionContent}>
        <DetailRow 
          label="Petitioner" 
          value={detailsData.pet_name} 
        />
        
        <DetailRow 
          label="Petitioner Advocate" 
          value={detailsData.pet_adv} 
        />
        
        <DetailRow 
          label="Respondent" 
          value={detailsData.res_name} 
        />
        
        <DetailRow 
          label="Respondent Advocate" 
          value={detailsData.res_adv} 
        />

        {detailsData.res_extra_party && Object.keys(detailsData.res_extra_party).length > 0 && (
          <DetailRow 
            label="Additional Respondent" 
            value={Object.values(detailsData.res_extra_party).join(', ')} 
          />
        )}
      </View>
    </View>
  );

const renderHearingHistory = () => {
  if (!detailsData.historyofcasehearing || Object.keys(detailsData.historyofcasehearing).length === 0) {
    return null;
  }
  return (
    <View style={[styles.section, { backgroundColor: colors.background,
        shadowColor: isDark ? '#000' : colors.highlight + '40',
        borderColor: colors.border }]}>
      <SectionHeader title="Hearing History" />
      
      <View style={styles.sectionContent}>
        {Object.entries(detailsData.historyofcasehearing).map(([key, hearing], index) => (
          <View key={key} style={styles.hearingCard}>
            <View style={styles.hearingHeader}>
              <Text style={[styles.hearingNumber, { color: colors.highlight }]}>
                Hearing ({index + 1})
              </Text>
              <Text style={[styles.hearingDate, { color: colors.text }]}>
                {formatDate(hearing.business_date)}
              </Text>
            </View>
            
            <Text style={[styles.hearingPurpose, { color: colors.text }]}>
              Purpose: {hearing.purpose_of_listing}
            </Text>
            
            {hearing.judge_name && (
              <Text style={[styles.judgeName, { color: colors.secText }]}>
                Judge: {hearing.judge_name.replace(/&#039;/g, "'")}
              </Text>
            )}
            
            {hearing.hearing_date && hearing.hearing_date !== 'Next Date Not Given' && (
              <Text style={[styles.nextDate, { color: colors.secText }]}>
                Next Date: {hearing.hearing_date}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};


  const renderCategoryDetails = () => {
    if (!detailsData.category_details) return null;

    return (
      <View style={[styles.section, { backgroundColor: colors.background,
        shadowColor: isDark ? '#000' : colors.highlight + '40',
        borderColor: colors.border }]}>
        <SectionHeader title="Category Details" />
        
        <View style={styles.sectionContent}>
          <DetailRow 
            label="Category" 
            value={detailsData.category_details.category} 
          />
          
          <DetailRow 
            label="Sub Category" 
            value={detailsData.category_details.sub_category} 
          />
          
          <DetailRow 
            label="Sub Sub Category" 
            value={detailsData.category_details.sub_sub_category} 
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navbar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.highlight} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading case details...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navbar />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Case Summary */}
        <CaseSummaryCard />
        
        {/* Case Details Sections */}
        {detailsData && (
          <>
            {renderCaseBasicInfo()}
            {renderCourtInfo()}
            {renderPartyInfo()}
            {renderHearingHistory()}
            {renderCategoryDetails()}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp('4%'),
    paddingBottom: hp('10%'),
  },

  // Case Summary Card Styles
  caseSummaryCard: {
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    borderWidth: 1,
  },

  caseSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp("1%")
  },

  caseInfo: {
    flex: 1,
  },

  caseTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
  },

  partiesSection: {
    paddingTop: hp('2%'),
  },

  partiesLabel: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: hp('1.5%'),
  },

  partiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  partyBlock: {
    flex: 1,
  },

  partyLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  partyName: {
    fontSize: wp('3.6%'),
    fontWeight: '500',
    lineHeight: wp('5%'),
  },

  vsContainer: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    marginHorizontal: wp('2%'),
  },

  vsText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    fontStyle: 'italic',
    marginRight: wp("4%")
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    fontWeight: '500',
  },

  // Section Styles
  section: {
    marginBottom: hp('3%'),
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    padding: wp('4%'),
    paddingBottom: wp('3%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
  },
  sectionContent: {
    paddingBottom: wp('0%'),
  },

  // Horizontal Line Style
  headerLine: {
    height: 1,
    marginTop: hp('1%'),
    marginHorizontal: wp('0%'),
  },

  // Detail Row Styles - Clean Left and Right Layout
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    minHeight: hp('2%'),
  },
  detailLeft: {
    flex: 0.4,
  },
  detailRight: {
    flex: 0.6,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
  detailValue: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
    textAlign: 'right',
    lineHeight: wp('5%'),
  },

  // Status Styles
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    minHeight: hp('6%'),
  },
  statusBadge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 20,
  },
  statusText: {
    fontSize: wp('3.2%'),
    fontWeight: '700',
  },

  // Hearing History Styles - Simplified
// Hearing History Styles - Simplified
hearingCard: {
  marginHorizontal: wp('4%'),
  marginBottom: hp('1.5%'),
  padding: wp('2%'),
  borderRadius: 12,
},
hearingHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
hearingNumber: {
  fontSize: wp('4%'),
  fontWeight: '700',
},
hearingDate: {
  fontSize: wp('3.8%'),
  fontWeight: '600',
},
hearingPurpose: {
  fontSize: wp('3.5%'),
  fontWeight: '500',
  marginBottom: 8,
},
judgeName: {
  fontSize: wp('3.2%'),
  marginBottom: 4,
},
nextDate: {
  fontSize: wp('3.2%'),
},

});

export default CaseDetailsScreen;
