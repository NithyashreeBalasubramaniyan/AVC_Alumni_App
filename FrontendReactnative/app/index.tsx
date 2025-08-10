import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Alert, // Use Alert instead of the custom notification for a native experience
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
// Assuming BASE_URL is defined elsewhere, like in a constants file
import { BASE_URL } from "./constant";

type Role = "Student" | "Alumni" | "Teacher";

export default function App() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const router = useRouter();

  // Animated values for the header and role cards
  const headerAnim = useState(new Animated.Value(0))[0];
  const rolesAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Animate the header and roles on component mount
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.timing(rolesAnim, {
      toValue: 1,
      duration: 700,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // The original code had an axios call; we'll keep it here for reference
    axios.get(`${BASE_URL}/health`).then(res => console.log(res.data)).catch(err => console.error(err.message));
  }, []);

  const roles = [
    {
      name: "Student",
      // Using the correct `require` syntax for React Native local assets
      image: require("../assets/student-removebg-preview.png"),
      bgColor: "#e0f2fe", // Corresponds to bg-blue-100
      textColor: "#1e40af", // Corresponds to text-blue-800
    },
    {
      name: "Alumni",
      image: require("../assets/alumni-removebg-preview.png"),
      bgColor: "#e0f7fa", // Corresponds to bg-sky-100
      textColor: "#083344", // Corresponds to text-sky-800
    },
    {
      name: "Teacher",
      image: require("../assets/Teacher-removebg-preview.png"),
      bgColor: "#eef2ff", // Corresponds to bg-indigo-100
      textColor: "#3730a3", // Corresponds to text-indigo-800
    },
  ];

  // Function to handle the navigation
  const handleChooseRole = () => {
    if (!selectedRole) {
      // Using native Alert for a better mobile user experience
      Alert.alert("Selection Required", "Please select a role before proceeding.");
      return;
    }

    // Navigation logic as in the original code
    switch (selectedRole) {
      case "Student":
        router.push("/Student-login");
        break;
      case "Alumni":
        router.push("/alumni-login");
        break;
      case "Teacher":
        router.push("/teacher-login");
        break;
    }
  };

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
  });

  const rolesTranslateY = rolesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        <Image
          source={require("../assets/avc app logo.png")}
          style={styles.logo}
        />
        <Text style={styles.titleText}>
          Alumni{"\n"}
          <Text style={styles.connectText}>Connect</Text>
        </Text>
      </Animated.View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <Animated.View style={[styles.contentContainer, { transform: [{ translateY: rolesTranslateY }] }]}>
          <Text style={styles.instructionText}>Choose your role to get started</Text>

          {/* Roles Container with responsive layout */}
          <View style={styles.rolesContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.name}
                activeOpacity={0.7}
                onPress={() => setSelectedRole(role.name as Role)}
                style={[
                  styles.roleCard,
                  { backgroundColor: role.bgColor },
                  selectedRole === role.name && styles.selectedCard,
                ]}
              >
                <Image source={role.image} style={styles.roleImage} />
                <Text style={[styles.roleText, { color: role.textColor }]}>
                  {role.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Choose Role Button */}
          <TouchableOpacity style={styles.chooseButton} onPress={handleChooseRole}>
            <Text style={styles.chooseButtonText}>Choose Role</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#004dab",
  },
  connectText: {
    color: "#248bf4",
    fontWeight: "800",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 600,
  },
  instructionText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 30,
  },
  rolesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 30,
  },
  roleCard: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.28, // Responsive width
    maxWidth: 160,
    height: 120,
    padding: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  selectedCard: {
    borderColor: "#007bff",
    borderWidth: 4,
  },
  roleImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  roleText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  chooseButton: {
    alignSelf: "center",
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  chooseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

