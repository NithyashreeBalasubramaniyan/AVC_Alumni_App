import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import {
  BackHandler,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React, { useRef, useEffect, useState, JSX } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../constants/theme";


const Tab = createMaterialTopTabNavigator();
const Tabs = withLayoutContext(Tab.Navigator);

export default function TabsLayout(): JSX.Element {

  const backPressedOnce = useRef<boolean>(false);
  
  

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressedOnce.current) {
          BackHandler.exitApp();
          return true;
        }
        backPressedOnce.current = true;
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        setTimeout(() => (backPressedOnce.current = false), 2000);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [])
  );


  return (
    <Tabs
      initialRouteName="index"
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowIcon: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <Entypo name="home" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="event"
        options={{
          title: "Event",
          tabBarIcon: ({ color }: { color: string }) => (
            <Entypo name="sound" size={26} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="plus" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
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
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});