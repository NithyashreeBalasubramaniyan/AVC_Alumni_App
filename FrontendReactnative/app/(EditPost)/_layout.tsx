import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' ></Stack.Screen>
      <Stack.Screen name='edit' ></Stack.Screen>
    </Stack>
  )
}

export default _layout