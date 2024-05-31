import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker, Icon, Input } from "native-base";
import { RadioButton } from "react-native-paper";
import CommonStyle from '../../assets/style'
import CustomButton from '../UI/button'
import FlatListContainer from '../flatlist';
import AccessoriesCard from '../accessories/single-accessories-modal';
import { Box, Text, Divider, VStack, HStack } from 'native-base';

const addAccessories = ({ data, setSelectedAccessories, closeBottomSheet }) => {

    const onItemPressed = (item, index) => {
        setSelectedAccessories(prevItems => [...prevItems, item]);
        closeBottomSheet();
    };

    const renderItem = ({ item, index }) => <AccessoriesCard onPress={() => onItemPressed(item, index)} data={item} />;
    return (
        <Box p={5} flex={1} mb={12}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={2} mb={4}>
                    <VStack space={2} mb={4}>
                        <HStack mb={3}>
                            <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                                Select Accessories
                    </Text>
                            <CustomButton onPress={closeBottomSheet} btnStyle={{ height: 30, width: "20%", position: "absolute", right: 0, top: 0, borderRadius: 0, paddingTop: 4 }} textStyle={{ fontSize: 12 }}>Next</CustomButton>
                        </HStack>
                        <Divider />
                        <FlatListContainer
                            keyExtractor={(item) => item._id}
                            emptyMessage="No accessories found"
                            containerStyle={{ margin: 0 }}
                            data={data}
                            numColumns={2}
                            contentContainerStyle={{ padding: 0 }}
                            isLoading={false}
                            renderItem={renderItem} // Pass the renderItem function as a prop
                        />
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>

    );
};

export default addAccessories;
