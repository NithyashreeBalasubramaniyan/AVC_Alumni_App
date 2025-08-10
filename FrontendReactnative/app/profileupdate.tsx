import React, { useRef, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
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
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../constants/constant";
import { Divider, SegmentedButtons } from "react-native-paper";

const { height: screenHeight } = Dimensions.get("window");

// Define the form data type
type FormDataType = {
  name: string;
  email: string;
  linkedin: string;
  company: string;
  jobRole: string;
  experience: string | null;
  technologies: string;
  batch: string | null;
  gender: string | null;
  id: string;
  role: string;
  bio: string;
  profileImage: string | null;
};

export default function UpdateProfile() {
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const linkedinRef = useRef<TextInput>(null);
  const companyRef = useRef<TextInput>(null);
  const roleRef = useRef<TextInput>(null);
  const techRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    linkedin: "",
    company: "",
    jobRole: "",
    experience: null,
    technologies: "",
    batch: null,
    gender: null,
    id: "",
    role: "",
    bio: "",
    profileImage: null,
  });

  const handleChange = (field: keyof FormDataType, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], // Use an array with the string 'images'
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
      console.error(
        "Cannot update profile: User ID or Role is missing.",
        formData
      );
      Alert.alert(
        "Error",
        "Could not update profile because essential user information is missing. Please try logging out and logging back in."
      );
      return;
    }

    const payload = new FormData();
    payload.append("id", formData.id);
    payload.append("role", formData.role);
    payload.append("Linkedin_id", formData.linkedin);
    payload.append("Experience", formData.experience || "");
    payload.append("Gender", formData.gender || "");
    payload.append("Company", formData.company);
    payload.append("job_role", formData.jobRole);
    payload.append("Bio", formData.bio);

    if (formData.profileImage && formData.profileImage.startsWith("file://")) {
      const uriParts = formData.profileImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      payload.append("profile_image", {
        uri: formData.profileImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any); // 'as any' to satisfy TS for FormData append
    }

    console.log("Sending this payload to backend:", payload);

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/user/update-profile`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Update successful:", response.data);
      Alert.alert("Success", "Your profile has been updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      Alert.alert("Update Failed", errorMessage);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          console.warn(
            "⚠️ No token found in AsyncStorage. User might not be logged in."
          );
          return;
        }

        const response = await axios.post(`${BASE_URL}/api/user/profile`, {
          token: storedToken,
        });

        if (response.data.success) {
          const data = response.data.data;
          console.log("Fetched profile data:", data);

          setFormData({
            name: data.name || "",
            email: data.mail || "",
            linkedin: data.Linkedin_id || "",
            company: data.Company || "",
            jobRole: data.role === "student" ? "Student" : data.job_role || "",
            experience: data.Experience || null,
            gender: data.Gender || null,
            id: data.id,
            role: data.role,
            bio: data.Bio || "",
            profileImage: data.profile_image
              ? `${BASE_URL}${data.profile_image}`
              : null,
            technologies: "",
            batch: null,
          });
          console.log("✅ Profile data loaded into form");
        } else {
          console.error("Profile fetch failed:", response.data.message);
          Alert.alert(
            "Error",
            "Failed to load your profile data. Please try again later."
          );
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(
            "❌ Axios error fetching profile:",
            error.response?.data || error.message
          );
        } else {
          console.error("❌ Unknown error fetching profile:", error);
        }
        Alert.alert("Error", "An error occurred while fetching your profile.");
      }
    };

    loadProfileData();
  }, []);

  const experienceButtons = ["Fresher", "1 year", "2 years", "3+ years"].map(
    (val) => ({
      value: val,
      label: val,
      style:
        formData.experience === val ? { backgroundColor: "#d1e1ffff" } : undefined,
    })
  );

  const genderButtons = ["Male", "Female"].map((val) => ({
    value: val,
    label: val,
    style:
      formData.gender === val ? { backgroundColor: "#d1e1ffff" } : undefined,
  }));

  const batchItems = [];
for (let startYear = 2010; startYear <= 2028; startYear++) {
  const endYear = startYear + 4;
  const label = `${startYear}-${endYear}`;
  batchItems.push({ label, value: label });
}

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
              source={{
                uri:
                  formData.profileImage ||
                  "https://placehold.co/100x100/387bff/FFFFFF?text=User",
              }}
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
            editable={formData.role !== "student"}
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
          <SegmentedButtons
            style={{ marginBottom: 12 }}
            value={formData.experience || "null"}
            onValueChange={(value) => handleChange("experience", value)}
            buttons={experienceButtons}
          />

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
              items={batchItems}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Text style={styles.icon}>▼</Text>}
            />
          </View>

          <Text style={styles.label}>Gender</Text>
          <SegmentedButtons
            value={formData.gender || "null"}
            onValueChange={(value) => handleChange("gender", value)}
            buttons={genderButtons}
          />

          <Divider></Divider>

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
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  uploadText: {
    color: "#387bff",
    marginBottom: 20,
    fontWeight: "bold",
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
    color: "#333",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  pickerWrapper: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "white",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
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
    marginTop: 40,
    zIndex: 99,
    width: "100%",
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
    color: "#9EA0A4",
    fontSize: 16,
  },
  iconContainer: {
    top: 14,
    right: 12,
  },
});