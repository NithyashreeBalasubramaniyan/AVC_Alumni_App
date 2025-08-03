// import React, { useState, useEffect } from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     TextInput,
//     Image,
//     TouchableOpacity,
//     Alert,
//     ActivityIndicator,
//     ScrollView,
//     KeyboardAvoidingView,
//     Platform,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// import { BASE_URL } from '@/constant'; // Assuming you have your BASE_URL here

// const EditPostScreen = () => {
//     const router = useRouter();
//     const params = useLocalSearchParams();
//     const { id, caption: initialCaption, imageUrl: initialImageUrl } = params;

//     const [caption, setCaption] = useState(initialCaption || '');
//     const [imageUri, setImageUri] = useState(initialImageUrl || null);
//     const [token, setToken] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false);

//     // Effect to load the authentication token from storage
//     useEffect(() => {
//         const loadToken = async () => {
//             const storedToken = await AsyncStorage.getItem('token');
//             if (!storedToken) {
//                 Alert.alert('Authentication Error', 'You must be logged in to edit posts.');
//                 router.back();
//             } else {
//                 setToken(storedToken);
//             }
//         };
//         loadToken();
//     }, [router]);

//     // Function to handle picking an image from the library
//     const handlePickImage = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
//             return;
//         }

//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setImageUri(result.assets[0].uri);
//         }
//     };

//     // Function to handle the post update
//     const handleUpdatePost = async () => {
//         if (!token) {
//             Alert.alert('Error', 'Authentication token not found.');
//             return;
//         }
//         setIsLoading(true);

//         const formData = new FormData();
//         formData.append('postId', id);
//         formData.append('token', token);
//         formData.append('caption', caption);

//         // Check if the image has been changed
//         if (imageUri && imageUri !== initialImageUrl) {
//             const filename = imageUri.split('/').pop();
//             const match = /\.(\w+)$/.exec(filename!);
//             const type = match ? `image/${match[1]}` : `image`;
//             formData.append('image', { uri: imageUri, name: filename, type } as any);
//         }

//         try {
//             const response = await axios.put(`${BASE_URL}/api/post/update`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.success) {
//                 Alert.alert('Success', 'Post updated successfully!');
//                 router.back(); // Go back to the profile screen
//             } else {
//                 Alert.alert('Update Failed', response.data.message || 'Could not update the post.');
//             }
//         } catch (error) {
//             console.error('Update Post Error:', error);
//             Alert.alert('Error', 'An error occurred while updating the post.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Function to handle the post deletion
//     const handleDeletePost = async () => {
//         if (!token) {
//             Alert.alert('Error', 'Authentication token not found.');
//             return;
//         }

//         Alert.alert(
//             'Delete Post',
//             'Are you sure you want to delete this post? This action cannot be undone.',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: async () => {
//                         setIsLoading(true);
//                         try {
//                             const response = await axios.delete(`${BASE_URL}/api/post/delete`, {
//                                 data: { postId: id, token: token },
//                             });

//                             if (response.data.success) {
//                                 Alert.alert('Success', 'Post deleted successfully.');
//                                 router.back(); // Go back to the profile screen
//                             } else {
//                                 Alert.alert('Deletion Failed', response.data.message || 'Could not delete the post.');
//                             }
//                         } catch (error) {
//                             console.error('Delete Post Error:', error);
//                             Alert.alert('Error', 'An error occurred while deleting the post.');
//                         } finally {
//                             setIsLoading(false);
//                         }
//                     },
//                 },
//             ]
//         );
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.container}
//         >
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <Text style={styles.header}>Edit Post</Text>
                
//                 {isLoading && (
//                     <View style={styles.loadingOverlay}>
//                         <ActivityIndicator size="large" color="#fff" />
//                     </View>
//                 )}

//                 <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
//                     {imageUri ? (
//                         <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//                     ) : (
//                         <View style={styles.imagePlaceholder}>
//                             <MaterialIcons name="add-a-photo" size={50} color="#888" />
//                             <Text style={styles.imagePlaceholderText}>Tap to change image</Text>
//                         </View>
//                     )}
//                     <View style={styles.imageEditIcon}>
//                        <FontAwesome name="pencil" size={20} color="#fff" />
//                     </View>
//                 </TouchableOpacity>

//                 <TextInput
//                     style={styles.input}
//                     placeholder="What's on your mind?"
//                     value={caption}
//                     onChangeText={setCaption}
//                     multiline
//                 />

//                 <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePost} disabled={isLoading}>
//                     <Text style={styles.buttonText}>Update Post</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePost} disabled={isLoading}>
//                     <Text style={styles.buttonText}>Delete Post</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// export default EditPostScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F0F2F5',
//     },
//     scrollContainer: {
//         flexGrow: 1,
//         padding: 20,
//         alignItems: 'center',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#1C1E21',
//         marginBottom: 20,
//     },
//     imagePicker: {
//         width: '100%',
//         height: 250,
//         borderRadius: 10,
//         backgroundColor: '#E4E6EB',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#CED0D4',
//     },
//     imagePreview: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 10,
//     },
//     imagePlaceholder: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     imagePlaceholderText: {
//         marginTop: 10,
//         color: '#65676B',
//     },
//     imageEditIcon: {
//         position: 'absolute',
//         bottom: 10,
//         right: 10,
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//         padding: 8,
//         borderRadius: 20,
//     },
//     input: {
//         width: '100%',
//         minHeight: 100,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//         fontSize: 16,
//         textAlignVertical: 'top',
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#CED0D4',
//     },
//     updateButton: {
//         width: '100%',
//         backgroundColor: '#007bff',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     deleteButton: {
//         width: '100%',
//         backgroundColor: '#DC3545',
//         padding: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     loadingOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 10,
//     },
// });