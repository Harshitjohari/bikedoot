import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker, Icon, Input } from "native-base";
import { RadioButton } from "react-native-paper";
import CommonStyle from '../../assets/style'
import CustomButton from '../UI/button'
import FlatListContainer from '../flatlist';
import ServiceCard from '../bookings/services-list/single-service';
import { Box, Text, Divider, VStack, HStack } from 'native-base';

const SelectAddOns = ({ data, setSelectedAddOns,setData, closeBottomSheet }) => {


    const onItemPressed = (item, index) => {
        // Create a new array to avoid directly modifying the state
        const updatedServices = [...data];
        // Update the is_selected property based on the _id
        updatedServices.forEach((booking, i) => {
            if (booking._id === item._id) {
                updatedServices[i].is_selected = true;
            } 
            // setSelectedServices(updatedServices[i]);
        });
        setSelectedAddOns(updatedServices.filter(service => service.is_selected))
        setData(updatedServices);
    };

    const onItemRemoved = (item, index) => {
         // Create a new array to avoid directly modifying the state
         const updatedServices = [...data];
         // Update the is_selected property based on the _id
         updatedServices.forEach((booking, i) => {
             if (booking._id === item._id) {
                 updatedServices[i].is_selected = false;
             } 
             // setSelectedServices(updatedServices[i]);
         });

         setSelectedAddOns(updatedServices.filter(service => service.is_selected))
         // Update the state with the modified array
         setData(updatedServices);
    };

    const renderItem = ({ item, index }) => <ServiceCard showRemoveBtn={true} itemRemovedBtnPressed={()=> onItemRemoved(item,index)} onPress={() => onItemPressed(item, index)} booking={item} />;

    return (
        <Box p={5} flex={1} mb={4}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={2} mb={0}>
                    <VStack space={2} mb={0}>
                        <HStack mb={3}>
                            <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                                Select Addons
                    </Text>
                            <CustomButton onPress={closeBottomSheet} btnStyle={{ height: 30, width: "10%", position:"absolute",right:0,top:0,borderRadius:0,paddingTop:4 }} textStyle={{fontSize:12}}>X</CustomButton>
                        </HStack>
                        <Divider />
                        <FlatListContainer
                            emptyMessage="No addons found"
                            containerStyle={{ margin: 0 }}
                            data={data}
                            isLoading={false}
                            renderItem={renderItem} // Pass the renderItem function as a prop
                        />
                    </VStack>
                </VStack>
            </ScrollView>
            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
            <CustomButton
                onPress={closeBottomSheet}
                btnStyle={{
                    height: 40,
                    // width: "25%",
                    left: 0,
                    top: 20,
                    borderRadius: 20,
                    justifyContent: 'center',
                }}
                textStyle={{
                    fontSize: 17,
                    textAlign: 'center',
                    fontWeight:500
                }}
            >
                Next
            </CustomButton>
            </View>

        </Box>

    );
};

export default SelectAddOns;
