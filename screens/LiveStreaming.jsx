import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

const LiveStreaming = () => {
    return (
        <View style={styles.container}>
            <View style={styles.webviewContainer}>
                <WebView
                    source={{ uri: 'https://www.youtube.com/@jharkhandhighcourtranchi' }} 
                    style={styles.webview}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    webviewContainer: {
        flex: 1,
        marginTop: hp('2%'), 
    },
    webview: {
        flex: 1,
    },
});

export default LiveStreaming;
