import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar,
  Share,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constant';
// @ts-ignore
// import Icon from 'react-native-vector-icons/Ionicons'; // This dependency is removed to prevent build errors.

// --- Constants & Configuration ---

const { width } = Dimensions.get('window');

// --- Interfaces ---
interface Post {
  id: number;
  caption: string;
  image: string | null;
  createdAt: string;
  role: string;
  studentId: number | null;
  alumniId: number | null;
  teacherId: number | null;
  student?: { name: string; job_role: string | null; profile_image: string | null };
  alumni?: { name: string; job_role: string | null; profile_image: string | null };
  teacher?: { name: string; job_role: string | null; profile_image: string | null };
}

// --- Helper Functions ---
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m`;
  return `${Math.floor(seconds)}s`;
};

const getUserInfo = (post: Post) => {
  return post.student || post.alumni || post.teacher || { name: 'Unknown User', job_role: 'No role specified', profile_image: null };
};


// --- UI Components ---

const PostCard = ({ post, index }: { post: Post; index: number }) => {
    const user = getUserInfo(post);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Staggered animation for each card
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim, index]);

    const onShare = async () => {
      try {
        let message = `Post by ${user.name}:\n\n${post.caption || ''}`;

        if (post.image) {
          message += `\n\nImage: ${BASE_URL}${post.image}`;
        }

        if (!post.caption && !post.image) {
          message = `Check out this post by ${user.name}!`;
        }

        await Share.share({
          message: message.trim(),
          title: `Post by ${user.name}`,
        });
      } catch (error: any) {
        console.error('Failed to share post:', error.message);
      }
    };

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Card Header */}
            <View style={styles.userRow}>
                <Image
                    source={user.profile_image ? { uri: `${BASE_URL}${user.profile_image}` } : { uri: 'https://placehold.co/45x45/E0E0E0/FFFFFF?text=A' }}
                    style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.job_role && <Text style={styles.jobRole}>{user.job_role}</Text>}
                </View>
                <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
            </View>

            {/* Caption */}
            {post.caption ? <Text style={styles.caption}>{post.caption}</Text> : null}

            {/* Post Image */}
            {post.image && (
                <Image
                    source={{ uri: `${BASE_URL}${post.image}` }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {/* Action Bar */}
            <View style={styles.actionBar}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={{fontSize: 24, color: '#555'}}>♡</Text>
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={{fontSize: 24, color: '#555'}}>💬</Text>
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                    <Text style={{fontSize: 24, color: '#555'}}>↪</Text>
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const FeedHeader = ({ searchText, setSearchText, onRefresh }: { searchText: string; setSearchText: (text: string) => void; onRefresh: () => void }) => (
    <View style={styles.customHeader}>
        <Image
            source={require('./assets/avc app logo.png')}
            style={styles.logo}
        />
        <View style={styles.searchBar}>
            <Text style={{ fontSize: 18, color: '#888', marginLeft: 12 }}>🔍</Text>
            <TextInput
                placeholder="Search by name..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
            />
        </View>
         <TouchableOpacity onPress={onRefresh} style={{ marginRight: 8 }}>
            <Text style={{ fontSize: 28, color: '#333' }}>☰</Text>
        </TouchableOpacity>
    </View>
);

const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.centeredContainer}>
        <Text style={{fontSize: 60, color: '#ccc'}}>☁️</Text>
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

const LoadingIndicator = () => (
    <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#005A9C" />
    </View>
);

// --- Main App Component ---

const App = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = (query: string = '') => {
        const isSearch = query.length > 0;
        const url = isSearch
            ? `${BASE_URL}/api/post/search?name=${encodeURIComponent(query)}`
            : `${BASE_URL}/api/post/getall`;

        setError('');
        if (!isRefreshing) setLoading(true);

        axios.get<{ data: Post[] }>(url)
            .then((res) => {
                const sortedPosts = (res.data.data || []).sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedPosts);
            })
            .catch((err) => {
                console.error('Fetch error:', err.message);
                setError('Failed to fetch posts. Please try again.');
                setPosts([]); // Clear posts on error
            })
            .finally(() => {
                setLoading(false);
                setIsRefreshing(false);
            });
    };
    
    // Load auth token on mount
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                setToken(storedToken);
            } catch (error) {
                console.error('Failed to load token:', error);
            }
        };
        loadToken();
    }, []);

    // Initial data fetch and debounced search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchData(searchText);
        }, 400); // Debounce search to avoid excessive API calls

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    const onRefresh = React.useCallback(() => {
        setIsRefreshing(true);
        setSearchText(''); // Clear search on refresh
        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <LoadingIndicator />;
        }
        if (error) {
            return <EmptyState message={error} />;
        }
        return (
            <FlatList
                data={posts}
                renderItem={({ item, index }) => <PostCard post={item} index={index} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<EmptyState message="No posts found. Why not create one?" />}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={["#005A9C"]}
                        tintColor={"#005A9C"}
                    />
                }
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <FeedHeader searchText={searchText} setSearchText={setSearchText} onRefresh={onRefresh} />
            {renderContent()}
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Changed to white to match header
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F0F2F5', // Set background for empty/loading states
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#F0F2F5', // Set background for the list
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        borderRadius: 20,
        marginHorizontal: 10,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 6,
        fontSize: 15,
        color: '#333',
        paddingRight: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#E0E0E0',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userInfo: {
        marginLeft: 10,
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1E21',
    },
    jobRole: {
        fontSize: 13,
        color: '#65676B',
    },
    timeAgo: {
        fontSize: 12,
        color: '#888',
    },
    caption: {
        fontSize: 15,
        color: '#1C1E21',
        lineHeight: 22,
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: width * 0.6, // Aspect ratio for image
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: '#F0F2F5',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderColor: '#E9EBEE',
        marginTop: 15,
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#606770',
        fontWeight: '600',
    },
});

export default App;
