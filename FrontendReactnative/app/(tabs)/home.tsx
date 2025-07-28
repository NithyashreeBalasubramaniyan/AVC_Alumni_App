import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Home() {


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
      <Text>Home page.</Text>
      <Link href='./profile'>go to profile</Link>

    </View>
  );
}
