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
  Modal, // To create a loading overlay
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from '@/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import react-native-reanimated for smooth animations
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';

// Define the type for a selected image
type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

const PostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // New state for modal overlay

  const MAX_CAPTION_LENGTH = 500;

  // --- 1. Token Loading (No changes to logic) ---
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
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

  // --- 2. Image Picker Permissions (No changes to logic) ---
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

  // --- 3. Image Selection Logic (No changes to logic) ---
  const selectImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Slightly higher quality
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

  // --- 4. Post Submission Logic (Updated for better UX) ---
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

    setIsUploading(true); // Show the full-screen loading modal

    const formData = new FormData();
    formData.append('caption', caption.trim());
    formData.append('token', token);

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
        timeout: 30000, // 30-second timeout for larger uploads
      });

      Alert.alert('Success!', 'Your post has been shared.');
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
      setIsUploading(false); // Hide the loading modal
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
          {/* --- Uploading Modal --- */}
          <Modal visible={isUploading} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.modalText}>Uploading...</Text>
              </View>
            </View>
          </Modal>

          {/* --- Header --- */}
          <Animated.View entering={FadeInUp.duration(500)} style={styles.headerContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100' }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>Mohammed Tharik</Text>
                <Text style={styles.role}>Student @ AVC</Text>
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

          {/* --- Main Content Card --- */}
          <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.mainCard}>
            <TextInput
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              style={styles.input}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={MAX_CAPTION_LENGTH}
            />
            
            {/* --- Image Preview --- */}
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

            {/* --- Card Footer with Actions --- */}
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
    </KeyboardAvoidingView>
  );
};

export default PostScreen;

// --- Styles ---
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F2F5', // Softer background color
  },
  // --- Header ---
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
    backgroundColor: '#1877F2', // Facebook blue
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  postButtonDisabled: {
    backgroundColor: '#A0C6F5', // Lighter, disabled color
  },
  postText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // --- Main Content Card ---
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
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 18,
    color: '#1C1E21',
    lineHeight: 26,
  },
  // --- Image Preview ---
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
  // --- Card Footer ---
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
  // --- Uploading Modal ---
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