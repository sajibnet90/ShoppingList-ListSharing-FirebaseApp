// app/screens/ListDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, Alert } from 'react-native';
import { fetchListDetails } from '../firestoreService';
import LoadingScreen from './LoadingScreen';
import ListItem from '../components/ListItem';
import useListOperations from '../hooks/useListOperations'; // Import the custom hook

const ListDetailsScreen = ({ route }) => {
  const { listId } = route.params;
  const [listDetails, setListDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(false); // State to track ascending/descending order

  // Use the custom hook for list operations
  const {
    itemLoading,
    newItem,
    setNewItem,
    isEditing,
    handleAddItem,
    handleDeleteItem,
    handleEditItem,
    handleUpdateItem,
    toggleCheckbox,
    toggleSortOrder
  } = useListOperations(listId, listDetails, setListDetails, isAscending, setIsAscending);

  useEffect(() => {
    const getListDetails = async () => {
      try {
        const details = await fetchListDetails(listId);
        const sortedItems = details.items.sort((a, b) => {
          // Always sort by completion status first
          if (a.checked !== b.checked) {
            return a.checked ? 1 : -1; // Completed items at the bottom
          }
          // Then sort by name (ascending or descending)
          return isAscending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        });

        setListDetails({ ...details, items: sortedItems }); // Set the sorted list details
      } catch (error) {
        console.error('Error fetching list details:', error);
        Alert.alert('Error', 'Could not fetch list details.');
      } finally {
        setLoading(false);
      }
    };

    getListDetails();
  }, [listId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {itemLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{listDetails.name}</Text>
          <TextInput
            placeholder="Enter item name"
            value={newItem}
            onChangeText={setNewItem}
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          {isEditing ? (
            <Button title="Update Item" onPress={handleUpdateItem} />
          ) : (
            <Button title="Add Item" onPress={handleAddItem} />
          )}
          <Button
            title={`Sort by Name ${isAscending ? 'Descending' : 'Ascending'}`}
            onPress={toggleSortOrder}
          />
          <FlatList
            data={listDetails.items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                toggleCheckbox={toggleCheckbox}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
                handleUpdateItem={handleUpdateItem} // Pass the handleUpdateItem function
              />
            )}
          />
        </>
      )}
    </View>
  );
};

export default ListDetailsScreen;