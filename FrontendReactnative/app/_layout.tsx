import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="main"></Stack.Screen>
      <Stack.Screen name="(tabs)"></Stack.Screen>
      <Stack.Screen name="profileupdate" options={{headerShown: true, title: "Profile Update"}}></Stack.Screen>
      
    </Stack>
  );

}
