import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, Pressable } from 'native-base';
import {Alert} from 'react-native';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AddressCard = ({ showAddedButton = true, width = "undefined", index, vehicleData, onVehicleDelete, showDelete = true, onVehiclePressed, selectedBikeIndex }) => {
    const {
        name,
        image,
        brand,
        cc
    } = vehicleData;

    const handleAlert = () => {
        Alert.alert(
            'Delete Vehichle',
            'Are you sure, you want to delete this vehichle?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: onVehicleDelete },
            ],
            { cancelable: false }
        );
    };
    return (
        <Box
            flex={1}
            width={width}
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            flexWrap="wrap"
            justifyContent="space-between"
            rowGap={1}
            shadow={0}
            m={0.5}>
            <Box
                width="100%"
                bg="white"
                borderRadius="10px"
                borderBottomRadius={showAddedButton ? "0px" : "10px"}
                p={3}>

                {/* First Row */}
                <HStack space={0}
                    alignSelf="center"
                    alignItems="center"
                    justifyContent="center">
                    <Box bg="white" p={0} borderRadius="10px" borderWidth={0} borderColor="gray.200" shadow={0.8} mr={0}
                        // alignSelf="center"
                        alignItems="center"
                        justifyContent="space-between"
                        flexDirection={'coloumn'}
                        width={'90%'}
                    >

                        

                        {/* Round Box */}
                        <Box
                            bg="#ffffff"
                            borderRadius="full"
                            width={20}
                            height={20}
                            alignSelf="center"
                            alignItems="center"
                            justifyContent="center">
                            {/* Image Icon */}
                            <Image style={{
                                resizeMode: "contain"
                            }} alignItems="center" textAlign="center" source={{ uri: image }} alt="Icon" width={20} height={20} />
                        </Box>

                        <Box  flexDirection={'coloumn'}>


                        <Text numberOfLines={2} fontSize={16} mt={1} fontWeight={800}>
                            {name} 
                            
                        </Text>
                        <Text numberOfLines={2} fontSize="bd_xsm" color="bd_sec_text"  mt={0} fontWeight={600}>
                            {brand}
                        </Text>
                        </Box>


                    </Box>
                </HStack>
            </Box>

            {showDelete ? <Box
                width="100%"
                bg="#F1F0FE"
                borderRadius="10px"
                borderTopRadius="0px"
                p={3}>
                <HStack space={2}>
                    <Box flex={4}>
                        {/* <Pressable onPress={onVehicleDelete}> */}
                        <Pressable onPress={handleAlert}>
                            <Box flex={1.5} alignItems="flex-end">
                                <FontAwesome color="#7F7F7F" size={16} name="trash" />
                            </Box>
                        </Pressable>
                    </Box>
                </HStack>

            </Box> :

                showAddedButton && <Pressable onPress={onVehiclePressed}>
                    <Box
                        width="100%"
                        bg={selectedBikeIndex === index ? "#0da687" : "#5349f8"}
                        borderRadius="10px"
                        borderTopRadius="0px"
                        p={3}>
                        <HStack space={2}>
                            <Box flex={4}>
                                <Box flex={1.5} alignItems="center">
                                    {/* <FontAwesome color="#7F7F7F" size={16} name="trash" /> */}
                                    <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={0} color="#FFF">
                                        {selectedBikeIndex === index ? "Bike Selected" : "Select"}
                                    </Text>
                                </Box>
                            </Box>
                        </HStack>
                    </Box>
                </Pressable>

            }
        </Box>
    );
};

export default AddressCard;
