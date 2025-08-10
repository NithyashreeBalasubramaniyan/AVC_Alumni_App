import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

// --- Data for the Team ---

const MENTOR = {
  id: 'mentor-01',
  name: 'Tharik',
  role: 'Lead Project Mentor & AI Architect',
  image: 'https://i.pravatar.cc/150?u=mentor',
  linkedin: 'https://www.linkedin.com/in/alexgrayson',
};

const DEVELOPERS = [
  {
    id: 'dev-01',
    name: 'Samantha Chen',
    role: 'Frontend Lead (React Native)',
    image: 'https://i.pravatar.cc/150?u=dev1',
    github: 'https://github.com/samanthachen',
  },
  {
    id: 'dev-02',
    name: 'Ben Carter',
    role: 'Backend Lead (Node.js)',
    image: 'https://i.pravatar.cc/150?u=dev2',
    linkedin: 'https://linkedin.com/in/bencarter',
  },
  {
    id: 'dev-03',
    name: 'Aisha Khan',
    role: 'UI/UX Designer',
    image: 'https://i.pravatar.cc/150?u=dev3',
    linkedin: 'https://linkedin.com/in/aishakhan',
  },
  {
    id: 'dev-04',
    name: 'Michael Rodriguez',
    role: 'Full-Stack Developer',
    image: 'https://i.pravatar.cc/150?u=dev4',
    github: 'https://github.com/michaelrodriguez',
  },
  {
    id: 'dev-05',
    name: 'Chloe Wilson',
    role: 'QA & Testing Engineer',
    image: 'https://i.pravatar.cc/150?u=dev5',
    linkedin: 'https://linkedin.com/in/chloewilson',
  },
  {
    id: 'dev-06',
    name: 'David Lee',
    role: 'DevOps Specialist',
    image: 'https://i.pravatar.cc/150?u=dev6',
    github: 'https://github.com/davidlee',
  },
  {
    id: 'dev-07',
    name: 'Fatima Al-Jamil',
    role: 'Mobile Developer (iOS)',
    image: 'https://i.pravatar.cc/150?u=dev7',
    github: 'https://github.com/fatimaaljamil',
  },
  {
    id: 'dev-08',
    name: 'Kenji Tanaka',
    role: 'Mobile Developer (Android)',
    image: 'https://i.pravatar.cc/150?u=dev8',
    linkedin: 'https://linkedin.com/in/kenjitanaka',
  },
  {
    id: 'dev-09',
    name: 'Olivia Martinez',
    role: 'Database Administrator',
    image: 'https://i.pravatar.cc/150?u=dev9',
    linkedin: 'https://linkedin.com/in/oliviamartinez',
  },
  {
    id: 'dev-10',
    name: 'Leo Petrov',
    role: 'Security Analyst',
    image: 'https://i.pravatar.cc/150?u=dev10',
    github: 'https://github.com/leopetrov',
  },
];


// --- Reusable Animated Card Component ---

const MemberCard = ({ item, isMentor = false, index }: { item: any; isMentor?: boolean; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    });
  };

  const socialUrl = item.linkedin || item.github;
  const socialIcon = item.linkedin ? 'logo-linkedin' : 'logo-github';

  return (
    <Animated.View style={[styles.card, isMentor ? styles.mentorCard : styles.developerCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>{item.role}</Text>
      {socialUrl && (
        <TouchableOpacity style={styles.socialButton} onPress={() => openLink(socialUrl)}>
          <Ionicons name={socialIcon as any} size={22} color="#fff" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};


// --- Main Developers Page Component ---

const DevelopersPage = () => {
  const renderHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Meet the Team</Text>
        <Text style={styles.subtitle}>The brilliant minds behind the project.</Text>
      </View>
      <MemberCard item={MENTOR} isMentor={true} index={0} />
      <Text style={styles.sectionTitle}>Our Developers</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={DEVELOPERS}
        renderItem={({ item, index }) => <MemberCard item={item} index={index + 1} />}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Dark background for a modern look
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 20,
    marginLeft: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  mentorCard: {
    width: '97%',
    alignSelf: 'center',
    paddingVertical: 25,
    backgroundColor: '#406ae0ff',
  },
  developerCard: {
    width: Dimensions.get('window').width / 2 - 20, // Responsive width for 2 columns
    minHeight: 220,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007BFF',
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  role: {
    fontSize: 13,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButton: {
    backgroundColor: '#007BFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
});

export default DevelopersPage;
