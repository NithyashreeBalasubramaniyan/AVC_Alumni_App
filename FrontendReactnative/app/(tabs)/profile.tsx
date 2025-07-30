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
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "@/constant";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const router = useRouter();
  const { reg_no } = useLocalSearchParams(); // passed from login

  const [student, setStudent] = useState<any>(null);

  const getProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/profile/${reg_no}`);
      if (response.data.success) {
        setStudent(response.data.data);
      } else {
        Alert.alert("Error", "Could not load profile data");
      }
    } catch (error: any) {
      Alert.alert("Server Error", error.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const posts = [
    { id: 1, title: "post 1", color: "#64A34D" },
    { id: 2, title: "post 2", color: "#693F3F" },
    { id: 3, title: "post 3", color: "#64A34D" },
    { id: 4, title: "post 4", color: "#64A34D" },
    { id: 5, title: "post 5", color: "#693F3F" },
    { id: 6, title: "post 6", color: "#693F3F" },
  ];

  if (!student) return <Text style={{ textAlign: "center", marginTop: 100 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/avc app logo.png")}
          style={styles.logo}
        />
        <Text style={styles.appTitle}>Alumni{"\n"}<Text style={styles.connectText}>Connect</Text></Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: student.profile_image || "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.role}>{student.job_role} @ {student.Company}</Text>
        <TouchableOpacity
          style={styles.enhanceButton}
          onPress={() => router.push({ pathname: "/profileupdate", params: { reg_no } })}
        >
          <Text style={styles.enhanceButtonText}>Enhance profile</Text>
        </TouchableOpacity>
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  appTitle: { fontSize: 18, fontWeight: "bold" },
  connectText: { color: "#297BE6" },

  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  role: { fontSize: 14, color: "#666" },
  enhanceButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: "#297BE6",
    borderWidth: 1,
  },
  enhanceButtonText: { color: "#297BE6", fontWeight: "bold" },

  postGrid: { paddingHorizontal: 10 },
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
