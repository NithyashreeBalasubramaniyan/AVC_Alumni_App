import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from "expo-router";


export default function tabsLayout() {
  return (
  <Tabs screenOptions={{tabBarActiveBackgroundColor: "#377AFF", tabBarActiveTintColor: "#fff"}}> 
    <Tabs.Screen name="home" options={{headerShown: false, title: "Home", tabBarIcon: ({color}) => <Entypo name="home" size={24} color={color} />}}></Tabs.Screen> 
    <Tabs.Screen name="upload"  options={{headerShown: false}} ></Tabs.Screen> 
    <Tabs.Screen name="profile"  options={{headerShown: false}} ></Tabs.Screen> 
    
  </Tabs>);
}
