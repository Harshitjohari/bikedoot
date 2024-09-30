// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, TouchableOpacity,navigation, Pressable, View } from 'native-base';
import BadgeComponent from '../../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { imageConstant } from '../../../utils/constant';

import { useNavigation } from '@react-navigation/native';

const BookingCard = ({onCustomPress,booking}) => {
    const navigation = useNavigation()
    const {
        _id,
        name,
        mobile,
        address,
        addOn,
        addOnLength,
        addOnData,
        accessories,
        accLength,
        accData,
        bookingId,
        bikeImage = "https://placehold.jp/150x150.png",
        bikeName,
        status,
        colorScheme,
        date,
        time,
        bookingAmount,
        serviceType,
        mechanic,
        sparePartPermission
    } = booking;

    // console.log('==========>',booking._id)

    let addOnAttr = `Add-on Service:  ${addOn}`
    if(addOnLength > 1){
        addOnAttr = `Add-on Service:  ${addOn}, ${addOnData} + ${addOnLength} more`
    }
    let accsOnAttr = `Accessories:  ${accessories} , ${accData}`
    if(addOnLength > 1){
        accsOnAttr = `Accessories:  ${accessories}, ${accData} + ${accLength} more`
    }


    return (
        
        <Box
            width="100%"
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            shadow={0}>

            <Pressable
            onPress={() => {
                navigation.navigate("BookingsDetails", { id:_id })
                // onCustomPress("BookingsDetails", { id:_id })
            }}
            >
            <View
                width="100%"
                bg="white"
                borderRadius="10px"
                borderBottomRadius="0px"
                p={3}>

                {/* First Row */}
                <HStack space={4}>

                    <Box flex={2.5}>

                        <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="20px" color="bd_dark_text">
                            {name}
                        </Text>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">
                         Mobile - {mobile}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={2} lineHeight="16px" color="bd_dark_text">
                          Address - {address}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                          Service: {serviceType}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                        {addOnAttr}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={2} lineHeight="16px" color="bd_sec_text">
                        {accsOnAttr}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={2} lineHeight="16px" color="bd_dark_text">
                        Estimate Required : {sparePartPermission === false ? 'No' : 'Yes'}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={2} lineHeight="16px" color="bd_dark_text">
                        Mechanic: {mechanic}
                        </Text>



                        <HStack space={1} alignItems="center" mt={1} mb={2}>
                            {/* <FontAwesome5 color="#000" name="rupee-sign" size={14} /> */}
                            <Image source={imageConstant.rupee} alt="" style={{ width: 14, height: 14}} />
                            <Text fontWeight="600" fontSize="bd_md">{bookingAmount}</Text>
                        </HStack>

                        {/* Date and timing */}
                        <HStack space={1} alignItems="center" mt={2}>
                            {/* <FontAwesome color="#7F7F7F" size={12} name="calendar" /> */}
                            <Image source={imageConstant.time} alt="" style={{ width: 14, height: 14 }} />
                            <Text fontSize="bd_xsm" color="bd_sec_text">{date + " at " + time}</Text>
                        </HStack>

                    </Box>

                    <Box flex={1.5} alignItems="flex-end">
                        <Image
                            source={{ uri: bikeImage }}
                            alt="Bike Image"
                            size={"72px"}
                            borderRadius="md"
                            style={{resizeMode:'contain'}}
            
                        />

                        <HStack space={2} alignItems="center" style={{ marginVertical: 5 }}>
                            <BadgeComponent text={bikeName} />
                        </HStack>

                        <HStack space={2} alignItems="center" style={{ marginVertical: 5 }}>
                            <BadgeComponent text={status} colorScheme={colorScheme} />
                        </HStack>
                    </Box>
                </HStack>

                {/* Second Row */}
                <HStack space={3}>
                    {/* Left Column */}
                    <Box>
                    </Box>

                    {/* Right Column */}
                    <Box flex={1} alignItems="flex-end">
                        {/* Any additional content on the right */}
                    </Box>
                </HStack>


            </View>

            <View
                width="100%"
                bg="#F1F0FE"
                borderRadius="10px"
                borderTopRadius="0px"
                p={3}>

                <HStack space={2}>
                    <Box flex={4}>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="14px" color="#616C82">
                            Booking ID : {bookingId}
                        </Text>
                    </Box>
                </HStack>
            </View>
            </Pressable>

            
        </Box>
    );
};

export default BookingCard;
