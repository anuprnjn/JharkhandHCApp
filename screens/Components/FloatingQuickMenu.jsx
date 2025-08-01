import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  Animated,
  PanResponder,
  Easing,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const FAB_SIZE = 60;
const FAB_MARGIN = 30;

const CORNERS = [
  { x: FAB_MARGIN, y: FAB_MARGIN },
  { x: width - FAB_SIZE - FAB_MARGIN, y: FAB_MARGIN },
  { x: FAB_MARGIN, y: height - FAB_SIZE - FAB_MARGIN - 20 },
  { x: width - FAB_SIZE - FAB_MARGIN, y: height - FAB_SIZE - FAB_MARGIN - 20 },
];

const MENU = [
  {
    label: 'Home',
    icon: 'home',
    iconType: 'FontAwesome',
    route: 'Services',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    label: 'eScr',
    icon: 'book-outline',
    iconType: 'Ionicons',
    route: 'eScr',
    gradient: ['#efc488', '#f88c68'],
  },
  {
    label: 'Virtual Court',
    icon: 'gavel',
    iconType: 'FontAwesome',
    route: 'Virtual Court',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    label: 'E-Pay',
    icon: 'credit-card',
    iconType: 'FontAwesome',
    route: 'E-Pay',
    gradient: ['#1de9b6', '#1dc8cd'],
  },
  {
    label: 'NJDG',
    icon: 'database',
    iconType: 'FontAwesome',
    route: 'NJDG',
    gradient: ['#38f9d7', '#43e97b'],
  },
  {
    label: 'Live Streaming',
    icon: 'videocam',
    iconType: 'Ionicons',
    route: 'Live Streaming',
    gradient: ['#e72e2eff', '#c93589ff'],
  },
  {
    label: 'About Jharkhand High Court',
    icon: 'information-circle-outline',
    iconType: 'Ionicons',
    route: 'About',
    gradient: ['#a7a7a7ff', '#000000ff'],
  },
  
];

// Updated FAB gradient: light purple to light peach
const FAB_GRADIENT = ["#8f8f8fff", "#2f2f2fff"];

function getGradientIcon(menuItem) {
  const Icon = menuItem.iconType === 'FontAwesome' ? FontAwesome : Ionicons;
  return (
    <LinearGradient
      colors={menuItem.gradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.iconGradientBg}
    >
      <Icon name={menuItem.icon} size={22} color="#fff" />
    </LinearGradient>
  );
}

export default function FloatingQuickMenu() {
  const navigation = useNavigation();
  const navState = useNavigationState(state => state);

  let currentRoute = '';
  if (navState && navState.routes && navState.index != null) {
    let route = navState.routes[navState.index];
    while (route && route.state && route.state.index != null) {
      route = route.state.routes[route.state.index];
    }
    currentRoute = route?.name || '';
  }

  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const pan = useRef(new Animated.ValueXY(CORNERS[3])).current;

  const snapToNearestCorner = (x, y) => {
    let minDist = Infinity;
    let nearestCorner = CORNERS[3];
    for (const corner of CORNERS) {
      const dist = Math.pow(x - corner.x, 2) + Math.pow(y - corner.y, 2);
      if (dist < minDist) {
        minDist = dist;
        nearestCorner = corner;
      }
    }
    Animated.spring(pan, {
      toValue: nearestCorner,
      useNativeDriver: false,
      bounciness: 7,
      speed: 15,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !open && (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2),
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        snapToNearestCorner(pan.x._value, pan.y._value);
      },
    })
  ).current;

  const animateIn = () => {
    slideAnim.setValue(height);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 13,
      bounciness: 8,
      easing: Easing.out(Easing.exp),
    }).start();
  };
  const animateOut = (callback) => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 210,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      if (callback) callback();
    });
  };

  // Haptic feedback before open
  const handleFABPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOpen(true);
    setTimeout(() => animateIn(), 16);
  };

  const handleClose = () => {
    animateOut(() => setOpen(false));
  };

  const handlePress = (route) => {
    animateOut(() => {
      setOpen(false);
      setTimeout(() => navigation.navigate(route), 140);
    });
  };

  return (
    <>
      <Modal
        visible={open}
        animationType="none"
        transparent
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.menuCard,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Quick Access</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ maxHeight: height * 0.48 }}
            contentContainerStyle={{ paddingBottom: 4 }}
            showsVerticalScrollIndicator={false}
          >
            {MENU.map(item => {
              const isActive = item.route === currentRoute;
              return (
                <TouchableOpacity
                  key={item.route}
                  style={styles.menuItem}
                  onPress={() => handlePress(item.route)}
                  activeOpacity={isActive ? 1 : 0.8}
                  disabled={isActive}
                >
                  {getGradientIcon(item)}
                  <Text
                    style={[
                      styles.itemText,
                      isActive && styles.activeText
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isActive ? "#4B3E2F" : "#aaa"}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Modal>
      {!open && (
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
              position: 'absolute',
            }
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={handleFABPress}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={FAB_GRADIENT}
              start={{ x: 0.15, y: 0.05 }}
              end={{ x: 0.85, y: 1 }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: FAB_SIZE / 2 }}
            >
              <Ionicons name="chevron-up-outline" size={30} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#fff',
    zIndex: 60,
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.23,
    shadowRadius: 5,
    elevation: 9,
    overflow: 'visible',
  },
  iconGradientBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  menuCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#fff',
    minHeight: 100,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 26 : 14,
    elevation: 10,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  menuTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#322d37',
  },
  closeBtn: {
    marginRight: 4,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f6f6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 17,
    marginLeft: 4,
    color: '#000000ff',
    fontWeight: '500',
  },
  activeText: {
    color: '#5a982eff',
    fontWeight: '700',
  },
});
