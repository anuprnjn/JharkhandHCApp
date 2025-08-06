import 'react-native-gesture-handler';
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Services from './screens/Services';
import LiveStreaming from './screens/LiveStreaming';
import EPayment from './screens/EPayment';
import EcourtFee from './screens/ECourtFee';
import VirtualCourt from './screens/VirtualCourt';
import Escr from './screens/Escr';
import Njdg from './screens/Njdg';
import CaseNumber from './screens/CaseStatus/CaseNumber';
import CaseFilling from './screens/CaseStatus/CaseFilling';
import CaseAdvocateName from './screens/CaseStatus/CaseAdvocateName';
import CaseStatus from './screens/CaseStatus/CaseStatus';
import Toast from 'react-native-toast-message';
import FloatingQuickMenu from './screens/Components/FloatingQuickMenu';
import About from './screens/About';

const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="E-Pay" component={EPayment} />
      <Stack.Screen name="Online E-Court Fee" component={EcourtFee} />
      <Stack.Screen name="Virtual Court" component={VirtualCourt} />
      <Stack.Screen name="eScr" component={Escr} />
      <Stack.Screen name="NJDG" component={Njdg} />
      <Stack.Screen name="Live Streaming" component={LiveStreaming} />
      <Stack.Screen name="CaseStatus" component={CaseStatus} />
      <Stack.Screen name="CaseNumber" component={CaseNumber} />
      <Stack.Screen name="CaseFilling" component={CaseFilling} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="CaseAdvocateName" component={CaseAdvocateName} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navigationRef = useRef();
  const [routeName, setRouteName] = useState();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setRouteName(navigationRef.current.getCurrentRoute().name);
      }}
      onStateChange={() => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        setRouteName(currentRouteName);
      }}
    >
      <MainStack />
      {routeName !== 'Home' && <FloatingQuickMenu />}
      <Toast />
    </NavigationContainer>
  );
}
