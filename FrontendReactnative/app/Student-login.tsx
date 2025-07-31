import React, { useState } from "react";
import { BASE_URL } from "@/constant";
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";




export default function SignInScreen() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 

const handleLogin = async () => {
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login/student`, {
      reg_no: registerNumber,
      password: password,
    });
      console.log()
      if (response.data.success) {
        AsyncStorage.setItem('token', response.data.data.token).catch(e => console.log(e.message))
        Alert.alert("Login Successful", "Welcome!");
        router.replace('/');
        Alert.alert("Happy login", response.data.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error?.response?.data?.message || "Server error");
    }
  } 

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/avc app logo.png")} style={styles.logo} />
        <Text style={styles.logoText}>
          Alumni{"\n"}
          <Text style={styles.connectText}>Connect</Text>
        </Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Image
          source={require("../assets/student.png")}
          style={styles.avatar}
        />
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter register number"
          placeholderTextColor="#999"
          value={registerNumber}
          keyboardType="numeric"
          onChangeText={setRegisterNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword }
        />

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text onPress={() => router.replace("/Student-signup")} style={styles.signupLink}>
            Signup
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 8,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#014CAB",
  },
  connectText: {
    color: "#007bff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    marginTop: 50,
    width: "100%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  loginText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    color: "#007bff",
    fontWeight: "600",
  },
});
