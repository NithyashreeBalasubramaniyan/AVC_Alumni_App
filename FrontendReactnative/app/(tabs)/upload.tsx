import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from '../constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';

// Define the type for a selected image
type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

// Define the type for the post category
type PostCategory = 'post' | 'event';

const PostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "User", profile_image: 'https://i.pravatar.cc/100', job_role: "" });
  // --- NEW: State to manage the selected category ---
  const [category, setCategory] = useState<PostCategory>('post');
  const MAX_CAPTION_LENGTH = 500;

  
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const userData = JSON.parse(await AsyncStorage.getItem('userData') || "null");
        setToken(storedToken);
        setUserInfo(userData);
        if (!storedToken) {
          Alert.alert(
            'Authentication Needed',
            'You are not logged in. Please log in to create a post.'
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user session. Please try again.');
      }
    };
    loadToken();
  }, []);

  
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need access to your photos to let you share them!'
        );
        return false;
      }
    }
    return true;
  };


  const selectImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `${Date.now()}.jpeg`;
        setImage({
          uri: asset.uri,
          name: fileName,
          type: asset.mimeType || 'image/jpeg',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not select the image. Please try again.');
    }
  };

  // --- 4. Post Submission Logic (Updated to include category) ---
  const handlePost = async () => {
    if (isUploading) return;

    if (!caption.trim() && !image) {
      Alert.alert('Empty Post', 'Please write a caption or select an image.');
      return;
    }

    if (!token) {
      Alert.alert(
        'Authentication Required',
        'Your session has expired or is invalid. Please log in again.'
      );
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('caption', caption.trim());
    formData.append('token', token);
    formData.append('category', category);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    }

    try {
      await axios.post(`${BASE_URL}/api/post/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      Alert.alert('Success!', `Your ${category} has been shared.`);
      setCaption('');
      setImage(null);
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data.message ||
            `Server Error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        }
      }
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Modal visible={isUploading} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.modalText}>Uploading...</Text>
              </View>
            </View>
          </Modal>

          <Animated.View entering={FadeInUp.duration(500)} style={styles.headerContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: `${BASE_URL}${userInfo.profile_image}` }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>{userInfo.name}</Text>
                <Text style={styles.role}>{userInfo.job_role}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.postButton, (isUploading || (!caption.trim() && !image)) && styles.postButtonDisabled]}
              onPress={handlePost}
              disabled={isUploading || (!caption.trim() && !image)}
            >
              <Text style={styles.postText}>POST</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.mainCard}>
            {/* --- NEW: Category Selector UI --- */}
            <View style={styles.categorySelector}>
              <TouchableOpacity
                style={[styles.categoryButton, category === 'post' && styles.categoryButtonActive]}
                onPress={() => setCategory('post')}
              >
                <Text style={[styles.categoryButtonText, category === 'post' && styles.categoryButtonTextActive]}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, category === 'event' && styles.categoryButtonActive]}
                onPress={() => setCategory('event')}
              >
                <Text style={[styles.categoryButtonText, category === 'event' && styles.categoryButtonTextActive]}>Event</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder={category === 'post' ? "What's on your mind?" : "Tell us about your event..."}
              placeholderTextColor="#999"
              style={styles.input}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={MAX_CAPTION_LENGTH}
            />
            
            {image && (
              <Animated.View
                layout={Layout.springify()}
                entering={FadeIn.duration(400)}
                style={styles.imagePreviewContainer}
              >
                <Image source={{ uri: image.uri }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.iconButton} onPress={selectImage}>
                <Image source={require('./assets/image.png')} style={styles.footerIcon} />
              </TouchableOpacity>
              <Text style={styles.charCounter}>
                {caption.length} / {MAX_CAPTION_LENGTH}
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
      <StatusBar barStyle={"dark-content"}></StatusBar>
    </KeyboardAvoidingView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F2F5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1C1E21',
  },
  role: {
    fontSize: 14,
    color: '#65676B',
  },
  postButton: {
    backgroundColor: '#1877F2',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  postButtonDisabled: {
    backgroundColor: '#A0C6F5',
  },
  postText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  // --- NEW: Styles for Category Selector ---
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#E4E6EB',
    borderRadius: 8,
    padding: 4,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#65676B',
  },
  categoryButtonTextActive: {
    color: '#1877F2',
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 18,
    color: '#1C1E21',
    lineHeight: 26,
  },
  imagePreviewContainer: {
    marginTop: 15,
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EBEEF0',
    marginTop: 15,
  },
  iconButton: {
    padding: 8,
  },
  footerIcon: {
    width: 30,
    height: 30,
    opacity: 0.7,
  },
  charCounter: {
    fontSize: 14,
    color: '#65676B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
