
// app/screens/OnboardingScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { checkUsernameExists, addUser } from '../firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './LoadingScreen';

const OnboardingScreen = ({ navigation }) => {
  const [newUsername, setNewUsername] = useState('');
  const [existingUsername, setExistingUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUsername = async () => {
    if (newUsername.trim() === '') {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }

    setLoading(true);
    try {
      const exists = await checkUsernameExists(newUsername);
      if (exists) {
        Alert.alert('Error', 'Username already exists. Please try another username.');
      } else {
        await addUser(newUsername); // Add the new user to Firestore
        await AsyncStorage.setItem('username', newUsername); // Save to AsyncStorage
        navigation.replace('Main'); // Navigate to the main screen
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating a username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (existingUsername.trim() === '') {
      Alert.alert('Error', 'Please enter your username.');
      return;
    }

    setLoading(true);
    try {
      const exists = await checkUsernameExists(existingUsername);
      if (exists) {
        await AsyncStorage.setItem('username', existingUsername); // Save to AsyncStorage
        navigation.replace('Main'); // Navigate to the main screen
      } else {
        Alert.alert('Error', 'Username not found. Please create a new username.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Create new username"
        value={newUsername}
        onChangeText={setNewUsername}
        style={styles.input}
      />
      <Button title="Create" onPress={handleCreateUsername} />
      <View style={styles.separator} />
      <TextInput
        placeholder="Login with your username"
        value={existingUsername}
        onChangeText={setExistingUsername}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 8,
  },
  separator: {
    height: 20,
  },
});

export default OnboardingScreen;



// // app/screens/OnboardingScreen.js
// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Button, Text, Alert } from 'react-native';
// import { checkUsernameExists, addUser } from '../firestoreService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LoadingScreen from './LoadingScreen';

// const OnboardingScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Check if username is already saved in AsyncStorage
//   useEffect(() => {
//     const loadUsername = async () => {
//       const savedUsername = await AsyncStorage.getItem('username');
//       if (savedUsername) {
//         navigation.replace('Main'); // Navigate to Main screen if username exists
//       }
//     };

//     loadUsername();
//   }, []);

//   const handleContinue = async () => {
//     if (username) {
//       setLoading(true);
//       const exists = await checkUsernameExists(username);
//       if (exists) {
//         // Ask if the existing username belongs to the user
//         Alert.alert(
//           'Username Exists',
//           'This username already exists. Do you want to continue with the existing username?',
//           [
//             {
//               text: 'Yes',
//               onPress: async () => {
//                 await AsyncStorage.setItem('username', username);
//                 navigation.replace('Main'); // Navigate to Main screen
//               },
//             },
//             {
//               text: 'No',
//               onPress: () => {
//                 setUsername(''); // Clear the username field
//               },
//             },
//           ]
//         );
//       } else {
//         await addUser(username);
//         await AsyncStorage.setItem('username', username);
//         navigation.replace('Main'); // Navigate to Main screen after successful addition
//       }
//       setLoading(false);
//     } else {
//       Alert.alert('Error', 'Please enter a username.');
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
//       <TextInput
//         placeholder="Enter your username"
//         value={username}
//         onChangeText={setUsername}
//         style={{ borderBottomWidth: 1, marginBottom: 20 }}
//       />
//       <Button title="Continue" onPress={handleContinue} />
//     </View>
//   );
// };

// export default OnboardingScreen;