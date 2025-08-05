import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Linking } from "react-native";
import Navbar from "./Components/Navbar";

const YT_URL = 'https://www.youtube.com/@jharkhandhighccourtranchi';

const LiveStreaming = () => {
  useEffect(() => {
    // Optional small delay: setTimeout(() => { ... }, 600)
    Linking.openURL(YT_URL);
  }, []);

  return (
    <>
      <View style={styles.container}>
      <Navbar />
        <ActivityIndicator size="large" color="#e74c3c" style={{ marginBottom: 15 }} />
        <Text style={styles.redirectText}>Redirecting to YouTube Live...</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  redirectText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
  },
});

export default LiveStreaming;
