import { Tabs } from "expo-router";
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { BackHandler, ToastAndroid, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { COLORS } from '../constants/theme';

export default function TabsLayout() {
  const backPressedOnce = useRef(false);

  // "Press back again to exit" functionality for Android
  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce.current) {
        BackHandler.exitApp();
        return true;
      }

      backPressedOnce.current = true;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

      setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);

      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          // The icon now uses the 'color' prop like the other tabs
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus" size={26} color={color} />
          ),
          // The custom tabBarButton has been removed
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 70,
    borderTopWidth: 0,
    paddingBottom: 5, // Added some padding for better alignment
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});