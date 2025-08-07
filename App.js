import 'react-native-gesture-handler';
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

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
import CaseStatus from './screens/CaseStatus/CaseStatus';
import AdvocateName from './screens/CaseStatus/AdvocateName';
import FloatingQuickMenu from './screens/Components/FloatingQuickMenu';
import About from './screens/About';
import ThemeSettings from './screens/ThemeSettings';
import { ThemeProvider } from './Context/ThemeContext';
import PDFViewer from './screens/Components/NapixComponents/PDFViewer';
import CaseDetailsScreen from './screens/Components/NapixComponents/CaseDetailsScreen';

const Stack = createStackNavigator();

// Create navigationRef outside the component for global access
export const navigationRef = React.createRef();

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
      <Stack.Screen name="AdvocateName" component={AdvocateName} />
      <Stack.Screen name="CaseDetailsScreen" component={CaseDetailsScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
      <Stack.Screen name="PDFViewer" component={PDFViewer} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [routeName, setRouteName] = useState();

  return (
    <ThemeProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          const currentRoute = navigationRef.current?.getCurrentRoute();
          if (currentRoute?.name) {
            setRouteName(currentRoute.name);
          }
        }}
        onStateChange={() => {
          const currentRoute = navigationRef.current?.getCurrentRoute();
          if (currentRoute?.name) {
            setRouteName(currentRoute.name);
          }
        }}
      >
        <MainStack />
        {routeName !== 'Home' && <FloatingQuickMenu />}
        <Toast />
      </NavigationContainer>
    </ThemeProvider>
  );
}