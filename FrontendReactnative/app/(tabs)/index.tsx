import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '@/constant';
// Define the Post interface
interface Post {
  id: number;
  caption: string;
  image: string | null;
  createdAt: string;
  role: string;
  studentId: number | null;
  alumniId: number | null;
  teacherId: number | null;
}

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  const fetchPosts = () => {
    setError('');
    axios.get<{ data: Post[] }>('http://192.168.171.47:3000/api/post/getall')
      .then(res => {
        const sortedPosts = (res.data.data || []).sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      })
      .catch(err => {
        console.log('Fetch error:', err.message);
        setError('Failed to fetch posts');
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
        {posts.map(post => (
          <View key={post.id} style={styles.card}>
            <Text style={styles.caption}>{post.caption}</Text>
            {post.image && (
              <Image
                source={{ uri: post.image.replace('localhost', '192.168.171.47') }}
                style={styles.image}
              />
            )}
          </View>
        ))}
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
  caption: { fontSize: 16, fontWeight: 'bold' },
  image: { width: '100%', height: 200, marginTop: 10, borderRadius: 6 },
  error: { color: 'red', marginBottom: 10 },
});

export default App;
