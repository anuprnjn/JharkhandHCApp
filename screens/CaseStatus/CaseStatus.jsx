import React, { useState } from "react";
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Components/Navbar";

const CaseStatus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const cards = [
    { name: "Case Number", icon: "file-document-outline", color: "#3F51B5", route: "Case Number" },
    { name: "Filing Number", icon: "file-document-edit-outline", color: "#FF5722", route: "Filing Number" },
    { name: "Case Type", icon: "file-certificate-outline", color: "#FF9800", route: "Case Type" },
    { name: "FIR Number", icon: "police-badge-outline", color: "#4CAF50", route: "FIR Number" },
    { name: "Party Name", icon: "account-group-outline", color: "#FFC107", route: "Party Name" },
    { name: "Advocate Name", icon: "account-tie-outline", color: "#E91E63", route: "Advocate Name" },
    { name: "Act", icon: "gavel", color: "#00BCD4", route: "Act" },
  ];

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (route) => {
    navigation.navigate(route); 
  };

  return (
    <View style={styles.container}>
      <Navbar/>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#929359" />
          <Text style={styles.headerText}>Case Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {filteredCards.length > 0 ? (
          filteredCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handleCardPress(card.route)}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                  <MaterialCommunityIcons name={card.icon} size={26} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{card.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      paddingHorizontal: 10,
      marginTop: hp('2%')
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#929359',
      marginLeft: 10,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: wp("93%"),
      alignSelf: "center",
      marginVertical: hp("2.5%"),
      backgroundColor: "#f0f0f0",
      borderRadius: hp("5%"),
      paddingHorizontal: wp("2%"),
      paddingVertical: hp("0.5%"),
      elevation: 5,
    },
    searchInput: {
      flex: 1,
      height: hp("5%"),
      fontSize: 16,
      color: "#000",
      paddingLeft: 10,
    },
    searchIconContainer: {
      width: hp("5%"),
      height: hp("5%"),
      borderRadius: hp("4.5%"),
      backgroundColor: "#3b3b3b",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: wp("2%"),
    },
    cardsContainer: {
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("4%"),
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      width: wp("28%"),
      backgroundColor: "#fff",
      borderRadius: wp("3%"),
      marginVertical: hp("1%"),
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("2%"),
      justifyContent: "center",
      alignItems: "center",
    },
    cardContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    iconContainer: {
      width: hp("4.5%"),
      height: hp("4.5%"),
      borderRadius: hp("2.25%"),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp("1%"),
    },
    cardTitle: {
      fontSize: 14,
      color: "#333",
      fontWeight: "600",
      textAlign: "center",
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingVertical: hp("5%"),
    },
    noResultsText: {
      fontSize: 16,
      color: "#999",
    },
  });

export default CaseStatus;