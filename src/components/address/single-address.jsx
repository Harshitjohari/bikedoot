import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, Pressable } from 'native-base';
import {Alert} from 'react-native';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AddressCard = ({ address, showDeleteIcon = true, onPress, onAddressDeletePressed }) => {
    const { type,
        address1,
        city,
        pincode } = address;

        const handleAlert = () => {
            Alert.alert(
                'Delete Address',
                'Are you sure, you want to delete this address?',
                [
                    {
                        text: 'No',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'Yes', onPress: onAddressDeletePressed },
                ],
                { cancelable: false }
            );
        };

    return (

        <Box
            width="100%"
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            shadow={0}>
            <Pressable onPress={onPress}>
                <Box
                    width="100%"
                    bg="white"
                    borderRadius="10px"
                    // borderBottomRadius="0px"
                    p={3}>

                    {/* First Row */}
                    <HStack space={4}>

                        <Box flex={2.5}>

                            <HStack space={1} alignItems="center" mt={0}>
                                <FontAwesome color="#7F7F7F" size={18}  name="location-arrow" />
                                <Text fontWeight="500" fontSize={17} mb={0} lineHeight="20px" color="bd_dark_text">
                                    {type}
                                </Text>
                            </HStack>

                            <Text fontWeight="500" fontSize={15} mb={2} mt={2} lineHeight="16px" color="bd_sec_text">
                            <FontAwesome color="#ffffff" size={18}  name="location-arrow" /> {address1}
                            </Text>

                            <Text fontWeight="500" fontSize={13} mb={2} lineHeight="16px" color="bd_sec_text">
                            <FontAwesome color="#ffffff" size={18}  name="location-arrow" /> {city}, {pincode}
                            </Text>
                        </Box>

                        {showDeleteIcon && <Pressable onPress={handleAlert}>
                            <Box flex={1.5} alignItems="flex-end">
                                <FontAwesome color="#7F7F7F" size={16} name="trash" />
                            </Box>
                        </Pressable>}
                    </HStack>
                </Box>
            </Pressable>
            {/* <Box
                width="100%"
                bg="#F1F0FE"
                borderRadius="10px"
                borderTopRadius="0px"
                p={3}>

                <Pressable onPress={() => alert("Under construction")}>

                    <HStack space={2}>
                        <Box flex={4}>
                            <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="14px" color="#616C82">
                                Click to Update
                        </Text>
                        </Box>
                    </HStack>
                </Pressable>

            </Box> */}
        </Box>

    );
};

export default AddressCard;
