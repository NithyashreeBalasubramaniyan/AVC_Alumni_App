import React, { useState, useEffect } from "react";
import { BASE_URL } from "@/constant";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Keyboard,
  Platform
} from "react-native";

import { Link, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker"; // ✅ NEW

type FormField = 'fullName' | 'registerNumber' | 'phonenumber' | 'email' | 'password';

export default function SignupScreen() {
  const router = useRouter();

  const fields: FormField[] = ['fullName', 'registerNumber', 'phonenumber', 'email', 'password'];
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [form, setForm] = useState<Record<FormField, string>>({
    fullName: "",
    registerNumber: "",
    email: "",
    phonenumber: "",
    password: "",
  });

  const [dob, setDob] = useState<Date | null>(null); // ✅ NEW
  const [showDatePicker, setShowDatePicker] = useState(false); // ✅ NEW

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = (field: FormField, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignup = async () => {
    try {
      if (!dob) {
        Alert.alert("Missing DOB", "Please select your Date of Birth.");
        return;
      }

      const formattedDOB = `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(2, '0')}-${String(dob.getDate()).padStart(2, '0')}`;
      
      console.log("Formatted DOB:", formattedDOB);
      const payload = {
        name: form.fullName,
        reg_no: form.registerNumber,
        ph_no: form.phonenumber,
        dob: formattedDOB,
        mail: form.email,
        password: form.password,
      };

      const response = await fetch(`${BASE_URL}/api/auth/register/teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/teacher-login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Failed to connect to server.");
      console.error("Signup error:", error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDob(selectedDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: isKeyboardOpen ? 500 : 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Logo */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/avc app logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>
            Alumni{"\n"}
            <Text style={styles.connectText}>Connect</Text>
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Image source={require("../assets/Teacher.png")} style={styles.avatar} />
          <Text style={styles.heading}>Signup</Text>

          {/* Render text inputs */}
          {fields.map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={
                field === "registerNumber"
                  ? "Enter register number"
                  : field === "phonenumber"
                  ? "Phone Number"
                  : field === "email"
                  ? "Email ID"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              placeholderTextColor="#999"
              secureTextEntry={field === "password"}
              value={form[field]}
              onChangeText={(text) => handleChange(field, text)}
              keyboardType={
                field === "email"
                  ? "email-address"
                  : field === "registerNumber"
                  ? "numeric"
                  : field === "phonenumber"
                  ? "phone-pad"
                  : "default"
              }
              autoCapitalize={"none"}
              autoCorrect={field === "email" || field === "password" ? false : true}
            />
          ))}

          {/* ✅ Date Picker Field */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dob ? "#000" : "#999" }}>
              {dob ? dob.toLocaleDateString() : "Date of Birth (Tap to select)"}
            </Text>
          </TouchableOpacity>

          {/* ✅ Calendar Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Signup</Text>
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
