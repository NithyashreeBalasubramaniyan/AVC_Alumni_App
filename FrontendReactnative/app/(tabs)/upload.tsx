import { StyleSheet, Text, View, Button } from 'react-native'
import { useRouter } from 'expo-router'

const upload = () => {

  const route = useRouter()

  return (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>upload</Text>
      <Button onPress={()=>route.replace('/main')} title='log out'></Button>
    </View>
  )
}

export default upload

const styles = StyleSheet.create({})