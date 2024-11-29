// app/screens/MyListsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Alert, TextInput, StyleSheet, Modal, Clipboard } from 'react-native';
import { fetchUserLists, deleteList, updateListName, convertToSharedList, checkUsernameExists, shareListWithUser } from '../firestoreService';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { FontAwesome6 } from '@expo/vector-icons';

const MyListsScreen = ({ navigation, route }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareUsername, setShareUsername] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [currentListId, setCurrentListId] = useState(null); // Add state to track the current list ID

  const [username, setUsername] = useState(''); // Added state to store the username

  useEffect(() => {
    const loadUserAndLists = async () => {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername); // Set the username for display
        try {
          const usersCollectionRef = collection(FIRESTORE_DB, 'users');
          const userQuery = query(usersCollectionRef, where('username', '==', savedUsername));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            setUserId(userDoc.id);

            const userLists = await fetchUserLists(userDoc.id);
            setLists(userLists);
          } else {
            Alert.alert('Error', 'User not found. Please log in again.');
            navigation.navigate('Onboarding');
          }
        } catch (error) {
          Alert.alert('Error', 'Could not fetch user data. Please try again.');
        }
      } else {
        Alert.alert('Error', 'No username found. Please log in again.');
        navigation.navigate('Onboarding');
      }
      setLoading(false);
    };

    loadUserAndLists();
    if (route.params?.refresh) {
      loadUserAndLists(); // Fetch updated lists if refresh param is passed
      navigation.setParams({ refresh: false }); // Reset the refresh param after updating
  }
}, [navigation, route.params?.refresh]);

  const handleAddList = () => {
    navigation.navigate('AddList');
  };

  const handleDeleteList = async (listId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(listId);
              Alert.alert('Success', 'List deleted successfully!');
              // Refresh the lists
              const userLists = await fetchUserLists(userId);
              setLists(userLists);
            } catch (error) {
              Alert.alert('Error', 'Could not delete list. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditList = (listId, listName) => {
    setEditingListId(listId);
    setNewListName(listName);
    setModalVisible(true);
  };

  const handleUpdateList = async () => {
    if (newListName.trim()) {
      const listExists = lists.some(list => list.name.toLowerCase() === newListName.toLowerCase());
      if (listExists) {
        Alert.alert('Error', 'A list with this name already exists. Please choose a different name.');
        return;
      }
      try {
        await updateListName(editingListId, newListName);
        Alert.alert('Success', 'List name updated successfully!');
        setEditingListId(null);
        setNewListName('');
        setModalVisible(false);
        // Refresh the lists
        const userLists = await fetchUserLists(userId);
        setLists(userLists);
      } catch (error) {
        Alert.alert('Error', 'Could not update list name. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a new list name.');
    }
  };

  const handleConvertToShared = async (listId) => {
    try {
      const invitationCode = await convertToSharedList(listId, userId);
      setInvitationCode(invitationCode);
      setCurrentListId(listId); // Set the current list ID
      setShareModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Could not convert list to shared. Please try again.');
    }
  };

  const handleShareList = async () => {
    if (shareUsername.trim()) {
      try {
        await shareListWithUser(currentListId, shareUsername); // Use the current list ID
        Alert.alert('Success', `List shared successfully with ${shareUsername}!`);
        setShareUsername('');
        setShareModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'The username entered does not exist. Please share it with an existing user.');
      }
    } else {
      Alert.alert('Error', 'Please enter a username.');
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(invitationCode);
    Alert.alert('Copied', 'Invitation code copied to clipboard.');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Added user icon and username display */}
      <View style={styles.header}>
        <FontAwesome6 name="user-circle" size={24} color="black" />
        <Text style={styles.usernameText}>{username}</Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Lists</Text>
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ListDetails', { listId: item.id, listName: item.name })}>
              <Text style={{ padding: 16 }}>{item.name}</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleConvertToShared(item.id)} style={styles.icon}>
                <FontAwesome6 name="share-from-square" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteList(item.id)} style={styles.icon}>
                <FontAwesome6 name="trash-can" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditList(item.id, item.name)} style={styles.icon}>
                <FontAwesome6 name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Add New List" onPress={handleAddList} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit List Name</Text>
            <TextInput
              placeholder="Enter new list name"
              value={newListName}
              onChangeText={setNewListName}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button title="Update" onPress={handleUpdateList} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => {
          setShareModalVisible(!shareModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Share List</Text>
            <TextInput
              placeholder="Enter username"
              value={shareUsername}
              onChangeText={setShareUsername}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button title="Share" onPress={handleShareList} />
              <Button title="Cancel" onPress={() => setShareModalVisible(false)} />
            </View>
            <Text style={styles.modalText}>Invitation Code: {invitationCode}</Text>
            <Button title="Copy Invitation Code" onPress={copyToClipboard} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    backgroundColor: 'dodgerblue',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default MyListsScreen;