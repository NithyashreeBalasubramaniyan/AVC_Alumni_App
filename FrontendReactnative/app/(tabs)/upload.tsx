import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from '@/constant'; 

const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzUzNTUxMDMwLCJleHAiOjE3NTQxNTU4MzB9.b6Xo5HpQtHbXb7FfN5qdSKQhnXK-utxm9Xryx5MhD_o';

type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

const PostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<SelectedImage | null>(null);

  const requestStoragePermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Cannot access media library.');
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: asset.type || 'image/jpeg',
      });
    } else {
      Alert.alert('Image selection cancelled.');
    }
  };

  const handlePost = async () => {
    if (!caption || !image) {
      Alert.alert('Please enter a caption and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('caption', caption);
    formData.append('image', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);

    try {
      const res = await axios.post(`${BASE_URL}/api/post/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Post uploaded!');
      setCaption('');
      setImage(null);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Upload failed', err?.message || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile and Header */}
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

      {/* Caption */}
      <TextInput
        placeholder="| Share your thoughts...."
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {/* Image Preview */}
      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      {/* Upload Image Icon */}
      <TouchableOpacity style={styles.uploadIcon} onPress={selectImage}>
        <Image
          source={require('./logo.png')} // ✅ Replace with your upload icon
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
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
  },
  profileInfo: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  role: {
    fontSize: 12,
    color: 'gray',
  },
  postButton: {
    backgroundColor: '#5e8df2',
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  postText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    minHeight: 100,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  preview: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 999,
  },
});
