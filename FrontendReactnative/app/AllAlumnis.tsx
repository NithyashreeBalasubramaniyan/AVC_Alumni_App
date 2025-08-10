import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import axios from "axios";
import { BASE_URL } from "@/constant";
import { router } from "expo-router";

interface Alumni {
  id: number;
  name: string;
  Company: string;
  profile_image: string;
}

const MyComponent = () => {
  const [users, setUsers] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/alumni`);
        setUsers(res.data.data || []);
      } catch (error: any) {
        console.error("Error fetching alumni:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Alumni; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/ShowAlumni?id=${item.id}`)}
      >
        <Card style={styles.card}>
          <Card.Title
            title={item.name}
            subtitle={item.Company}
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{ uri: `${BASE_URL}${item.profile_image}` }}
                size={45}
              />
            )}
            right={(props) => (
              <IconButton {...props} icon="arrow-right" onPress={() => router.push(`/ShowAlumni?id=${item.id}`)} />
            )}
          />
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    elevation: 2,
  },
});
