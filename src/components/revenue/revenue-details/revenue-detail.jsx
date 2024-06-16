// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, FlatList, HStack, IconButton, Divider, navigation, Pressable, View } from 'native-base';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import { Component, useEffect, useRef, useState } from 'react';

import { useAuth } from '../../../context/loginContext';
import { handleToast } from '../../../utils/toast';


import { imageConstant } from '../../../utils/constant';

import { useNavigation } from '@react-navigation/native';

const RevenueCardDetail = ({ revenue }) => {


    const { token, userData } = useAuth();
    const { show, close, closeAll } = handleToast();
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

    const formatDate2 = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const calculateTotalGST = () => {
        let totalGST = 0;

        revenue?.booking?.services.forEach(service => {
            totalGST += (service?.price * 18) / 100;
        });

        revenue?.booking?.additionalServices.forEach(service => {
            totalGST += (service?.price * 18) / 100;
        });

        revenue?.booking?.spareParts.forEach(sparePart => {
            totalGST += (sparePart?.price * sparePart?.gstRate) / 100;
        });

        revenue?.booking?.accessories.forEach(accessory => {
            totalGST += (accessory?.price * accessory?.accessories?.accessories?.gstRate) / 100;
        });

        return totalGST.toFixed(2);  // Limit to two decimal places for currency
    };

    const totalGST = calculateTotalGST();

    return (
        <>
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
                    <Box
                        width="100%"
                        // borderColor="#ffffff"
                        // borderWidth={1}
                        // borderRadius="10px"
                        border={0}
                        shadow={0}
                        padding={2}
                        paddingBottom={0}>

                        <Box
                            width="100%"
                            borderColor="#E1E1E1"
                            borderWidth={1}
                            borderRadius="10px"
                            mb={2}
                            shadow={0}
                        >
                            <View
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

                                            {/* Platform Fee */}
                                            <HStack justifyContent="space-between" alignItems="center" mb={1}>
                                                <Text fontWeight="500" fontSize={14} color="grey">Platform Fee :</Text>
                                                <HStack space={1} alignItems="center">
                                                    <Text fontWeight="600" fontSize={14} color="grey">-</Text>
                                                    <Text fontWeight="600" fontSize={14} color="grey">₹{revenue?.plateformFee}</Text>
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
                            </View>
                        </Box>

                        {/* <View
                            width="100%"
                            bg="#F1F0FE"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}
                        >
                            <HStack space={2}>
                                <Box flex={4}>
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Booking ID
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        {revenue?.bookingId}
                                    </Text>
                                </Box>
                                <Box flex={1}>
                                </Box>
                            </HStack>
                        </View> */}

                        {/* <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}
                            flexDirection="row"
                            alignItems="center"
                        >
                            <Image source={imageConstant.time} alt="" style={{ width: 14, height: 14 }} />
                            <Text fontSize="bd_xsm" color="bd_sec_text" marginLeft={2}>
                                {formatDate(revenue?.createdAt)}
                            </Text>
                        </View> */}


                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}
                        >
                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                                marginBottom={2}
                            >
                                <Text
                                    fontWeight="500"
                                    fontSize="bd_xsm"
                                    mb={1}
                                    lineHeight="20px"
                                    color="bd_sec_text"
                                    style={{ flex: 1 }}
                                >
                                    Name
                                </Text>
                                <Text
                                    fontWeight="500"
                                    fontSize="bd_xsm"
                                    mb={1}
                                    lineHeight="20px"
                                    color="bd_sec_text"
                                    style={{ width: 80, textAlign: 'right' }}
                                >
                                    Price
                                </Text>
                                {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                    <Text
                                        fontWeight="500"
                                        fontSize="bd_xsm"
                                        mb={1}
                                        lineHeight="20px"
                                        color="bd_sec_text"
                                        style={{ width: 100, textAlign: 'right' }}
                                    >
                                        Gst
                                    </Text>
                                )}
                            </View>
                            <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                Services
                            </Text>
                            {revenue?.booking?.services
                                .filter(service => service?.service?.service?.serviceType?.name === "Service")
                                .map((service, index) => (
                                    <View
                                        key={index}
                                        width="100%"
                                        bg="#ffffff"
                                        borderRadius="10px"
                                        alignItems="center"
                                        flexDirection="row"
                                        justifyContent="space-between"
                                    >
                                        <Text
                                            fontWeight="500"
                                            fontSize="bd_xsm"
                                            mb={1}
                                            lineHeight="20px"
                                            color="bd_sec_text"
                                            style={{ flex: 1 }}
                                        >
                                            {index + 1}. {service?.service?.service?.name}
                                        </Text>
                                        <Text
                                            fontWeight="500"
                                            fontSize="bd_xsm"
                                            mb={1}
                                            lineHeight="20px"
                                            color="bd_sec_text"
                                            style={{ width: 80, textAlign: 'right' }}
                                        >
                                            ₹{service?.price}
                                        </Text>
                                        {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                            <Text
                                                fontWeight="500"
                                                fontSize="bd_xsm"
                                                mb={1}
                                                lineHeight="20px"
                                                color="bd_sec_text"
                                                style={{ width: 100, textAlign: 'right' }}
                                            >
                                                ₹{(service?.price * 18) / 100} (18%)
                                            </Text>
                                        )}
                                    </View>
                                ))}

                            <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                Additional Services
                            </Text>

                            {revenue?.booking?.services.length > 1 && (
                                <>
                                    {/* <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                        Add Ons (User)
                                    </Text> */}
                                    {revenue?.booking?.services
                                        .filter(service => service?.service?.service?.serviceType?.name === "Add-On").map((service, index) => (
                                            <View
                                                key={index}
                                                width="100%"
                                                bg="#ffffff"
                                                borderRadius="10px"
                                                alignItems="center"
                                                flexDirection="row"
                                                justifyContent="space-between"
                                            >
                                                <Text
                                                    fontWeight="500"
                                                    fontSize="bd_xsm"
                                                    mb={1}
                                                    lineHeight="20px"
                                                    color="bd_sec_text"
                                                    style={{ flex: 1 }}
                                                >
                                                    {index + 1}. {service?.service?.service?.name}
                                                </Text>
                                                <Text
                                                    fontWeight="500"
                                                    fontSize="bd_xsm"
                                                    mb={1}
                                                    lineHeight="20px"
                                                    color="bd_sec_text"
                                                    style={{ width: 80, textAlign: 'right' }}
                                                >
                                                    ₹{service?.price}
                                                </Text>
                                                {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                                    <Text
                                                        fontWeight="500"
                                                        fontSize="bd_xsm"
                                                        mb={1}
                                                        lineHeight="20px"
                                                        color="bd_sec_text"
                                                        style={{ width: 100, textAlign: 'right' }}
                                                    >
                                                        ₹{(service?.price * 18) / 100} (18%)
                                                    </Text>
                                                )}
                                            </View>
                                        ))}
                                </>
                            )}

                            {revenue?.booking?.additionalServices.length > 0 && (
                                <>
                                    {/* <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                        Add Ons (Mechanic)
                                    </Text> */}
                                    {revenue?.booking?.additionalServices.map((service, index) => (
                                        <View
                                            key={index}
                                            width="100%"
                                            bg="#ffffff"
                                            borderRadius="10px"
                                            alignItems="center"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                        >
                                            <Text
                                                fontWeight="500"
                                                fontSize="bd_xsm"
                                                mb={1}
                                                lineHeight="20px"
                                                color="bd_sec_text"
                                                style={{ flex: 1 }}
                                            >
                                                {index + 1}. {service?.service?.service?.name}
                                            </Text>
                                            <Text
                                                fontWeight="500"
                                                fontSize="bd_xsm"
                                                mb={1}
                                                lineHeight="20px"
                                                color="bd_sec_text"
                                                style={{ width: 80, textAlign: 'right' }}
                                            >
                                                ₹{service?.price}
                                            </Text>
                                            {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                                <Text
                                                    fontWeight="500"
                                                    fontSize="bd_xsm"
                                                    mb={1}
                                                    lineHeight="20px"
                                                    color="bd_sec_text"
                                                    style={{ width: 100, textAlign: 'right' }}
                                                >
                                                    ₹{(service?.price * 18) / 100} (18%)
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}

                            {revenue?.booking?.spareParts && (
                                <View
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    marginTop={2}
                                >
                                    <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                        Spares
                                    </Text>
                                    {revenue?.booking?.spareParts.map((spareParts, index) => (
                                        <View
                                            key={index}
                                            width="100%"
                                            bg="#ffffff"
                                            borderRadius="10px"
                                            alignItems="center"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            padding={1}
                                        >
                                            <Text
                                                fontWeight="500"
                                                fontSize="bd_xsm"
                                                mb={1}
                                                lineHeight="20px"
                                                color="bd_sec_text"
                                                style={{ flex: 1 }}
                                            >
                                                {index + 1}. {spareParts?.name}
                                            </Text>
                                            <Text
                                                fontWeight="500"
                                                fontSize="bd_xsm"
                                                mb={1}
                                                lineHeight="20px"
                                                color="bd_sec_text"
                                                style={{ width: 80, textAlign: 'right' }}
                                            >
                                                ₹{spareParts?.price}
                                            </Text>
                                            {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                                <Text
                                                    fontWeight="500"
                                                    fontSize="bd_xsm"
                                                    mb={1}
                                                    lineHeight="20px"
                                                    color="bd_sec_text"
                                                    style={{ width: 100, textAlign: 'right' }}
                                                >
                                                    ₹{(spareParts?.price * spareParts?.gstRate) / 100} ({spareParts?.gstRate}%)
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}

                            <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                Accessories
                            </Text>
                            {revenue?.booking?.accessories.map((accessory, index) => (
                                <View
                                    key={index}
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    alignItems="center"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                >
                                    <Text
                                        fontWeight="500"
                                        fontSize="bd_xsm"
                                        mb={1}
                                        lineHeight="20px"
                                        color="bd_sec_text"
                                        style={{ flex: 1 }}
                                    >
                                        {index + 1}. {accessory?.accessories?.accessories?.name}
                                    </Text>
                                    <Text
                                        fontWeight="500"
                                        fontSize="bd_xsm"
                                        mb={1}
                                        lineHeight="20px"
                                        color="bd_sec_text"
                                        style={{ width: 80, textAlign: 'right' }}
                                    >
                                        ₹{accessory?.price}
                                    </Text>
                                    {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                        <Text
                                            fontWeight="500"
                                            fontSize="bd_xsm"
                                            mb={1}
                                            lineHeight="20px"
                                            color="bd_sec_text"
                                            style={{ width: 100, textAlign: 'right' }}
                                        >
                                            ₹{(accessory?.price * accessory?.accessories?.accessories?.gstRate) / 100} ({accessory?.accessories?.accessories?.gstRate}%)
                                        </Text>
                                    )}
                                </View>
                            ))}

                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={5}
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                            >
                                <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="14px" color="bd_dark_text">
                                    Total amount :
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="14px" color="bd_dark_text" style={{ width: 80, textAlign: 'right', flex: 1 }}>
                                    ₹{revenue?.booking?.amount}
                                </Text>
                                {userData.garage.firmRegistered === true && userData.garage.firmGstNo !== '' && (
                                    <Text
                                        fontWeight="500"
                                        fontSize="bd_xsm"
                                        mb={1}
                                        lineHeight="20px"
                                        color="bd_dark_text"
                                        style={{ width: 100, textAlign: 'right' }}
                                    >
                                        ₹{totalGST}
                                    </Text>
                                )}
                            </View>

                            {
                                revenue?.booking?.paymentDetails &&
                                <View
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    marginTop={5}
                                >

                                    <View>
                                        <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                            Payment Details
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            Transaction Id : {revenue?.booking?.paymentDetails?.order_id}
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            Payment Date & Time : {formatDate2(revenue?.booking?.paymentDetails?.created_at)}
                                        </Text>
                                    </View>
                                </View>


                            }
                        </View>
                    </Box>
                </View>
            </ScrollView>
        </>
    );
};

export default RevenueCardDetail;
