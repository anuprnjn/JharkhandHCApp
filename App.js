import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { Ionicons, FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './screens/Home';
import Services from './screens/Services';
import Navbar from './screens/Components/Navbar';
import LiveStreaming from './screens/LiveStreaming';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EPayment from './screens/EPayment';
import EcourtFee from './screens/ECourtFee';
import VirtualCourt from './screens/VirtualCourt';
import Escr from './screens/Escr';
import Njdg from './screens/Njdg';
import CaseNumber from './screens/CaseStatus/CaseNumber';
import CaseStatus from './screens/CaseStatus/CaseStatus';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomHeader({ navigation }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Navbar />
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ position: 'absolute', top: 100, left: 20 }}>
        <Ionicons name="menu" size={30} />
      </TouchableOpacity>
    </View>
  );
}

function CustomDrawerContent(props) {
  
  const getIcon = (routeName, isActive) => {
    const color = isActive ? 'white' : '#27b099';
    switch (routeName) {
      case 'Services':
        return <FontAwesome name="bars" size={20} color={color} />;
      case 'E-Pay':
        return <FontAwesome name="credit-card" size={20} color={color} />;
      case 'Online E-Court Fee':
        return <Ionicons name="document-text-outline" size={20} color={color} />;
      case 'Virtual Court':
        return <FontAwesome name="gavel" size={20} color={color} />;
      case 'eScr':
        return <Ionicons name="book-outline" size={20} color={color} />;
      case 'NJDG':
        return <FontAwesome name="database" size={20} color={color} />;
      case 'Live Streaming':
        return <Ionicons name="videocam" size={20} color={color} />;
      default:
        return <Ionicons name="chevron-forward-circle-outline" size={20} color={color} />;
    }
  };
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <ImageBackground source={require('./assets/images/side_gradient.jpg')} style={styles.drawerBackground}>
      <View style={styles.drawerContent}>
        {/* Welcome Text with Icon */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <MaterialCommunityIcons name="bank" size={24} color="gray" />
        </View>

        {/* Drawer Items */}
        <View style={styles.drawerItems}>
          {props.state.routeNames.map((routeName, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => props.navigation.navigate(routeName)}
              style={[
                styles.drawerItem,
                props.state.index === index && styles.drawerItemActive,
              ]}
            >
              <View style={styles.itemContent}>
                {/* Display the icon based on the route name */}
                {getIcon(routeName, props.state.index === index)}
                <Text
                  style={[
                    styles.drawerItemText,
                    props.state.index === index && styles.drawerItemTextActive,
                  ]}
                >
                  {routeName}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={props.state.index === index ? 'white' : 'black'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Exit Button */}
        {/* #27b099 */}
        <Text style={styles.appversion}>App Version {appVersion}</Text>
      </View>
    </ImageBackground>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Services"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route, navigation }) => ({
        header: () => (route.name !== 'Home' ? <CustomHeader navigation={navigation} /> : null),
        drawerActiveTintColor: '#fff',
        drawerActiveBackgroundColor: '#27b099',
        drawerInactiveTintColor: '#000',
        drawerStyle: {
          width: 300,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
      })}
    >
      <Drawer.Screen name="Services" component={Services} />
      <Drawer.Screen name="eScr" component={Escr} />
      <Drawer.Screen name="Live Streaming" component={LiveStreaming} />
      <Drawer.Screen name="E-Pay" component={EPayment} />
      <Drawer.Screen name="Online E-Court Fee" component={EcourtFee} />
      <Drawer.Screen name="NJDG" component={Njdg} />
      <Drawer.Screen name="Virtual Court" component={VirtualCourt} />
    </Drawer.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="CaseStatus" component={CaseStatus} options={{ headerShown: false }} />
      <Stack.Screen name="CaseNumber" component={CaseNumber} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
    <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  drawerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: hp('10%'),
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('3.5%'),
    marginBottom: hp('3%'),
  },
  welcomeText: {
    fontWeight: '600',
    fontSize: 30,
    marginRight: wp('2.5%'),
    color: 'gray'
  },
  welcomeIcon: {
    marginLeft: wp('1.5%'),
  },
  drawerItems: {
    flex: 1,
    paddingHorizontal: wp('3%'),
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  drawerItemActive: {
    backgroundColor: '#27b099',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  drawerItemTextActive: {
    color: '#fff',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: hp('3%'),
    marginLeft: wp('3.5%'),
    marginRight: wp('3.5%'),
    borderRadius: 5,
  },
  appversion: {
    paddingVertical: 1,
    paddingHorizontal: 20,
    marginBottom: hp('3%'),
    textAlign: 'start', // Centers the text
  },
  exitIcon: {
    marginRight: 10,
  },
  exitButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
