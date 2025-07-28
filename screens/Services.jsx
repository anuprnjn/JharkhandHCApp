import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; 

const Services = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation(); 

    const cards = [
        { name: "Case Status", icon: "briefcase-check", color: "#4CAF50", route: 'CaseStatus' },
        { name: "Cause List", icon: "file-document", color: "#FF9800", route: 'CauseList' },
        { name: "Orders & Judgement", icon: "gavel", color: "#9C27B0", route: 'OrdersJudgement' },
        { name: "Display Board", icon: "monitor-dashboard", color: "#3F51B5", route: 'DisplayBoard' },
        { name: "eFilings", icon: "file-upload", color: "#00BCD4", route: 'EFiling' },
        { name: "Apply Certified Copy", icon: "file-certificate", color: "#FFC107", route: 'CertifiedCopy' },
        { name: "E-Pass for Advocates/Litigant", icon: "card-account-details-outline", color: "#8BC34A", route: 'EPass' },
        { name: "Calendar", icon: "calendar", color: "#FF5722", route: 'Calendar' },
        { name: "VC Link", icon: "link", color: "#009688", route: 'VCLink' },
    ];

    const filteredCards = cards.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (route) => {
        navigation.navigate(route); 
    };

    return (
        <View style={styles.container}>

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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: wp('93%'),
        alignSelf: 'center',
        marginVertical: hp('3.5%'),
        backgroundColor: "#f0f0f0",
        borderRadius: hp('5%'),
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        height: hp('5%'),
        fontSize: 16,
        color: "#000",
        paddingLeft: 10,
    },
    searchIconContainer: {
        width: hp('5%'),
        height: hp('5%'),
        borderRadius: hp('4.5%'),
        backgroundColor: "#3b3b3b",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp('2%'),
    },
    cardsContainer: {
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4%'),
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: wp('28%'),
        backgroundColor: "#fff",
        borderRadius: wp('3%'),
        marginVertical: hp('1%'),
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('2%'),
        justifyContent: "center",
        alignItems: "center",
    },
    cardContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        width: hp('4.5%'),
        height: hp('4.5%'),
        borderRadius: hp('2.25%'),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: hp('1%'),
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
        paddingVertical: hp('5%'),
    },
    noResultsText: {
        fontSize: 16,
        color: "#999",
    },
});

export default Services;
