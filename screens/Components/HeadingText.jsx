import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from './../../Context/ThemeContext'; 

const HeadingText = ({ icon, heading, subHeading }) => {
  const { colors, isDark } = useTheme(); // get colors and isDark

  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <View style={styles.sectionHeaderRow}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={isDark ? colors.highlight : colors.highlight} 
            style={{ marginRight: 5 }}
          />
        ) : null}
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? colors.highlight : colors.highlight }
          ]}
        >
          {heading}
        </Text>
      </View>
      {subHeading ? (
        <Text style={[styles.sectionSubtitle, { color: colors.text, opacity: 0.7 }]}>
          {subHeading}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: -20,
    paddingBottom: 28,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'center',
    marginTop: -8
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.03,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 19,
    marginLeft: 2,
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
});

export default HeadingText;
