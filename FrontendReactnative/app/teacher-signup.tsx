import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";

type FormField = 'fullName' | 'registerNumber' | 'dob' | 'email' | 'password';

export default function SignupScreen() {
  const fields: FormField[] = ['fullName', 'registerNumber', 'dob', 'email', 'password'];
  const [form, setForm] = useState<Record<FormField, string>>({
    fullName: "",
    registerNumber: "",
    dob: "",
    email: "",
    password: "",
  });

  const handleChange = (field: FormField, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/avc app logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>
            Alumni{"\n"}
            <Text style={styles.connectText}>Connect</Text>
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Image
            source={require("../assets/alumni.png")}
            style={styles.avatar}
          />
          <Text style={styles.heading}>Signup</Text>

          {fields.map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={
                field === "registerNumber"
                  ? "Enter teacher uid"
                  : field === "dob"
                  ? "Date of Birth(date/month/year)"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              placeholderTextColor="#999"
              secureTextEntry={field === "password"}
              value={form[field]}
              onChangeText={(text) => handleChange(field, text)}
            />
          ))}

          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Forget register number?{" "}
            <Link href="/contact">
              <Text style={styles.contactLink}>Contact us</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#004dab",
  },
  connectText: {
    color: "#007bff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  contactLink: {
    color: "#007bff",
    fontWeight: "600",
  },
});
