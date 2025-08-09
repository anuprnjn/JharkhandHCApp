import 'react-native-gesture-handler';
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import Home from './screens/Home';
import Services from './screens/Services';
import LiveStreaming from './screens/ExternalCallingPages/LiveStreaming';
import EPayment from './screens/ExternalCallingPages/EPayment';
import EcourtFee from './screens/ExternalCallingPages/ECourtFee';
import VirtualCourt from './screens/ExternalCallingPages/VirtualCourt';
import Escr from './screens/ExternalCallingPages/Escr';
import Njdg from './screens/ExternalCallingPages/Njdg';
import CaseNumber from './screens/CaseStatus/CaseNumber';
import CaseFilling from './screens/CaseStatus/CaseFilling';
import CaseStatus from './screens/CaseStatus/CaseStatus';
import AdvocateName from './screens/CaseStatus/AdvocateName';
import FloatingQuickMenu from './screens/Components/FloatingQuickMenu';
import About from './screens/About';
import { ThemeProvider } from './Context/ThemeContext';
import PDFViewer from './screens/Components/NapixComponents/PDFViewer';
import ADVCaseDetailsScreen from './screens/Components/NapixComponents/ADVCaseDetailsScreen';
import PartyName from './screens/ExternalCallingPages/PartyName';
import CauseList from './screens/CauseList/CauseList';
import OdersAndJudgementIndex from './screens/OrdersAndJudgement/OdersAndJudgementIndex';
import EFillings from './screens/ExternalCallingPages/EFillings';
import DisplayBoard from './screens/DisplayBoard/DisplayBoard';
import OrderByPartyName from './screens/ExternalCallingPages/OrderByPartyName';
import OrdersByJudgeName from './screens/ExternalCallingPages/OrdersByJudgeName';
import OrderByOrderDate from './screens/ExternalCallingPages/OrderByOrderDate';
import OrderCaseNumber from './screens/OrdersAndJudgement/OrderCaseNumber';
import OrderFillingNumber from './screens/OrdersAndJudgement/OrderFillingNumber';
import HighCourtDPBoard from './screens/ExternalCallingPages/HighCourtDPBoard';
import DistrictCourtDPBoard from './screens/DisplayBoard/DistrictCourtDPBoard';
import WebViewComponent from './screens/Components/WebViewComponent';
import CalendarPage from './screens/CalendarPage';

const Stack = createStackNavigator();

// Create navigationRef outside the component for global access
export const navigationRef = React.createRef();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="E-Pay" component={EPayment} />
      <Stack.Screen name="E-Fillings" component={EFillings} />
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
      <Stack.Screen name="CaseDetailsScreen" component={ADVCaseDetailsScreen} />
      <Stack.Screen name="PDFViewer" component={PDFViewer} />
      <Stack.Screen name="PartyName" component={PartyName} />
      <Stack.Screen name="CauseList" component={CauseList} />
      <Stack.Screen name="OdersAndJudgementIndex" component={OdersAndJudgementIndex} />
      <Stack.Screen name="DisplayBoard" component={DisplayBoard} />
      <Stack.Screen name="OrderByPartyName" component={OrderByPartyName} />
      <Stack.Screen name="OrdersByJudgeName" component={OrdersByJudgeName} />
      <Stack.Screen name="OrderByOrderDate" component={OrderByOrderDate} />
      <Stack.Screen name="OrderCaseNumber" component={OrderCaseNumber} />
      <Stack.Screen name="OrderFillingNumber" component={OrderFillingNumber} />
      <Stack.Screen name="HighCourtDPBoard" component={HighCourtDPBoard} />
      <Stack.Screen name="DistrictCourtDPBoard" component={DistrictCourtDPBoard} />
      <Stack.Screen name="WebViewComponent" component={WebViewComponent} />
      <Stack.Screen name="CalendarPage" component={CalendarPage} />
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