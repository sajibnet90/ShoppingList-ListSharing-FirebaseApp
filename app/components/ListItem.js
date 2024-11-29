// app/components/ListItem.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Foundation, FontAwesome6 } from '@expo/vector-icons';

const ListItem = ({ item, toggleCheckbox, handleEditItem, handleDeleteItem, handleUpdateItem }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editedItemName, setEditedItemName] = useState(item.name);

  const openEditModal = () => {
    setEditedItemName(item.name);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  const updateItem = () => {
    handleUpdateItem(item.id, editedItemName);
    closeEditModal();
  };

  return (
    <View style={styles.itemContainer}>
      <Pressable
        style={[styles.checkboxBase, item.checked && styles.checkboxChecked]}
        onPress={() => toggleCheckbox(item.id)}
      >
        {item.checked && <Foundation name="check" size={20} color="white" />}
      </Pressable>
      <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
        {item.name}
      </Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.icon}>
          <FontAwesome6 name="trash-can" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openEditModal} style={styles.icon}>
          <FontAwesome6 name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Item</Text>
            <TextInput
              placeholder="Enter new item name"
              value={editedItemName}
              onChangeText={setEditedItemName}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button title="Update" onPress={updateItem} />
              <Button title="Cancel" onPress={closeEditModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'dodgerblue',
    backgroundColor: 'transparent',
    marginRight: 16,
  },
  checkboxChecked: {
    backgroundColor: 'dodgerblue',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
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

export default ListItem;