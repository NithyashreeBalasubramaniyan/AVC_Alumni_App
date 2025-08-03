import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity
} from "react-native";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { BASE_URL } from "@/constant";

// Define the response interface
interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
  message?: string;
}

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)

  // Animation values using react-native-reanimated
  const logoTranslateY = useSharedValue(-100);
  const logoOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(100);
  const cardOpacity = useSharedValue(0);

  // Animate components on mount
  useEffect(() => {
    logoTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    cardTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));
    cardOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));


  const handleLogin = async () => {
    if (!registerNumber || !password) {
      Alert.alert("Missing Information", "Please enter both register number and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/api/auth/login/student`,
        {
          reg_no: registerNumber,
          password: password,
        }
      );
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.data.token);
        Alert.alert("Login Successful", "Welcome back!");
        router.replace({ pathname: '/profile', params: { reg_no: registerNumber } });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Login error:', axiosError.response?.data);
      Alert.alert(
        "Login Failed",
        axiosError.response?.data?.message || "An unexpected server error occurred."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Use dynamically generated styles
  const styles = createStyles(width, height);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
    barStyle="dark-content" // or "light-content" depending on your background
    backgroundColor="#f5f5f5" // match your SafeArea background
  />
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image source={require("../assets/avc app logo.png")} style={styles.logo} />
            <Text style={styles.logoText}>
              Alumni <Text style={styles.connectText}>Connect</Text>
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            <Image source={require("../assets/student.png")} style={styles.avatar} />
            <Text style={styles.loginText}>Student Login</Text>
            
            <View style={styles.inputContainer}>
              <Feather name="user" size={width * 0.05} color="#999" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter register number"
                placeholderTextColor="#999"
                value={registerNumber}
                keyboardType="numeric"
                onChangeText={setRegisterNumber}
              />
            </View>
            {(registerNumber && registerNumber.length<12) && <Text style={{color: 'red', width: '80%', marginBottom: 10}}>register number has 12 digits</Text>}

            <View style={styles.inputContainer}>
              <Feather name="lock" size={width * 0.05} color="#999" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
                {showPassword && <Feather name="eye" size={width * 0.05} color="#999" style={styles.icon} />}
                {!showPassword && <Feather name="eye-off" size={width * 0.05} color="#999" style={styles.icon} />}   
              </TouchableOpacity>
            </View>

            <Pressable 
              style={({ pressed }) => [
                styles.signInButton, 
                pressed && styles.signInButtonPressed,
                loading && styles.signInButtonLoading
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </Pressable>

            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text onPress={() => router.replace("/Student-signup")} style={styles.signupLink}>
                Sign Up
              </Text>
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Function to create responsive styles
const createStyles = (width: number, height: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Original light grey background
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.12,
    height: width * 0.12,
    marginRight: 10,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: width * 0.07,
    fontWeight: "600",
    color: "#014CAB", // Changed back to dark blue for visibility
  },
  connectText: {
    fontWeight: "bold",
    color: "#007bff", // Changed back to original connect color
  },
  card: {
    backgroundColor: "#ffffff", // Solid white card
    borderRadius: 25,
    padding: width * 0.07,
    width: '100%',
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 20,
    resizeMode: "contain",
  },
  loginText: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#f0f2f5",
    borderRadius: 30,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: width * 0.04,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#007bff",
    borderRadius: 30,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  signInButtonPressed: {
    backgroundColor: "#0056b3",
  },
  signInButtonLoading: {
    backgroundColor: "#0056b3",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
    fontSize: width * 0.038,
    color: "#555",
  },
  signupLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});