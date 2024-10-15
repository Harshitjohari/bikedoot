// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, HStack, IconButton, Pressable, Divider } from 'native-base';
import BadgeComponent from '../../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const BookingCard = ({ booking }) => {
    const navigation = useNavigation()

    const {
        _id,
        bookingId,
        serviceCategory,
        bikeImage = "https://placehold.jp/150x150.png",
        bikeName,
        status,
        colorScheme,
        date,
        time,
        bookingAmount,
        serviceType,
        mechanic,
        shareCode,
        garage
    } = booking;

    return (
        <Box
            width="100%"
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            borderBottomRadius={10}
            // borderTopRadius="0px"
            mb={2}
            shadow={0}>
            <Pressable
                onPress={() => {
                    navigation.navigate("BookingsScreenDetail", { id: _id })
                }}
            >

                <Box
                    width="100%"
                    bg="#F1F0FE"
                    borderRadius="10px"
                    borderBottomRadius={0}
                    p={3}>

                    <HStack space={2}>
                        <Box flex={4}>
                            <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="14px" color="#616C82">
                                Booking ID : {bookingId}
                            </Text>
                        </Box>
                    </HStack>
                </Box>

                <Box
                    width="100%"
                    bg="white"
                    borderRadius="10px"
                    borderTopRadius="0px"
                    p={3}>

                    {/* First Row */}
                    <HStack space={4}>

                        <Box flex={2.5}>

                            <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">
                                {bikeName}
                            </Text>
                            <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                                {serviceType}
                            </Text>

                            <HStack space={1} alignItems="center" mt={1} mb={2}>
                                <FontAwesome5 color="#000" name="rupee-sign" size={14} />
                                <Text fontWeight="600" fontSize="bd_md">{bookingAmount}</Text>
                            </HStack>

                            <Text fontWeight="400" fontSize="bd_sm" mb={2} lineHeight="16px" color="bd_dark_text">
                                Garage: {garage}
                            </Text>

                            <Text fontWeight="400" fontSize="bd_sm" mb={2} lineHeight="16px" color="bd_dark_text">
                                Mechanic: {mechanic}
                            </Text>

                            {
                                shareCode && serviceCategory.name != 'Bike Service at Garage' &&
                                <Text fontWeight="500" fontSize="bd_sm" mt={2} lineHeight="16px" color="bd_dark_text" >
                                    Share Code : {shareCode}
                                </Text>

                            }

                            {/* Date and timing */}
                            <HStack space={1} alignItems="center" mt={3}>
                                <FontAwesome color="#7F7F7F" size={12} name="calendar" />
                                <Text fontSize="bd_xsm" color="bd_sec_text">{date + " at " + time}</Text>
                            </HStack>

                        </Box>

                        <Box flex={1.5} alignItems="flex-end">
                            <Image
                                source={{ uri: bikeImage }}
                                alt="Bike Image"
                                size={"72px"}
                                borderRadius="md"
                                resizeMode='contain'
                            />

                            <HStack space={2} alignItems="center" style={{ marginVertical: 5 }}>
                                <BadgeComponent text={status == 'UPDATED' ? 'Pre Inspection Done' : status} colorScheme={colorScheme} />
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


                </Box>

                {/* <Box
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
                </Box> */}

            </Pressable>


        </Box>
    );
};

export default BookingCard;
