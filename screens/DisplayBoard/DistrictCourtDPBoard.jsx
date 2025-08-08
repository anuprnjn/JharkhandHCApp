import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image,
  Linking,
  Alert
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../../Context/ThemeContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../Components/Navbar';
import HeadingText from '../Components/HeadingText';
import WebViewComponent from '../Components/WebViewComponent';
import { useNavigation } from '@react-navigation/native';

const DistrictCourtDPBoard = () => {
    const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const DISTRICT_COURTS_DATA = [
    {
      id: 1,
      name: "Bokaro",
      districtCourt: "Bokaro",
      subDivisionalCourt: "Tenughat",
      gradient: ["#667eea", "#764ba2"],
    },
    {
      id: 2,
      name: "Chatra",
      districtCourt: "Chatra",
      subDivisionalCourt: null,
      gradient: ["#f093fb", "#f5576c"],
    },
    {
      id: 3,
      name: "Deoghar",
      districtCourt: "Deoghar",
      subDivisionalCourt: "Madhupur",
      gradient: ["#0986f3ff", "#0f9ea6ff"],
    },
    {
      id: 4,
      name: "Dhanbad",
      districtCourt: "Dhanbad",
      subDivisionalCourt: null,
      gradient: ["#43e97b", "#38f9d7"],
    },
    {
      id: 5,
      name: "Dumka",
      districtCourt: "Dumka",
      subDivisionalCourt: null,
      gradient: ["#fa709a", "#fee140"],
    },
    {
      id: 6,
      name: "East Singhbhum at Jamshedpur",
      districtCourt: "Jamshedpur",
      subDivisionalCourt: "Ghatshila",
      gradient: ["#a8edea", "#f5427aff"],
    },
    {
      id: 7,
      name: "Garhwa",
      districtCourt: "Garhwa",
      subDivisionalCourt: "Nagar-Untari",
      gradient: ["#ffecd2", "#f68b67ff"],
    },
    {
      id: 8,
      name: "Giridih",
      districtCourt: "Giridih",
      subDivisionalCourt: null,
      gradient: ["#a1c4fd", "#c2e9fb"],
    },
    {
      id: 9,
      name: "Godda",
      districtCourt: "Godda",
      subDivisionalCourt: null,
      gradient: ["#d299c2", "#fef9d7"],
    },
    {
      id: 10,
      name: "Gumla",
      districtCourt: "Gumla",
      subDivisionalCourt: null,
      gradient: ["#89f7fe", "#66a6ff"],
    },
    {
      id: 11,
      name: "Hazaribagh",
      districtCourt: "Hazaribagh",
      subDivisionalCourt: null,
      gradient: ["#fdbb2d", "#22c1c3"],
    },
    {
      id: 12,
      name: "Jamtara",
      districtCourt: "Jamtara",
      subDivisionalCourt: null,
      gradient: ["#ee9ca7", "#ffdde1"],
    },
    {
      id: 13,
      name: "Khunti",
      districtCourt: "Khunti",
      subDivisionalCourt: null,
      gradient: ["#667eea", "#764ba2"],
    },
    {
      id: 14,
      name: "Koderma",
      districtCourt: "Koderma",
      subDivisionalCourt: null,
      gradient: ["#f093fb", "#f5576c"],
    },
    {
      id: 15,
      name: "Latehar",
      districtCourt: "Latehar",
      subDivisionalCourt: null,
      gradient: ["#4facfe", "#00f2fe"],
    },
    {
      id: 16,
      name: "Lohardaga",
      districtCourt: "Lohardaga",
      subDivisionalCourt: null,
      gradient: ["#43e97b", "#38f9d7"],
    },
    {
      id: 17,
      name: "Pakur",
      districtCourt: "Pakur",
      subDivisionalCourt: null,
      gradient: ["#fa709a", "#fee140"],
    },
    {
      id: 18,
      name: "Palamau at Daltonganj",
      districtCourt: "Daltonganj",
      subDivisionalCourt: null,
      gradient: ["#a8edea", "#fed6e3"],
    },
    {
      id: 19,
      name: "Ramgarh",
      districtCourt: "Ramgarh",
      subDivisionalCourt: null,
      gradient: ["#ffecd2", "#fcb69f"],
    },
    {
      id: 20,
      name: "Ranchi",
      districtCourt: "Ranchi",
      subDivisionalCourt: null,
      gradient: ["#a1c4fd", "#c2e9fb"],
    },
    {
      id: 21,
      name: "Sahibganj",
      districtCourt: "Sahibganj",
      subDivisionalCourt: "Rajmahal",
      gradient: ["#d299c2", "#e65050ff"],
    },
    {
      id: 22,
      name: "Seraikella-Kharsawan",
      districtCourt: "Seraikella",
      subDivisionalCourt: null,
      gradient: ["#89f7fe", "#66a6ff"],
    },
    {
      id: 23,
      name: "Simdega",
      districtCourt: "Simdega",
      subDivisionalCourt: null,
      gradient: ["#fdbb2d", "#22c1c3"],
    },
    {
      id: 24,
      name: "West Singhbhum at Chaibasa",
      districtCourt: "Chaibasa",
      subDivisionalCourt: null,
      gradient: ["#ee9ca7", "#ffdde1"],
    }
  ];

  // Function to handle court clicks
   const handleCourtClick = async (courtName) => {
    const court_name = courtName.toLowerCase();
    navigation.navigate('WebViewComponent', {
      district_name: court_name,
      title: court_name
    });
  };

  const CourtItem = ({ court, index }) => {
    const hasSubCourt = court.subDivisionalCourt !== null;

    return (
      <View style={styles.courtContainer}>
        {/* Main District Court - Clickable */}
        <TouchableOpacity 
          style={styles.mainCourtRow}
          onPress={() => handleCourtClick(court.districtCourt)}
          activeOpacity={0.7}
        >
          {/* Location Icon */}
          <View style={[styles.iconContainer]}>
            <Icon name="map-marker" size={wp('6%')} color={court.gradient[0]} />
          </View>

          {/* District Information */}
          <View style={styles.districtInfo}>
            <Text style={[styles.districtName, { color: colors.text }]}>
              {court.name}
            </Text>
            <Text style={[styles.courtLabel, { color: colors.secText }]}>
              District Court • Tap to view
            </Text>
          </View>

          {/* Clickable indicator */}
          <Icon name="open-in-new" size={wp('5%')} color={colors.highlight} />
        </TouchableOpacity>

        {/* Sub-divisional Court with Arrow Connection */}
        {hasSubCourt && (
          <View style={styles.subCourtSection}>
            {/* Arrow Connection */}
            <View style={styles.arrowWrapper}>
              <Image 
                source={require('../../assets/images/arrow_right.png')}
                style={[
                  styles.arrowImage,
                  { tintColor: court.gradient[1] }
                ]}
                resizeMode="contain"
              />
            </View>

            {/* Sub Court Content - Clickable */}
            <TouchableOpacity 
                style={styles.subCourtRow}
                onPress={() => handleCourtClick(court.subDivisionalCourt + `_${court.districtCourt}`, 'subdivision')}
                activeOpacity={0.7}
                >
              {/* Sub Court Icon - Fixed background issue */}
              <View style={[
                styles.subIconContainer, 
              ]}>
                <Icon name="office-building" size={wp('5%')} color={court.gradient[1]} />
              </View>

              {/* Sub Court Information */}
              <View style={styles.subDistrictInfo}>
                <Text style={[styles.subDistrictName, { color: colors.text }]}>
                  {court.subDivisionalCourt}
                </Text>
                <Text style={[styles.subCourtLabel, { color: colors.secText }]}>
                  Sub-divisional Court • Tap to view
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navbar />
      <View style={{marginTop: 20}}>
        <HeadingText
          icon="monitor-multiple"
          iconType="material-community"
          heading="District Courts Display Board"
          subHeading="Search display Board of district and sub-division court."
        />
      </View>

      {/* Courts List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DISTRICT_COURTS_DATA.map((court, index) => (
          <CourtItem 
            key={court.id} 
            court={court} 
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: wp('5%'),
      paddingBottom: hp('8%'),
    },
    instructionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp('4%'),
      marginHorizontal: wp('5%'),
      marginTop: hp('2%'),
      borderRadius: wp('3%'),
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    instructionText: {
      marginLeft: wp('3%'),
      fontSize: wp('3.2%'),
      fontWeight: '500',
      flex: 1,
    },
    courtContainer: {
      marginBottom: hp('3%'),
    },
    mainCourtRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp('1%'),
      paddingHorizontal: wp('2%'),
      borderRadius: wp('2%'),
    },
    iconContainer: {
      width: wp('10%'),
      height: wp('10%'),
      borderRadius: wp('5%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp('4%'),
    },
    districtInfo: {
      flex: 1,
    },
    districtName: {
      fontSize: wp('4.5%'),
      fontWeight: '600',
      marginBottom: hp('0.2%'),
    },
    courtLabel: {
      fontSize: wp('3%'),
      fontWeight: '500',
    },
    subCourtSection: {
      marginTop: hp('1%'),
      marginLeft: wp('16%'), // Align after number text and icon
    },
    arrowWrapper: {
      marginBottom: hp('0.5%'),
      alignItems: 'flex-start',
    },
    arrowImage: {
      width: wp('20%'),
      height: hp('8%'),
      marginTop: hp("-2%"),
      marginLeft: wp("-3%"),
    },
    subCourtRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp('0.5%'),
      marginLeft: wp("13%"),
      marginTop: hp("-4.5%"),
      paddingHorizontal: wp('2%'),
      borderRadius: wp('2%'),
    },
    subIconContainer: {
      width: wp('8%'),
      height: wp('8%'),
      borderRadius: wp('4%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp('2%'),
    },
    subDistrictInfo: {
      flex: 1,
    },
    subDistrictName: {
      fontSize: wp('4%'),
      fontWeight: '600',
      marginBottom: hp('0.2%'),
    },
    subCourtLabel: {
      fontSize: wp('3%'),
      fontWeight: '500',
    },
    subRightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subStatusDot: {
      width: wp('2.5%'),
      height: wp('2.5%'),
      borderRadius: wp('1.25%'),
    },
  });

export default DistrictCourtDPBoard;
