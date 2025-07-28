import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { StatusBar } from 'react-native';

export default function index() {


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
      <Text>Home page...</Text>
      <Link href='./profile'>go to profile</Link>
      <StatusBar barStyle={'dark-content'}></StatusBar>
    </View>
  );
}
