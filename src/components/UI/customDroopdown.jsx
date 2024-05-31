import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const CustomDropdown = ({ data, visible, onClose, onSelect, preSelectedItems }) => {
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    // Update selectedItems when preSelectedItems changes
    setSelectedItems(preSelectedItems || []);
  }, [preSelectedItems]);

  useEffect(() => {
    // Reset search field when dropdown visibility changes
    if (!visible) {
      setSearchValue('');
    }
  }, [visible]);

  const toggleItem = (item) => {
    const selectedIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.key === item.key
    );
    let newItems = [];

    if (selectedIndex === -1) {
      newItems = [...selectedItems, item];
    } else {
      newItems = selectedItems.filter(
        (selectedItem) => selectedItem.key !== item.key
      ); 
    }

    setSelectedItems(newItems);
    onSelect(newItems);
  };

  const filteredData = data.filter(item =>
    item.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
          }}>
          <TextInput
            placeholder="Search..."
            value={searchValue}
            onChangeText={setSearchValue}
            style={{
              borderWidth: 1,
              borderColor: 'lightgray',
              borderRadius: 5,
              padding: 8,
              marginBottom: 10,
            }}
          />
          <ScrollView style={{ maxHeight: 400 }}>
            {filteredData.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => toggleItem(item)}
                style={{
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: 0.5,
                  borderBottomColor: 'lightgray',
                }}>
                <Text style= {{color:'black',fontWeight:'400'}}>{item.value}</Text>
                {selectedItems.find(
                  (selectedItem) => selectedItem.key === item.key
                ) && <Text style={{ marginLeft: 7, color: 'green' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 15, alignSelf: 'center' }}>
            <View style={{ backgroundColor: '#5349f8', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white',fontWeight:'600' }}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default gestureHandlerRootHOC(CustomDropdown);
