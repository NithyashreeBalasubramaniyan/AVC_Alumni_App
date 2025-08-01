import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
  Alert
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from "@/constant"; // Replace with your actual backend URL

const { height: screenHeight } = Dimensions.get("window");

export default function UpdateProfile() {
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const linkedinRef = useRef<TextInput>(null);
  const companyRef = useRef<TextInput>(null);
  const roleRef = useRef<TextInput>(null);
  const techRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null); // Ref for Bio

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    company: "",
    jobRole: "",
    experience: "",
    technologies: "",
    batch: "",
    gender: "",
    id: "",
    role: "",
    bio: "", // Added bio
    profileImage: null, // To store image URI
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange("profileImage", result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.id || !formData.role) {
      console.error("Cannot update profile: User ID or Role is missing.", formData);
      Alert.alert(
        "Error",
        "Could not update profile because essential user information is missing. Please try logging out and logging back in."
      );
      return;
    }

    // Use FormData for multipart request (if image is being uploaded)
    const payload = new FormData();
    payload.append('id', formData.id);
    payload.append('role', formData.role);
    payload.append('Linkedin_id', formData.linkedin);
    payload.append('Experience', formData.experience);
    payload.append('Gender', formData.gender);
    payload.append('Company', formData.company);
    payload.append('job_role', formData.jobRole);
    payload.append('Bio', formData.bio); // Append bio

    // Append image if it has been changed
    if (formData.profileImage && formData.profileImage.startsWith('file://')) {
        const uriParts = formData.profileImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
        payload.append('profile_image', {
            uri: formData.profileImage,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });
    }


    console.log("Sending this payload to backend:", payload);

    try {
        const response = await axios.patch(`${BASE_URL}/api/user/update-profile`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("Update successful:", response.data);
        Alert.alert("Success", "Your profile has been updated successfully!");
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        console.error("Error updating profile:", error.response?.data || error.message);
        Alert.alert("Update Failed", errorMessage);
    }
  };

  React.useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          console.warn('⚠️ No token found in AsyncStorage. User might not be logged in.');
          return;
        }

        const response = await axios.post(`${BASE_URL}/api/user/profile`, { token: storedToken });

        if (response.data.success) {
          const data = response.data.data;
          console.log("Fetched profile data:", data);

          setFormData({
            name: data.name || "",
            email: data.mail || "",
            linkedin: data.Linkedin_id || "",
            company: data.Company || "",
            jobRole: data.role === 'student' ? "Student" : data.job_role || "",
            experience: data.Experience || "",
            gender: data.Gender || "",
            id: data.id,
            role: data.role,
            bio: data.Bio || "",
            profileImage: data.profile_image ? `${BASE_URL}${data.profile_image}` : null,
            technologies: "",
            batch: "",
          });
          console.log('✅ Profile data loaded into form');
        } else {
            console.error('Profile fetch failed:', response.data.message);
            Alert.alert("Error", "Failed to load your profile data. Please try again later.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('❌ Axios error fetching profile:', error.response?.data || error.message);
        } else {
          console.error('❌ Unknown error fetching profile:', error);
        }
        Alert.alert("Error", "An error occurred while fetching your profile.");
      }
    };

    loadProfileData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: formData.profileImage || 'https://placehold.co/100x100/387bff/FFFFFF?text=User' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
           <TouchableOpacity onPress={pickImage}>
              <Text style={styles.uploadText}>Upload Picture</Text>
            </TouchableOpacity>

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
            editable={false}
          />
          <TextInput
            ref={linkedinRef}
            placeholder="LinkedIn Profile URL"
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
            onSubmitEditing={() => bioRef.current?.focus()}
            editable={formData.role !== 'student'}
          />

          <TextInput
            ref={bioRef}
            placeholder="Bio"
            value={formData.bio}
            onChangeText={(text) => handleChange("bio", text)}
            style={[styles.input, styles.bioInput]}
            multiline
            returnKeyType="next"
            onSubmitEditing={() => techRef.current?.focus()}
          />

          <Text style={styles.label}>Experience</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => handleChange("experience", value)}
              value={formData.experience}
              placeholder={{ label: "Select Experience", value: null }}
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
            placeholder="Technologies Used (e.g., React, Node.js)"
            value={formData.technologies}
            onChangeText={(text) => handleChange("technologies", text)}
            style={styles.input}
            returnKeyType="done"
          />

          <Text style={styles.label}>Batch</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => handleChange("batch", value)}
              value={formData.batch}
              placeholder={{ label: "Select Batch", value: null }}
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

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => handleChange("gender", value)}
              value={formData.gender}
              placeholder={{ label: "Select Gender", value: null }}
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
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  uploadText: {
    color: '#387bff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: '#333',
  },
  bioInput: {
    height: 100, // Taller for multiline
    textAlignVertical: 'top', // Align text to the top
    paddingTop: 12,
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
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "white",
    justifyContent: "center",
    height: 48,
  },
  icon: {
    fontSize: 16,
    color: "#666",
    position: "absolute",
    right: 12,
    top: 14,
  },
  button: {
    backgroundColor: "#387bff",
    paddingVertical: 14,
    borderRadius: 8,
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
    paddingHorizontal: 12,
    color: "#333",
    fontSize: 16,
  },
  inputAndroid: {
    height: 48,
    paddingHorizontal: 12,
    color: "#333",
    fontSize: 16,
  },
  placeholder: {
    color: '#9EA0A4',
    fontSize: 16,
  },
  iconContainer: {
    top: 14,
    right: 12,
  },
});
