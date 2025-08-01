import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Navbar from './Components/Navbar';

const About = () => {
  return (
    <>
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        {/* Main Content */}
        <View style={styles.contentCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          
          <Text style={styles.paragraph}>
            High Court of Jharkhand was created after the State of Jharkhand was carved out of the State of Bihar on 
            <Text style={styles.highlight}> 15 November 2000</Text>, by the Bihar Reorganization Act, 2000.
          </Text>

          <Text style={styles.paragraph}>
            Earlier, the Circuit Bench of the Patna High Court was established at Ranchi on 
            <Text style={styles.highlight}> 6 March 1972</Text> under Clause 36 of the Letters Patent of the Patna High Court. 
            The Circuit Bench became the Permanent Bench of the Patna High Court by the High Court at Patna 
            (Establishment of Permanent Bench at Ranchi) Act 1976 on <Text style={styles.highlight}>8 April 1976</Text>.
          </Text>

          <Text style={styles.paragraph}>
            This Permanent Bench finally became the High Court of Jharkhand on reorganization of Bihar State. 
            The Court has jurisdiction over the State of Jharkhand and the seat of the Court is at 
            <Text style={styles.highlight}> Ranchi</Text>, the administrative capital of the State.
          </Text>
        </View>

        {/* Court Strength Info */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Court Strength</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <InfoItem 
              icon="calendar" 
              label="Initially Established" 
              value="12 Judges" 
              color="#3b82f6"
            />
            <InfoItem 
              icon="trending-up" 
              label="Increased (2007)" 
              value="20 Judges" 
              color="#8b5cf6"
            />
            <InfoItem 
              icon="checkmark-circle" 
              label="Current Strength" 
              value="25 Judges" 
              color="#10b981"
            />
          </View>
        </View>

        {/* Future Development */}
        <View style={styles.developmentCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={24} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Future Development</Text>
          </View>
          
          <Text style={styles.paragraph}>
            Due to increase in the strength of judges and case load, there is acute shortage of space in the present building.
          </Text>

          <View style={styles.projectHighlight}>
            <Text style={styles.projectTitle}>New High Court Complex</Text>
            <View style={styles.projectDetails}>
              <ProjectDetail icon="resize" label="Campus Area" value="165 acres" />
              <ProjectDetail icon="location" label="Location" value="HEC Industrial Area" />
              <ProjectDetail icon="cash" label="Estimated Cost" value="₹460 Crores" />
            </View>
            <Text style={styles.projectDescription}>
              The new building will house the High Court, residential complex for Judges, Registry members, 
              Lawyers Chambers, and State Bar Council building with all modern amenities.
            </Text>
          </View>
        </View>
        
      </ScrollView>
      </View>
    </>
  );
};

// Helper Components
const InfoItem = ({ icon, label, value, color }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, { color }]}>{value}</Text>
  </View>
);

const ProjectDetail = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={16} color="#f59e0b" />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  contentCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    padding: wp('5%'),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 10
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    padding: wp('5%'),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  developmentCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    padding: wp('5%'),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  servicesCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    padding: wp('5%'),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.8%'),
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: wp('2%'),
  },
  paragraph: {
    fontSize: wp('3.8%'),
    lineHeight: wp('5.5%'),
    color: '#374151',
    marginBottom: hp('1.5%'),
    textAlign: 'justify',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#267b29ff',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoItem: {
    alignItems: 'center',
    width: '30%',
    paddingVertical: hp('1%'),
  },
  infoLabel: {
    fontSize: wp('3.2%'),
    color: '#6b7280',
    textAlign: 'center',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.3%'),
  },
  infoValue: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  projectHighlight: {
    backgroundColor: '#fffbeb',
    padding: wp('4%'),
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  projectTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: hp('1%'),
  },
  projectDetails: {
    marginVertical: hp('1%'),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    color: '#b45309',
    marginLeft: wp('2%'),
    fontWeight: '600',
  },
  detailValue: {
    fontSize: wp('3.5%'),
    color: '#92400e',
    marginLeft: wp('2%'),
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: wp('3.5%'),
    color: '#78350f',
    lineHeight: wp('5%'),
    marginTop: hp('1%'),
  },
});

export default About;
