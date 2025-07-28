import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";

type Role = "Student" | "Alumni" | "Teacher";

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const router = useRouter();

  const roles = [
    {
      name: "Student",
      image: require("../assets/student.png"),
    },
    {
      name: "Alumni",
      image: require("../assets/alumni.png"),
    },
    {
      name: "Teacher",
      image: require("../assets/Teacher.png"),
    },
  ];
  const handleChooseRole = () => {
  if (!selectedRole) {
    alert("Please select a role");
    return;
  }

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


  return (
<SafeAreaView style={styles.safeArea}>
  {/* Header at the top */}
  <View style={styles.header}>
    <Image source={require("../assets/avc app logo.png")} style={styles.logo} />
    <Text style={styles.titleText}>
      Alumni{"\n"}
      <Text style={styles.connecttext}>Connect</Text>
    </Text>
  </View>

  {/* Main Content Centered */}
  <View style={styles.mainContent}>
    <View style={styles.rolesContainer}>
      {roles.map((role) => (
        <TouchableOpacity
          key={role.name}
          style={[
            styles.roleCard,
            selectedRole === role.name && styles.selectedCard,
          ]}
          onPress={() => setSelectedRole(role.name as Role)}
        >
          <Image source={role.image} style={styles.roleImage} />
          <Text style={styles.roleText}>{role.name}</Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Choose Role Button */}
    <TouchableOpacity style={styles.chooseButton} onPress={handleChooseRole}>
      <Text style={styles.chooseButtonText}>ChooseRole</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>


  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  connecttext: {
    color: "#248bf4",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rolesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 30,
  },
  roleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 120,
    padding: 8,
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedCard: {
    borderColor: "#007bff",
    borderWidth: 2,
  },
  roleImage: {
    width: 45,
    height: 45,
    marginBottom: 5,
    resizeMode: "contain",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  chooseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  chooseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
