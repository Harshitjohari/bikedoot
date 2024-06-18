// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, TouchableOpacity, navigation, Pressable, View } from 'native-base';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { imageConstant } from '../../utils/constant';

import { useNavigation } from '@react-navigation/native';

const RevenueCard = ({ revenue }) => {
    const navigation = useNavigation()

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return (

        <Box
        width="100%"
        borderColor="#E1E1E1"
        borderWidth={1}
        borderRadius="10px"
        mb={2}
        shadow={0}
    >
        <Pressable
            onPress={() => {
                navigation.navigate("EarningDetail", { id: revenue?._id })
            }}
        >
            <View
                width="100%"
                bg="white"
                borderRadius="10px"
                borderBottomRadius="0px"
                p={2}
            >
                {/* First Row */}
                <HStack space={4}>
                    <Box flex={1}>
                        {/* Amount */}
                        <HStack justifyContent="space-between" alignItems="center" mt={1} mb={2}>
                            <Text fontWeight="600" fontSize={14} color="grey">Amount :</Text>
                            <HStack space={1} alignItems="center">
                                <Text fontWeight="600" fontSize={14} color="grey">₹{revenue?.amount}</Text>
                            </HStack>
                        </HStack>

                        <HStack justifyContent="space-between" alignItems="center" mb={1}>
                                                <Text fontWeight="500" fontSize={14} color="grey">Transaction Charge :</Text>
                                                <HStack space={1} alignItems="center">
                                                    <Text fontWeight="600" fontSize={14} color="grey">-</Text>
                                                    <Text fontWeight="600" fontSize={14} color="grey">₹{revenue?.txnCharge} ({revenue?.txnRate}%)</Text>
                                                </HStack>
                                            </HStack>
    
                        {/* Platform Fee */}
                        <HStack justifyContent="space-between" alignItems="center" mb={1}>
                            <Text fontWeight="500" fontSize={14} color="grey">Platform Fee :</Text>
                            <HStack space={1} alignItems="center">
                                <Text fontWeight="600" fontSize={14} color="grey">-</Text>
                                <Text fontWeight="600" fontSize={14} color="grey">₹{revenue?.plateformFee}</Text>
                            </HStack>
                        </HStack>

                        <HStack justifyContent="space-between" alignItems="center" mb={1}>
                                                <Text fontWeight="500" fontSize={14} color="grey">Platform Fee Gst :</Text>
                                                <HStack space={1} alignItems="center">
                                                    <Text fontWeight="600" fontSize={14} color="grey">-</Text>
                                                    <Text fontWeight="600" fontSize={14} color="grey">₹{revenue?.plateformFeeGst} ({revenue?.gstRate}%)</Text>
                                                </HStack>
                                            </HStack>

    
                        {/* Revenue */}
                        <HStack justifyContent="space-between" alignItems="center" mb={1}>
                            <Text fontWeight="500" fontSize={16} color="black">Revenue :</Text>
                            <HStack space={1} alignItems="center">
                                <Text fontWeight="600" fontSize={16} color="black">₹{revenue?.revenue}</Text>
                            </HStack>
                        </HStack>
    
                        {/* Date and timing */}
                        <HStack space={1} alignItems="center" mt={1}>
                            <Image source={imageConstant.time} alt="" style={{ width: 14, height: 14 }} />
                            <Text fontSize="bd_xsm" color="bd_sec_text">{formatDate(revenue?.createdAt)}</Text>
                        </HStack>
                    </Box>
                </HStack>
            </View>
    
            <View
                width="100%"
                bg="#F1F0FE"
                borderRadius="10px"
                borderTopRadius="0px"
                p={3}
            >
                <HStack space={2}>
                    <Box flex={4}>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="14px" color="#616C82">
                            Booking ID: {revenue?.bookingId}
                        </Text>
                    </Box>
                </HStack>
            </View>
        </Pressable>
    </Box>
    

    );
};

export default RevenueCard;
