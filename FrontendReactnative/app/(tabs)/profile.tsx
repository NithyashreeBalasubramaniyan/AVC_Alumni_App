import React, { useEffect, useState, useCallback } from "react";
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
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import axios, { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, FadeInUp } from 'react-native-reanimated';

import { BASE_URL } from "@/constant";

const { width } = Dimensions.get("window");

// --- Interfaces ---
interface Post {
  id: number;
  caption: string | null;
  image: string | null;
}

interface Student {
  name: string;
  reg_no: string;
  Bio?: string;
  job_role?: string | null;
  Company?: string | null;
  profile_image?: string | null;
  cover_photo?: string | null;
  Linkedin_id?: string | null;
  Experience?: string | null;
  Gender?: string | null;
  Post: Post[]; // Posts are now part of the student data
}




interface ProfileResponse {
  success: boolean;
  data: Student;
  message?: string;
}



const AnimatedPostItem = ({ item, index }: { item: Post, index: number }) => {
  const style = useAnimatedStyle(() => {
    return {
      opacity: withDelay(index * 100, withTiming(1)),
      transform: [{ scale: withDelay(index * 100, withTiming(1)) }],
    };
  });

  // Conditionally render based on whether a post image exists
  return (
    <Animated.View style={[styles.postBox, { transform: [{ scale: 0 }] }, style]}>
      {item.image ? (
        // If image exists, show it
        <Image
          source={{ uri: `${BASE_URL}${item.image}` }}
          style={styles.postImage}
        />
      ) : (
        // If no image, show caption in a styled view
        <View style={styles.captionPostBox}>
            <MaterialCommunityIcons name="format-quote-close" size={24} color="#A9A9A9" style={styles.captionIcon} />
            <Text style={styles.captionText} numberOfLines={4}>
                {item.caption}
            </Text>
        </View>
      )}
    </Animated.View>
  );
};


const ProfileScreen = () => {
  const router = useRouter();
  const { reg_no } = useLocalSearchParams<{ reg_no?: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const [refreshing, setRefreshing] = useState(false);

  const profileCardAnimation = useSharedValue(0);

  const profileCardStyle = useAnimatedStyle(() => {
    return {
      opacity: profileCardAnimation.value,
      transform: [{ translateY: withTiming(60 * (1 - profileCardAnimation.value)) }],
    };
  });
  
  const getProfileData = useCallback(async (registrationNumber: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post<ProfileResponse>(
        `${BASE_URL}/api/user/profile/`,
        { token, reg_no: registrationNumber }
      );

      if (response.data.success) {
        const fetchedStudent = response.data.data;
        AsyncStorage.setItem("userData", JSON.stringify({ name: fetchedStudent.name, profile_image: fetchedStudent.profile_image, job_role: fetchedStudent.job_role }) ).catch(e => console.log(e.message))
        fetchedStudent.Bio = fetchedStudent.Bio || "Passionate Full-Stack Developer | Lifelong Learner | Tech Enthusiast creating solutions for a better tomorrow.";
        setStudent(fetchedStudent);
        profileCardAnimation.value = withTiming(1, { duration: 800 });
      } else {
        Alert.alert("Error", response.data.message || "Could not load profile data");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Profile fetch error:', axiosError);
      Alert.alert("Error", axiosError.response?.data?.message || "Failed to connect to the server.");
    } finally {
        setLoading(false);
    }
  }, [profileCardAnimation]);

  useEffect(() => {
    const fetchRegNoAndProfile = async () => {
      setLoading(true);
      let registrationNumber: string | undefined | null;
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
  }, [reg_no, getProfileData]);

  const onRefresh = useCallback(() => {
    if (student?.reg_no) {
      setRefreshing(true);
      getProfileData(student.reg_no).finally(() => setRefreshing(false));
    }
  }, [student, getProfileData]);
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.centered}>
        <Text>Could not load profile. Pull down to try again.</Text>
      </View>
    );
  }

  const fullProfileImageUrl = student.profile_image?.startsWith('/')
    ? `${BASE_URL}${student.profile_image}`
    : student.profile_image;

  const fullCoverPhotoUrl = student.cover_photo?.startsWith('/')
    ? `${BASE_URL}${student.cover_photo}`
    : student.cover_photo;

  const renderProfileHeader = () => (
    <Animated.View style={[styles.profileCard, profileCardStyle]}>
        <Image
            source={{ uri: fullCoverPhotoUrl ?? `https://picsum.photos/seed/${student.reg_no}/800/400` }}
            style={styles.coverImage}
        />
        <Image
            source={{ uri: fullProfileImageUrl ?? "https://via.placeholder.com/150" }}
            style={styles.profileImage}
        />
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.regNo}>@{student.reg_no}</Text>
        <Text style={styles.bio}>{student.Bio}</Text>
    </Animated.View>
  );

  const renderStatsAndActions = () => (
    <View style={styles.statsContainer}>
        <View style={styles.statBox}>
            <Text style={styles.statNumber}>{student.Post?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
            <Text style={styles.statNumber}>{student.Experience || 'N/A'}</Text>
            <Text style={styles.statLabel}>Experience</Text>
        </View>
        <TouchableOpacity 
            style={styles.enhanceButton}
            onPress={() => router.push({ pathname: "../profileupdate", params: { reg_no: reg_no ?? student.reg_no } })}
        >
            <FontAwesome name="pencil" size={16} color="#fff" />
            <Text style={styles.enhanceButtonText}>Edit Profile</Text>
        </TouchableOpacity>
    </View>
  );
  
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <Pressable style={[styles.tab, activeTab === 'posts' && styles.activeTab]} onPress={() => setActiveTab('posts')}>
        <MaterialCommunityIcons name="grid" size={24} color={activeTab === 'posts' ? "#007bff" : "#666"} />
      </Pressable>
      <Pressable style={[styles.tab, activeTab === 'about' && styles.activeTab]} onPress={() => setActiveTab('about')}>
        <MaterialCommunityIcons name="information-outline" size={24} color={activeTab === 'about' ? "#007bff" : "#666"} />
      </Pressable>
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
          <FlatList
            data={student.Post}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={({ item, index }) => <AnimatedPostItem item={item} index={index} />}
            contentContainerStyle={styles.postGrid}
            scrollEnabled={false}
          />
      );
    }
    return (
        <Animated.View style={styles.aboutContainer} entering={FadeInUp.duration(500)}>
            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="briefcase-outline" size={24} color="#333" />
                <Text style={styles.detailText}>{student.job_role || 'No role specified'} @ {student.Company || 'No company'}</Text>
            </View>
            <View style={styles.detailItem}>
                <FontAwesome name="linkedin-square" size={24} color="#0077b5" />
                <Text style={styles.detailText}>{student.Linkedin_id || 'Not provided'}</Text>
            </View>
            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="gender-male-female" size={24} color="#333" />
                <Text style={styles.detailText}>{student.Gender || 'Not specified'}</Text>
            </View>
        </Animated.View>
    );
  };

  return (
    <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
            />
        }
    >
      {renderProfileHeader()}
      {renderStatsAndActions()}
      {renderTabBar()}
      {renderContent()}
    </ScrollView>
  );
};

const theme = {
    colors: {
        primary: '#007bff',
        background: '#F0F2F5',
        card: '#FFFFFF',
        text: '#1C1E21',
        subtext: '#65676B',
        border: '#CED0D4',
        white: '#FFFFFF',
    },
    spacing: {
        sm: 8,
        md: 16,
        lg: 24,
    },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    alignItems: "center",
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: theme.colors.card,
    marginTop: -70,
    marginBottom: theme.spacing.sm,
    backgroundColor: '#E0E0E0',
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  regNo: {
    fontSize: 16,
    color: theme.colors.subtext,
  },
  bio: {
    fontSize: 15,
    color: theme.colors.subtext,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  enhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  enhanceButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
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
  aboutContainer: {
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  detailText: {
    fontSize: 16,
    color: theme.colors.text,
    flexShrink: 1,
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
});

export default ProfileScreen;