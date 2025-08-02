import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const index = () => {
  return (
    <View style={{flex: 1, gap: 5, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={()=>router.push('/(EditPost)/edit')}><Text>edit</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>alert('deleted post')}><Text>delete</Text></TouchableOpacity>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})