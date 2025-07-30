 import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/constant';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const getUserInfo = (post: Post) => {
    return post.student || post.alumni || post.teacher || { name: 'Unknown', job_role: '', profile_image: null };
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Posts</Text>
        <TouchableOpacity onPress={fetchPosts}>
          <Icon name="refresh" size={24} color="#000" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#f4f4f4',
  },
  headerText: { fontSize: 20, fontWeight: 'bold' },
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
});

export default App;
