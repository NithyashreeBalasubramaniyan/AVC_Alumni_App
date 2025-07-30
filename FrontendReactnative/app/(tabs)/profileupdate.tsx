import React, { useRef } from "react";
import {
  View,
  Text, // Ensure Text is imported
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
  StatusBar
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get("window");

export default function UpdateProfile() {
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const linkedinRef = useRef<TextInput>(null);
  const companyRef = useRef<TextInput>(null);
  const roleRef = useRef<TextInput>(null);
  const techRef = useRef<TextInput>(null);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    linkedin: "",
    company: "",
    jobRole: "",
    experience: "",
    technologies: "",
    batch: "",
    gender: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    // Handle submit (e.g., send data to an API)
    alert("Profile Updated!"); // Simple alert for demonstration
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Image
            source={require("./alumni.png")}
            style={styles.avatar}
          />

          <TextInput
            ref={nameRef}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <TextInput
            ref={emailRef}
            placeholder="Email ID"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => linkedinRef.current?.focus()}
          />
          <TextInput
            ref={linkedinRef}
            placeholder="LinkedIn ID"
            value={formData.linkedin}
            onChangeText={(text) => handleChange("linkedin", text)}
            style={styles.input}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => companyRef.current?.focus()}
          />
          <TextInput
            ref={companyRef}
            placeholder="Company"
            value={formData.company}
            onChangeText={(text) => handleChange("company", text)}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => roleRef.current?.focus()}
          />
          <TextInput
            ref={roleRef}
            placeholder="Job Role"
            value={formData.jobRole}
            onChangeText={(text) => handleChange("jobRole", text)}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => techRef.current?.focus()}
          />

          {/* Experience Dropdown */}
          <Text style={styles.label}>Experience</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(v) => handleChange("experience", v)}
              placeholder={{ label: "Select Experience", value: null, color: '#9EA0A4' }}
              items={[
                { label: "Fresher", value: "Fresher" },
                { label: "1 year", value: "1 year" },
                { label: "2 years", value: "2 years" },
                { label: "3+ years", value: "3+ years" },
              ]}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Text style={styles.icon}>▼</Text>}
            />
          </View>

          <TextInput
            ref={techRef}
            placeholder="Technologies Used"
            value={formData.technologies}
            onChangeText={(text) => handleChange("technologies", text)}
            style={styles.input}
            returnKeyType="done"
          />

          {/* Batch Dropdown */}
          <Text style={styles.label}>Batch</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(v) => handleChange("batch", v)}
              placeholder={{ label: "Select Batch", value: null, color: '#9EA0A4' }}
              items={[
                { label: "2024", value: "2024" },
                { label: "2025", value: "2025" },
                { label: "2026", value: "2026" },
                { label: "2027", value: "2027" },
              ]}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Text style={styles.icon}>▼</Text>}
            />
          </View>

          {/* Gender Dropdown */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(v) => handleChange("gender", v)}
              placeholder={{ label: "Select Gender", value: null, color: '#9EA0A4' }}
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Text style={styles.icon}>▼</Text>}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80,
    alignItems: "center",
    flexGrow: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: '#333',
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  pickerWrapper: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: "white",
    paddingHorizontal: 8,
    justifyContent: "center",
    height: 48,
  },
  icon: {
    fontSize: 16,
    color: "#666",
    position: "absolute",
    right: 10,
    top: 15,
  },
  button: {
    backgroundColor: "#387bff",
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    height: 48,
    paddingHorizontal: 8,
    color: "#333",
    fontSize: 16,
    paddingVertical: 10,
  },
  inputAndroid: {
    height: 48,
    paddingHorizontal: 8,
    color: "#333",
    fontSize: 16,
    paddingVertical: 10,
  },
  placeholder: {
    color: '#9EA0A4',
    fontSize: 16,
  },
});