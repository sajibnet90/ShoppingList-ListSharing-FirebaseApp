// app/screens/SharedListsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Button, StyleSheet } from 'react-native';
import { fetchSharedLists, joinSharedList } from '../firestoreService';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';

const SharedListsScreen = ({ navigation, route }) => {
  const [sharedLists, setSharedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const loadSharedLists = async () => {
    setLoading(true);
    const savedUsername = await AsyncStorage.getItem('username');
    if (savedUsername) {
      try {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userQuery = query(usersCollectionRef, where('username', '==', savedUsername));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          setUserId(userDoc.id);

          const sharedLists = await fetchSharedLists(userDoc.id);
          setSharedLists(sharedLists);
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

  useEffect(() => {
    loadSharedLists();
  }, [navigation, route.params?.refresh]);

  const handleJoinSharedList = async () => {
    if (invitationCode.trim()) {
      try {
        await joinSharedList(invitationCode, userId);
        Alert.alert('Success', 'Joined shared list successfully!');
        navigation.navigate('Main', {
          screen: 'Shared Lists', // Tab name as defined in Tab.Navigator
          params: { refresh: Date.now() },
        });
        loadSharedLists();
        setInvitationCode('');
      } catch (error) {
        Alert.alert('Error', 'Could not join shared list. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter an invitation code.');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={sharedLists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ListDetails', { listId: item.id, listName: item.name })}>
            <View style={styles.itemContainer}>
              <Text>{item.name}</Text>
              <Text style={styles.ownerText}>Owner: {item.ownerUsername}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TextInput
        placeholder="Enter invitation code"
        value={invitationCode}
        onChangeText={setInvitationCode}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Join Shared List" onPress={handleJoinSharedList} />
      <View style={{ marginTop: 20 }}>
        <Button title="Refresh Shared List" onPress={loadSharedLists} />
      </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  ownerText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

<<<<<<< HEAD
export default SharedListsScreen;
=======
export default SharedListsScreen;




// // app/screens/SharedListsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Button, StyleSheet } from 'react-native';
// import { fetchSharedLists, joinSharedList } from '../firestoreService';
// import LoadingScreen from './LoadingScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { FIRESTORE_DB } from '../../firebaseConfig';

// const SharedListsScreen = ({ navigation, route }) => {
//   const [sharedLists, setSharedLists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState('');
//   const [invitationCode, setInvitationCode] = useState('');

//   useEffect(() => {
//     const loadUserAndLists = async () => {
//       const savedUsername = await AsyncStorage.getItem('username');
//       if (savedUsername) {
//         try {
//           const usersCollectionRef = collection(FIRESTORE_DB, 'users');
//           const userQuery = query(usersCollectionRef, where('username', '==', savedUsername));
//           const userSnapshot = await getDocs(userQuery);

//           if (!userSnapshot.empty) {
//             const userDoc = userSnapshot.docs[0];
//             setUserId(userDoc.id);

//             const sharedLists = await fetchSharedLists(userDoc.id);
//             setSharedLists(sharedLists);
//           } else {
//             Alert.alert('Error', 'User not found. Please log in again.');
//             navigation.navigate('Onboarding');
//           }
//         } catch (error) {
//           Alert.alert('Error', 'Could not fetch user data. Please try again.');
//         }
//       } else {
//         Alert.alert('Error', 'No username found. Please log in again.');
//         navigation.navigate('Onboarding');
//       }
//       setLoading(false);
//     };

//     loadUserAndLists();
//   }, [navigation, route.params?.refresh]);

//   const handleJoinSharedList = async () => {
//     if (invitationCode.trim()) {
//       try {
//         await joinSharedList(invitationCode, userId);
//         Alert.alert('Success', 'Joined shared list successfully!');
//         navigation.navigate('SharedLists', { refresh: Date.now() });

//         // Refresh the lists
//         const sharedLists = await fetchSharedLists(userId);
//         setSharedLists(sharedLists);

//         setInvitationCode('');
//       } catch (error) {
//         Alert.alert('Error', 'Could not join shared list. Please try again.');
//       }
//     } else {
//       Alert.alert('Error', 'Please enter an invitation code.');
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <FlatList
//         data={sharedLists}
//         keyExtractor={item => item.id }
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => navigation.navigate('ListDetails', { listId: item.id, listName: item.name })}>
//             <View style={styles.itemContainer}>
//               <Text >{item.name}</Text>
//               <Text style={styles.ownerText}>Owner: {item.ownerUsername}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//       <TextInput
//         placeholder="Enter invitation code"
//         value={invitationCode}
//         onChangeText={setInvitationCode}
//         style={{ borderBottomWidth: 1, marginBottom: 20 }}
//       />
//       <Button title="Join Shared List" onPress={handleJoinSharedList} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   fab: {
//     position: 'absolute',
//     margin: 16,
//     right: 0,
//     bottom: 50,
//     backgroundColor: 'dodgerblue',
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fabText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   itemContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   ownerText: {
//     fontSize: 12,
//     color: '#888',
//     marginTop: 4,
//   },
// });

// export default SharedListsScreen; 
>>>>>>> a8eb6e5 (Add refreash button)
