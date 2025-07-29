import { Tabs } from "expo-router";
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { View, BackHandler, ToastAndroid } from 'react-native';
import { useEffect, useRef } from 'react';

export default function TabsLayout() {
  const backPressedOnce = useRef(false);

  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce.current) {
        BackHandler.exitApp(); // Exit app
        return true;
      }

      backPressedOnce.current = true;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

      // Reset after 2 seconds
      setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);

      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Cleanup
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#377AFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#80aaffff',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
