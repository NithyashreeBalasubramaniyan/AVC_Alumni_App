import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, // Added for loading state
  Platform, // Used for more robust file naming
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from '@/constant'; // Adjust path if needed based on your project structure
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for a selected image, ensuring it matches FormData requirements
type SelectedImage = {
  uri: string;
  name: string; // File name, crucial for backend
  type: string; // MIME type, crucial for backend
};

const PostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [token, setToken] = useState<string | null>(null); // Initialize as null, will be set on mount
  const [loading, setLoading] = useState(false); // State for loading indicator

  // --- 1. Token Loading ---
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        // IMPORTANT: Assuming 'token' is stored as a plain JWT string.
        // If your login flow does JSON.stringify(someObjectContainingToken),
        // then you'll need to parse it here: e.g., JSON.parse(storedToken).tokenField
        setToken(storedToken);
        if (storedToken) {
          console.log('✅ Token loaded successfully from AsyncStorage. Length:', storedToken.length);
          // Optional: If you want to visually confirm the token value (not recommended for prod)
          // console.log('Loaded token snippet:', storedToken.substring(0, 30) + '...');
        } else {
          console.warn('⚠️ No token found in AsyncStorage. User might not be logged in.');
        }
      } catch (error) {
        console.error('❌ Failed to load token from AsyncStorage:', error);
        Alert.alert('Error', 'Failed to load user session. Please log in again.');
      }
    };
    loadToken();
  }, []); // Empty dependency array means this runs once on component mount

  // --- 2. Image Picker Permissions ---
  const requestStoragePermission = async (): Promise<boolean> => {
    // Permissions are generally not needed for web or might be handled differently
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera roll permissions to make this work!'
        );
        return false;
      }
    }
    return true;
  };

  // --- 3. Image Selection Logic ---
  const selectImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Allow user to crop/edit the image
        aspect: [4, 3], // Example aspect ratio
        quality: 0.7, // Compress image quality to save bandwidth (0 to 1)
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        // Ensure a valid file name; Expo's asset.fileName is usually good
        const fileName = asset.fileName || `${Date.now()}.${asset.type === 'image' ? 'jpeg' : 'file'}`;

        setImage({
          uri: asset.uri,
          name: fileName,
          type: asset.mimeType || 'image/jpeg', // Use mimeType if available, fallback to 'image/jpeg'
        });
        console.log('✅ Image selected:', { uri: asset.uri, name: fileName, type: asset.mimeType });
      } else {
        console.log('ℹ️ Image selection cancelled.');
      }
    } catch (error) {
      console.error('❌ Error selecting image:', error);
      Alert.alert('Error', 'Could not select image. Please try again.');
    }
  };

  // --- 4. Post Submission Logic ---
  const handlePost = async () => {
    if (loading) return; // Prevent multiple submissions while a request is in progress

    // Basic validation for caption and image presence
    if (!caption.trim() && !image) {
      Alert.alert('Validation Error', 'Please enter a caption or select an image to post.');
      return;
    }

    // --- Critical Token Check ---
    if (!token) {
      console.error('❌ Attempted to post without a loaded token.');
      Alert.alert('Authentication Required', 'Your session has not loaded. Please log in again or restart the app.');
      return;
    }
    console.log('Sending post request with token (first 30 chars):', token.substring(0, 30) + '...');


    setLoading(true); // Start loading indicator

    const formData = new FormData();
    formData.append('caption', caption.trim()); // Trim whitespace from caption
    formData.append('token', token); // Append the raw JWT string

    if (image) {
      // Structure the image object as expected by FormData
      formData.append('image', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any); // 'as any' is used to satisfy TypeScript for appending Blob/File-like objects
    }

    // Log FormData contents for debugging purposes (React Native FormData does not support .entries())
    console.log('📦 Sending FormData (fields only):');
    console.log('  caption:', caption.trim());
    console.log('  token:', token ? token.substring(0, 50) + '...' : '');
    if (image) {
      console.log('  image:', { uri: image.uri, name: image.name, type: image.type });
    }


    try {
      console.log(`📡 Sending POST request to: ${BASE_URL}/api/post/create`);
      const res = await axios.post(`${BASE_URL}/api/post/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial header for file uploads
        },
        timeout: 20000, // 20 seconds timeout for potentially large uploads
      });

      console.log('✅ Post creation successful:', res.data);
      Alert.alert('Success', 'Your post has been uploaded!');
      // Clear inputs after successful post
      setCaption('');
      setImage(null);
    } catch (error: any) {
      console.error('❌ Error during post creation:', error);

      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx (e.g., 401, 500)
          console.error('Server Response Status:', error.response.status);
          console.error('Server Response Data:', error.response.data);

          if (error.response.status === 401) {
            errorMessage = error.response.data.message || 'Invalid or expired session. Please log in again.';
            // Consider navigating to login screen here
          } else if (error.response.status === 500) {
            errorMessage = error.response.data.error || 'Server error. Please try again later.';
          } else {
            // Catch other client-side errors like 400 Bad Request if backend sends them
            errorMessage = error.response.data.message || error.response.data.error || `Server responded with status ${error.response.status}.`;
          }
        } else if (error.request) {
          // The request was made but no response was received (e.g., network error, server down)
          errorMessage = 'No response from server. Please check your internet connection or try again later.';
          console.error('No response from server:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = error.message;
          console.error('Axios request setup error:', error.message);
        }
      } else {
        // Non-Axios errors (e.g., programming errors in the frontend code)
        errorMessage = error.message || 'An unknown error occurred.';
      }
      Alert.alert('Post Failed', errorMessage);
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }} // Placeholder for user avatar
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Mohammed Tharik</Text> {/* Placeholder user name */}
          <Text style={styles.role}>Student @ AVC</Text> {/* Placeholder user role */}
        </View>
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePost}
          disabled={loading} // Disable button while request is in progress
        >
          {loading ? (
            <ActivityIndicator color="#fff" /> // Show loader when loading
          ) : (
            <Text style={styles.postText}>POST</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Caption Input */}
      <TextInput
        placeholder="| Share your thoughts...."
        placeholderTextColor="#888"
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
        maxLength={500} // Example max length for caption
      />

      {/* Image Preview */}
      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
            <Text style={styles.removeImageText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Image Icon */}
      <TouchableOpacity style={styles.uploadIcon} onPress={selectImage}>
        {/* Make sure 'image.png' is correctly located in your assets folder */}
        <Image
          source={require('./assets/image.png')}
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
    paddingVertical: 35, // Added padding at top for status bar
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
    flex: 1, // Allows info to take up available space
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
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
    minWidth: 70, // Ensure button has a consistent width for loader
    justifyContent: 'center',
    alignItems: 'center',
  },
  postText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    minHeight: 100,
    maxHeight: 200, // Prevent input from growing too large
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    textAlignVertical: 'top', // Aligns text to the top for multiline input
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24, // Improve readability
    color: '#333',
  },
  imagePreviewContainer: {
    marginTop: 10,
    position: 'relative', // For positioning the remove button
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover', // Ensures image covers the area nicely
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it's above the image
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 80, // Adjust position as needed
    right: 20,
    zIndex: 999,
    backgroundColor: '#fff', // Add a background to make icon stand out
    borderRadius: 25, // Make it circular
    padding: 5, // Add some padding
    shadowColor: '#000', // Add shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
});