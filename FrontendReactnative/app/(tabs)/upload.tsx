import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '@/constant';

type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

// Replace with actual base URL

const PostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<SelectedImage | null>(null);

  const token = 'your_jwt_token_here'; // Replace this with actual JWT token

  const selectImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode || !response.assets) {
        Alert.alert('Image selection cancelled or failed.');
        return;
      }

      const asset = response.assets[0];

      if (asset && asset.uri && asset.fileName && asset.type) {
        const selectedImage: SelectedImage = {
          uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
          name: asset.fileName,
          type: asset.type,
        };
        setImage(selectedImage);
      }
    });
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
      Alert.alert('Post Successful!', JSON.stringify(res.data));
    } catch (error: any) {
      console.error(error);
      Alert.alert('Upload failed', error?.response?.data?.message || error.message);
    }
  };

  return (
    < >
      <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>MohammedTharik</Text>
          <Text style={styles.role}>Software Developer @ Trace One</Text>
        </View>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postText}>POST</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="|Share your thoughts...."
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

     <TouchableOpacity
  style={{
    position: 'absolute',
    right: 20,
    bottom: 80, // <- Push it above the bottom tab bar
    zIndex: 999,
  }}
  onPress={selectImage}
>
  <Image
    source={require('./logo.png')}
    style={{ width: 40, height: 40 }}
  />
</TouchableOpacity>
    </View>
    </>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingVertical: 35,
    backgroundColor: '#f4f4f4',
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
  },
  preview: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});
