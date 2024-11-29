// app/hooks/useListOperations.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { updateListItems } from '../firestoreService';

const useListOperations = (listId, listDetails, setListDetails, isAscending, setIsAscending) => {
  const [itemLoading, setItemLoading] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const handleAddItem = async () => {
    if (newItem.trim() === '') {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }

    // Check for duplicate item
    const itemExists = listDetails.items.some(item => item.name.toLowerCase() === newItem.toLowerCase());
    if (itemExists) {
      Alert.alert('Error', 'This item already exists in the list.');
      return;
    }

    setItemLoading(true); // Start loading state
    const updatedItems = [...listDetails.items, { id: Date.now().toString(), name: newItem, checked: false }];

    try {
      await updateListItems(listId, updatedItems);
      const sortedItems = [...updatedItems].sort((a, b) => {
        // Always sort by completion status first
        if (a.checked !== b.checked) {
          return a.checked ? 1 : -1; // Completed items at the bottom
        }
        // Then sort by name (ascending or descending)
        return isAscending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      });
      setListDetails(prev => ({ ...prev, items: sortedItems }));
      setNewItem('');
      Alert.alert('Success', 'Item added successfully!'); // Feedback after adding
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Could not add item to the list.');
    } finally {
      setItemLoading(false); // End loading state
    }
  };

  const handleDeleteItem = async (itemId) => {
    setItemLoading(true);
    const updatedItems = listDetails.items.filter(item => item.id !== itemId);
    try {
      await updateListItems(listId, updatedItems);
      setListDetails(prev => ({ ...prev, items: updatedItems }));
      Alert.alert('Success', 'Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Could not delete item.');
    } finally {
      setItemLoading(false);
    }
  };

  const handleEditItem = (itemId, itemName) => {
    setNewItem(itemName);
    setIsEditing(true);
    setEditingItemId(itemId);
  };

  const handleUpdateItem = async (itemId, newItemName) => {
    if (newItemName.trim() === '') {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }

    const itemExists = listDetails.items.some(item => item.name.toLowerCase() === newItemName.toLowerCase());
    if (itemExists && editingItemId !== null) {
      Alert.alert('Error', 'This item already exists in the list.');
      return;
    }

    setItemLoading(true);
    const updatedItems = listDetails.items.map(item =>
      item.id === itemId ? { ...item, name: newItemName } : item
    );

    try {
      await updateListItems(listId, updatedItems);
      const sortedItems = [...updatedItems].sort((a, b) => {
        // Always sort by completion status first
        if (a.checked !== b.checked) {
          return a.checked ? 1 : -1; // Completed items at the bottom
        }
        // Then sort by name (ascending or descending)
        return isAscending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      });
      setListDetails(prev => ({ ...prev, items: sortedItems }));
      setNewItem('');
      setIsEditing(false);
      Alert.alert('Success', 'Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Could not update item.');
    } finally {
      setItemLoading(false);
    }
  };

  const toggleCheckbox = async (itemId) => {
    setItemLoading(true);
    const updatedItems = listDetails.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    try {
      await updateListItems(listId, updatedItems);
      const sortedItems = [...updatedItems].sort((a, b) => {
        // Always sort by completion status first
        if (a.checked !== b.checked) {
          return a.checked ? 1 : -1; // Completed items at the bottom
        }
        // Then sort by name (ascending or descending)
        return isAscending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      });
      setListDetails(prev => ({ ...prev, items: sortedItems }));
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Could not update item.');
    } finally {
      setItemLoading(false);
    }
  };

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    if (listDetails) {
      const sortedItems = [...listDetails.items].sort((a, b) => {
        // Always sort by completion status first
        if (a.checked !== b.checked) {
          return a.checked ? 1 : -1; // Completed items at the bottom
        }
        // Then sort by name (ascending or descending)
        return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
      setListDetails(prev => ({ ...prev, items: sortedItems }));
    }
    setIsAscending(!isAscending); // Toggle the sorting order
  };

  return {
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
  };
};

export default useListOperations;