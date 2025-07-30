import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/constant';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

interface Post {
  id: number;
  caption: string;
  image: string | null;
  createdAt: string;
  role: string;
  studentId: number | null;
  alumniId: number | null;
  teacherId: number | null;
  student?: {
    name: string;
    job_role: string | null;
    profile_image: string | null;
  };
  alumni?: {
    name: string;
    job_role: string | null;
    profile_image: string | null;
  };
  teacher?: {
    name: string;
    job_role: string | null;
    profile_image: string | null;
  };
}

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  const fetchPosts = () => {
    setError('');
    axios
      .get<{ data: Post[] }>(`${BASE_URL}/api/post/getall`)
      .then((res) => {
        const sortedPosts = (res.data.data || []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      })
      .catch((err) => {
        console.log('Fetch error:', err.message);
        setError('Failed to fetch posts');
      });
  };

  const fetchSearchedPosts = (query: string) => {
    if (!query) {
      fetchPosts();
      return;
    }

    axios
      .get<{ data: Post[] }>(`${BASE_URL}/api/post/search?name=${encodeURIComponent(query)}`)
      .then((res) => {
        const sorted = res.data.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sorted);
      })
      .catch((err) => {
        console.error('Search error:', err.message);
        setError('Failed to search posts');
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchedPosts(searchText);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const getUserInfo = (post: Post) => {
    return post.student || post.alumni || post.teacher || { name: 'Unknown', job_role: '', profile_image: null };
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Custom Header with Logo, Search, and Menu */}
      <View style={styles.customHeader}>
        <Image
          source={require('./assets/avc app logo.png')} // Replace with actual logo path
          style={styles.logo}
        />
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color="#666" style={{ marginLeft: 8 }} />
          <TextInput
            placeholder="Search by name"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={fetchPosts}>
          <Icon name="refresh" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {posts.map((post) => {
          const user = getUserInfo(post);
          return (
            <View key={post.id} style={styles.card}>
              <View style={styles.userRow}>
                {user.profile_image ? (
                  <Image
                    source={{ uri: `${BASE_URL}${user.profile_image}` }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.userName}>{user.name}</Text>
                  {user.job_role && <Text style={styles.jobRole}>{user.job_role}</Text>}
                </View>
              </View>
              <Text style={styles.caption}>{post.caption}</Text>
              {post.image && (
                <Image
                  source={{ uri: `${BASE_URL}${post.image}` }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobRole: {
    fontSize: 13,
    color: '#555',
  },
  caption: { fontSize: 15, marginVertical: 5 },
  image: { width: '100%', height: 200, marginTop: 10, borderRadius: 6 },
  error: { color: 'red', marginBottom: 10 },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginHorizontal: 10,
    height: 35,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    color: '#000',
  },
});

export default App;
