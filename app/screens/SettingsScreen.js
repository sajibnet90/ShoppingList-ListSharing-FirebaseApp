// app/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUsername, checkUsernameExists } from '../firestoreService';
import LoadingScreen from './LoadingScreen';

const SettingsScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    };

    loadUsername();
  }, []);

  const handleUpdateUsername = async () => {
    if (newUsername.trim()) {
      setLoading(true);
      if (newUsername === username) {
        Alert.alert('Information', 'You are already using this username.');
        setNewUsername('');
        setLoading(false);
        return;
      }

      const exists = await checkUsernameExists(newUsername);
      if (exists) {
        Alert.alert('Error', 'This username is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      try {
        await updateUsername(username, newUsername);
        await AsyncStorage.setItem('username', newUsername);
        setUsername(newUsername);
        setNewUsername('');
        Alert.alert('Success', 'Username updated successfully!');
      } catch (error) {
        console.error('Error updating username:', error);
        Alert.alert('Error', 'Could not update username. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a new username.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('username');
            Alert.alert('Logged out', 'You have been logged out.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
      <Text style={{ marginTop: 20 }}>Current Username: {username}</Text>
      <TextInput
        placeholder="Enter new username"
        value={newUsername}
        onChangeText={setNewUsername}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Update Username" onPress={handleUpdateUsername} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

export default SettingsScreen;