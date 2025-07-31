import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios, { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "@/constant";

const { width } = Dimensions.get("window");

interface Student {
  name: string;
  reg_no: string;
  job_role?: string | null;
  Company?: string | null;
  profile_image?: string | null;
  Linkedin_id?: string | null;
  Experience?: string | null;
  Gender?: string | null;
}

interface ProfileResponse {
  success: boolean;
  data: Student;
  message?: string;
}

interface Post {
  id: number;
  title: string;
  color: string;
}

const ProfileScreen = () => {
  const router = useRouter();
  const { reg_no } = useLocalSearchParams<{ reg_no?: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfileData = async (registrationNumber: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get<ProfileResponse>(
        `${BASE_URL}/api/user/profile/${registrationNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setStudent(response.data.data);
      } else {
        Alert.alert("Error", response.data.message || "Could not load profile data", [
          { text: "Retry", onPress: () => getProfileData(registrationNumber) },
          { text: "Cancel", style: "cancel" },
        ]);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Profile fetch error:', axiosError);
      Alert.alert(
        "Error",
        axiosError.response?.data?.message || "Failed to connect to server",
        [
          { text: "Retry", onPress: () => getProfileData(registrationNumber) },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRegNoAndProfile = async () => {
      let registrationNumber: string | null | undefined;
      if (!reg_no || reg_no === "undefined") {
        registrationNumber = await AsyncStorage.getItem('reg_no');
      } else {
        registrationNumber = reg_no;
      }
      if (registrationNumber) {
        getProfileData(registrationNumber);
      } else {
        Alert.alert("Error", "No registration number found");
        setLoading(false);
      }
    };
    fetchRegNoAndProfile();
  }, [reg_no]);

  const posts: Post[] = [
    { id: 1, title: "post 1", color: "#64A34D" },
    { id: 2, title: "post 2", color: "#693F3F" },
    { id: 3, title: "post 3", color: "#64A34D" },
    { id: 4, title: "post 4", color: "#64A34D" },
    { id: 5, title: "post 5", color: "#693F3F" },
    { id: 6, title: "post 6", color: "#693F3F" },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#297BE6" style={{ marginTop: 100 }} />
      </View>
    );
  }

  if (!student) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/avc app logo.png")}
          style={styles.logo}
          accessibilityLabel="Alumni Connect logo"
        />
        <Text style={styles.appTitle}>
          Alumni{"\n"}
          <Text style={styles.connectText}>Connect</Text>
        </Text>
      </View>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: student.profile_image ?? "https://via.placeholder.com/120" }}
          style={styles.profileImage}
          accessibilityLabel={`${student.name}'s profile picture`}
        />
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.regNo}>Reg No: {student.reg_no}</Text>
        <Text style={styles.detail}>
          {student.job_role ?? 'No role specified'} @ {student.Company ?? 'No company'}
        </Text>
        <Text style={styles.detail}>Gender: {student.Gender ?? 'Not specified'}</Text>
        <Text style={styles.detail}>LinkedIn: {student.Linkedin_id ?? 'Not provided'}</Text>
        <Text style={styles.detail}>Experience: {student.Experience ?? 'Not available'}</Text>
        <TouchableOpacity
          style={styles.enhanceButton}
          onPress={() => router.push({ pathname: "/profileupdate", params: { reg_no: reg_no ?? student.reg_no } })}
          accessibilityLabel="Enhance your profile"
        >
          <Text style={styles.enhanceButtonText}>Enhance Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={[styles.postBox, { backgroundColor: item.color }]}>
              <Text style={styles.postText}>{item.title}</Text>
            </View>
          )}
          contentContainerStyle={styles.postGrid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  appTitle: { fontSize: 18, fontWeight: "bold", color: "#014CAB" },
  connectText: { color: "#007bff" },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: "bold", color: "#333" },
  regNo: { fontSize: 16, color: "#666", marginBottom: 5 },
  detail: { fontSize: 16, color: "#666", marginBottom: 5 },
  enhanceButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#007bff",
  },
  enhanceButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  postsSection: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10, paddingHorizontal: 10 },
  postGrid: { paddingHorizontal: 5 },
  postBox: {
    width: (width - 40) / 3,
    height: 100,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  postText: { color: "#fff", fontWeight: "bold" },
});

export default ProfileScreen;