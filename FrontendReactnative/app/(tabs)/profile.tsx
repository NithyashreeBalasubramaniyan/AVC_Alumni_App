import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';

const profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [linkedinId, setLinkedinId] = useState('');
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experience, setExperience] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [batch, setBatch] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleUpdate = () => {
    // Handle profile update logic here
    console.log({ name, email, gender, linkedinId, company, jobRole, experience, technologies, batch });
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          {/* <Image
            source={require('../../assets/images/alumni.png')}
            style={styles.logo}
            /> */}
          <Text style={styles.headerText}>Alumni Connect</Text>
        </View>
        <Text style={styles.welcomeText}>Welcome {name}!</Text>
        <View style={styles.profilePic}>
          <Image
            source={require('./alumni.png')}
            style={styles.profileImage}
            />
        </View>
        <KeyboardAvoidingView>
        <ScrollView style={[ { height: isKeyboardVisible ? 280 : 500 }]}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email id"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />
        <TextInput
          style={styles.input}
          placeholder="Linked in id"
          value={linkedinId}
          onChangeText={setLinkedinId}
        />
        <TextInput
          style={styles.input}
          placeholder="working company"
          value={company}
          onChangeText={setCompany}
        />
        <TextInput
          style={styles.input}
          placeholder="Job Role"
          value={jobRole}
          onChangeText={setJobRole}
        />
        <TextInput
          style={styles.input}
          placeholder="Experience"
          value={experience}
          onChangeText={setExperience}
        />
        <TextInput
          style={styles.input}
          placeholder="Technologies used"
          value={technologies}
          onChangeText={setTechnologies}
        />
        <TextInput
          style={styles.input}
          placeholder="Batch"
          value={batch}
          onChangeText={setBatch}
        />
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update profile</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
  );

}

export default profile;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { width: 40, height: 40, marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  profilePic: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingLeft: 10, marginHorizontal:10, backgroundColor: 'white' },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});