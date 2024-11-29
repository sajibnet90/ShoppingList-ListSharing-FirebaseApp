// app/screens/AddListScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createList, fetchUserLists } from '../firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './LoadingScreen';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';

const AddListScreen = ({ navigation }) => {
  const [listName, setListName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserId = async () => {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        try {
          const usersCollectionRef = collection(FIRESTORE_DB, 'users');
          const userQuery = query(usersCollectionRef, where('username', '==', savedUsername));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            setUserId(userDoc.id);
          } else {
            Alert.alert('Error', 'User not found. Please log in again.');
            navigation.navigate('Onboarding');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Could not fetch user data. Please try again.');
        }
      } else {
        Alert.alert('Error', 'No username found. Please log in again.');
        navigation.navigate('Onboarding'); // Redirect to onboarding if no username
      }
    };

    loadUserId();
  }, [navigation]);

  const handleAddList = async () => {
    if (listName.trim()) {
      setLoading(true);
      try {
        // Check if the list name already exists
        const userLists = await fetchUserLists(userId);
        const listExists = userLists.some(list => list.name.toLowerCase() === listName.toLowerCase());
        if (listExists) {
          Alert.alert('Error', 'A list with this name already exists. Please choose a different name.');
          setLoading(false);
          return;
        }

        await createList(listName, userId);
        Alert.alert('Success', 'List created successfully!');
        navigation.navigate('Main', { screen: 'My Lists', params: { refresh: true } }); // Pass refresh parameter
      } catch (error) {
        console.error('Error creating list:', error);
        Alert.alert('Error', 'Could not create list. Please try again.');
      }
      setLoading(false);
    } else {
      Alert.alert('Error', 'Please enter a list name.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Enter list name"
        value={listName}
        onChangeText={setListName}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Add List" onPress={handleAddList} />
    </View>
  );
};

export default AddListScreen;