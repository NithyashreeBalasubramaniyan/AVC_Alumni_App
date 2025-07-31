import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@/constant'; // Make sure this is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

const PostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          console.log('✅ Token loaded:', storedToken);
        } else {
          console.warn('⚠️ No token found');
        }
      } catch (err) {
        console.error('❌ Error fetching token:', err);
      }
    })();
  }, []);

  // Request permission for gallery
  const requestStoragePermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Cannot access media library.');
      return false;
    }
    return true;
  };

  // Pick image
  const selectImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      // Optional size check
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Image too large', 'Please select an image under 5MB.');
        return;
      }

      const imageData: SelectedImage = {
        uri: asset.uri, // ✅ keep file:// prefix
        name: asset.fileName || `photo-${Date.now()}.jpg`,
        type: 'image/jpeg', // ✅ ensure type
      };

      setImage(imageData);
      console.log('📷 Image selected:', imageData);
    } else {
      console.log('🚫 Selection cancelled');
    }
  };

  // Submit post
  const handlePost = async () => {
    if (!caption && !image) {
      Alert.alert('Missing Content', 'Add a caption or select an image.');
      return;
    }

    if (!token) {
      Alert.alert('Auth Error', 'You must be logged in to post.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    }

    try {
      console.log('🚀 Uploading with token:', token);
      const res = await axios.post(`${BASE_URL}/api/post/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      console.log('✅ Upload success:', res.data);
      Alert.alert('Success', 'Post uploaded!');
      setCaption('');
      setImage(null);
    } catch (err: AxiosError | any) {
      console.error('❌ Upload error:', err?.response?.data || err.message);
      if (err.code === 'ECONNABORTED') {
        Alert.alert('Timeout', 'Upload took too long. Try again.');
      } else if (err?.response?.data?.message === 'Invalid or expired token') {
        Alert.alert('Session Expired', 'Please log in again.');
      } else {
        Alert.alert('Error', err?.response?.data?.message || 'Upload failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Mohammed Tharik</Text>
          <Text style={styles.role}>Student @ AVC</Text>
        </View>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postText}>POST</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="| Share your thoughts...."
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.preview}
        />
      )}

      <TouchableOpacity style={styles.uploadIcon} onPress={selectImage}>
        <Image
          source={require('./assets/image.png')}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PostScreen;

// 🧾 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  role: {
    fontSize: 12,
    color: '#666',
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadIcon: {
    alignSelf: 'flex-end',
  },
});
