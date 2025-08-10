import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import axios, { AxiosError } from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInUp,
} from "react-native-reanimated";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL } from "./constant";

const { width } = Dimensions.get("window");

const AlumniProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const profileCardAnimation = useSharedValue(0);


  const profileCardStyle = useAnimatedStyle(() => {
    return {
      opacity: profileCardAnimation.value,
      transform: [{ translateY: withTiming(60 * (1 - profileCardAnimation.value)) }],
    };
  });

  const getProfileData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/alumni-profile/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        const person = data
        if (!person) throw new Error("Profile data is null");
        person.Bio = person.Bio || "No bio yet";
        setProfileData(person);
        profileCardAnimation.value = withTiming(1, { duration: 800 });
      } else {
        Alert.alert("Error", response.data.message || "Could not load profile data");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Profile fetch error:", axiosError);
      Alert.alert("Error", axiosError.response?.data?.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProfileData().finally(() => setRefreshing(false));
  }, [getProfileData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.centered}>
        <Text>Could not load profile. Pull down to try again.</Text>
      </View>
    );
  }

  const fullProfileImageUrl = profileData.profile_image?.startsWith("/")
    ? `${BASE_URL}${profileData.profile_image}`
    : profileData.profile_image;

  const renderProfileHeader = () => (
    <Animated.View style={[styles.profileCard, profileCardStyle]}>
      <Image
        source={{ uri: fullProfileImageUrl || "https://via.placeholder.com/150" }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{profileData.name}</Text>
      <Text style={styles.regNo}>@{profileData.reg_no}</Text>
      <Text style={styles.bio}>{profileData.Bio}</Text>
    </Animated.View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <Pressable
        style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
        onPress={() => setActiveTab('posts')}
      >
        <MaterialCommunityIcons
          name="grid"
          size={24}
          color={activeTab === 'posts' ? "#007bff" : "#666"}
        />
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'about' && styles.activeTab]}
        onPress={() => setActiveTab('about')}
      >
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color={activeTab === 'about' ? "#007bff" : "#666"}
        />
      </Pressable>
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
        <FlatList
          data={profileData.Post || []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.postBox}>
              {item.image ? (
                <Image source={{ uri: `${BASE_URL}${item.image}` }} style={styles.postImage} />
              ) : (
                <View style={styles.captionPostBox}>
                  <MaterialCommunityIcons
                    name="format-quote-close"
                    size={24}
                    color="#A9A9A9"
                    style={styles.captionIcon}
                  />
                  <Text style={styles.captionText} numberOfLines={4}>
                    {item.caption}
                  </Text>
                </View>
              )}
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.postGrid}
        />
      );
    }
    return (
      <Animated.View style={styles.aboutContainer} entering={FadeInUp.duration(500)}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="briefcase-outline" size={24} color="#333" />
          <Text style={styles.detailText}>
            {profileData.job_role || 'No role specified'} @ {profileData.Company || 'No company'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="linkedin-square" size={24} color="#0077b5" />
          <Text style={styles.detailText}>{profileData.Linkedin_id || 'Not provided'}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="gender-male-female" size={24} color="#333" />
          <Text style={styles.detailText}>{profileData.Gender || 'Not specified'}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {renderProfileHeader()}
      {renderTabBar()}
      {renderContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 16,
    marginBottom: 16,
    elevation: 2,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  regNo: {
    fontSize: 16,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  postGrid: {
    padding: 2,
  },
  postBox: {
    width: (width - 8) / 3,
    height: (width - 8) / 3,
    margin: 1,
    backgroundColor: '#e0e0e0',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  captionPostBox: {
    flex: 1,
    backgroundColor: '#E9E9E9',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionIcon: {
    marginBottom: 4,
  },
  captionText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  aboutContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
});

export default AlumniProfileScreen;
