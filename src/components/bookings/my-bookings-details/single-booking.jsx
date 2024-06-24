// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, FlatList, HStack, IconButton, Divider, navigation, Pressable, View } from 'native-base';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Linking,
    Dimensions
} from 'react-native';
import BadgeComponent from '../../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Timeline from 'react-native-timeline-flatlist';
import CustomButton from '../../../components/UI/button'
import { Component, useEffect, useRef, useState } from 'react';
import ImagePreviewModal from '../../../components/UI/image_view';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { handleToast } from '../../../utils/toast';


import { imageConstant } from '../../../utils/constant';

import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');


const BookingCardDetail = ({ booking }) => {

    // console.log('==========>', booking?._id)

    const { token } = useAuth();
    const { show, close, closeAll } = handleToast();
    const navigation = useNavigation()
    const [isLoading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [mechanic, setMechanic] = useState([]);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    // const [checkedItems, setCheckedItems] = useState(mechanic.map(item => ({ _id: item.id, isChecked: false })));

    const handleCheckboxChange = (id) => {
        setSelectedMechanic(id);
    };

    // const isAllChecked = () => {
    //     let checkAll = checkedItems.filter(item => item).length === mechanic.length
    //     return checkAll
    // };

    const handleClosePreview = () => {
        setPreviewVisible(false);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setPreviewVisible(true);
    };

    useEffect(() => {
        fetchMechanicData();
    }, []);

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
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

    const fetchMechanicData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(
                Constant.BASE_URL + Constant.GET_MECHANICS,
                token
            );
            if (response?.status) {
                let fullData = response?.data;
                const mechanicData = fullData.map((item) => ({
                    id: item?._id,
                    name: item?.name,
                }));
                setMechanic(mechanicData);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    const openDialer = (number) => {
        let url = `tel:+91${number}`;
        Linking.openURL(url)
            .then((supported) => {
                if (!supported) {
                    Alert.alert('Error', 'Phone number is not available');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    const handleAssignMechanic = async () => {
        if (selectedMechanic == null) {
            Alert.alert('Error', 'Please select a mechanic');
            return;
        }

        const data = {
            booking_id: booking?._id,
            mechanic_id: selectedMechanic
        };


        setLoading(true)
        let response = await Apis.HttpPostRequest(
            Constant.BASE_URL + Constant.ASSIGN_MECHANIC,
            token,
            data
        );
        // setLoading(false)
        if (response?.status) {
            setModalVisible(false);
            show(response?.message, "success");
            navigation.navigate('Bookings');
        } else {
            show(response?.message || "Failed to send data, try again later", "error");
        }
    };

    // setTimeout(() => {
    //     let data=booking?.timeline.map((event, index) => ({
    //         time: event.updatedOn ? new Date(event.updatedOn) : '',
    //         title: event.title,
    //         status: event.status,
    //         }))

    //         console.log('==============>',data)
    // }, 100);

    // let data = [{ "status": true, "time": '2024-01-22T18:04:20.228Z', "title": "CREATED" }, { "status": true, "time": '2024-01-22T18:04:20.228Z', "title": "ASSIGNED" }, { "status": false, "time": "", "title": "PROCESSING" }, { "status": false, "time": "", "title": "WORKING" }, { "status": false, "time": "", "title": "DONE" }]


    const navigate = () => {

        const coordinates = `${booking?.address?.latitude},${booking?.address?.longitude}`;
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
        Linking.openURL(mapUrl);
    }

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

                        {/* <View
                            width="100%"
                            bg="#F1F0FE"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}
                        >
                            <HStack space={2}>
                                <Box flex={4} width={width-60}>
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Booking ID
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text" width={width-60}>
                                        {booking?.bookingId}
                                    </Text>
                                </Box>
                                <Box flex={1}>
                                </Box>
                                <Box flex={5} width={width-40}>
                                    <Text fontWeight="500" fontSize="bd_sm" lineHeight="50px" color="bd_dark_text" textAlign="right">
                                        <BadgeComponent text={booking?.status} />
                                    </Text>
                                </Box>
                            </HStack>
                        </View> */}

                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}
                        >
                            <Box>
                                <View flexDirection={'row'}
                                    justifyContent={'space-between'}
                                >
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Booking ID
                                    </Text>
                                    <Text fontWeight="600" fontSize="bd_sm" lineHeight="20px" color="bd_dark_text" textAlign="right">
                                        <BadgeComponent text={booking?.status == 'UPDATED' ? 'Pre-Inspection Completed' : booking?.status} />
                                    </Text>
                                </View>
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text" width='140px'>
                                    {booking?.bookingId}
                                </Text>
                            </Box>
                        </View>

                        <View
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
                                {formatDate(booking?.date) + " at " + booking?.time}
                            </Text>
                        </View>

                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}>
                            <HStack space={2}>
                                <Box flex={4}>
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Service Category
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        {booking?.serviceCategory?.name}
                                    </Text>
                                </Box>
                            </HStack>
                        </View>

                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}>
                            <HStack space={3}>
                                <Box flex={4}>
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Customer
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={2} lineHeight="20px" color="bd_sec_text">
                                        Name : {booking?.user?.name}
                                    </Text>
                                    <HStack alignItems="center" space={2}>
                                        <Text fontWeight="500" fontSize="bd_xsm" lineHeight="20px" color="bd_sec_text">
                                            Mobile No. : {booking?.user?.mobile}
                                        </Text>
                                        <TouchableOpacity onPress={() => openDialer(booking?.user?.mobile)}>
                                            <Image
                                                source={imageConstant.phoneCall}
                                                alt="Phone Icon"
                                                size={"18px"}
                                                borderRadius="md"
                                            />
                                        </TouchableOpacity>
                                    </HStack>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} mt={1} lineHeight="20px" color="bd_sec_text">
                                        Address : {booking?.address?.address}
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        City : {booking?.address?.city?.name}, Pincode : {booking?.address?.pincode}
                                    </Text>
                                </Box>
                                {/* <TouchableOpacity style={{right:15,top:10}} onPress={navigate}>
                                    <Image
                                        source={imageConstant.navigate}
                                        alt="Phone Icon"
                                        size={"25px"}
                                        borderRadius="md"
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity> */}
                                <CustomButton btnStyle={{ height: "35%" }} textStyle={{ fontSize: 12, fontWeight: 500 }} onPress={navigate}>Navigate</CustomButton>
                            </HStack>
                        </View>

                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                        >
                            <View
                                flexDirection={'row'}
                                justifyContent={'space-between'}
                                p={3}
                            >
                                <View>
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Bike
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Modal : {booking?.bike?.name}
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        CC : {booking?.bike?.cc?.to}
                                    </Text>
                                </View>
                                <View>
                                    <Image
                                        source={{ uri: booking?.bike?.icon }}
                                        alt="Bike Image"
                                        size={"72px"}
                                        background={"gray.200"}
                                        borderRadius="md"
                                    />
                                </View>
                            </View>
                        </View>

                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}
                        >
                            <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                Services
                            </Text>
                            {booking?.services
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
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            {index + 1}. {service?.service?.service?.name}
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            ₹{service?.price}
                                        </Text>
                                    </View>
                                ))}

                            <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                Additional Services
                            </Text>

                            {
                                booking?.services.length > 1 && (
                                    <>
                                        {/* <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                            Add Ons (User)
                                        </Text> */}
                                        {booking?.services
                                            .filter(service => service?.service?.service?.serviceType?.name === "Add-On")
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
                                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                                        {index + 1}. {service?.service?.service?.name}
                                                    </Text>
                                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                                        ₹{service?.price}
                                                    </Text>
                                                </View>
                                            ))}
                                    </>
                                )
                            }

                            {
                                booking?.additionalServices.length > 0 && (
                                    <>
                                        {/* <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                            Add Ons (Mechanic)
                                        </Text> */}
                                        {booking?.additionalServices.map((service, index) => (
                                            <View
                                                key={index}
                                                width="100%"
                                                bg="#ffffff"
                                                borderRadius="10px"
                                                // marginTop={2}
                                                // p={3}
                                                alignItems="center"
                                                flexDirection="row"
                                                justifyContent="space-between"
                                            >
                                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                                    {index + 1}. {service?.service?.service?.name}
                                                </Text>
                                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                                    ₹{service?.price}
                                                </Text>
                                            </View>
                                        ))}
                                    </>
                                )
                            }

                            {
                                booking?.spareParts &&
                                <View
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    marginTop={2}
                                >
                                    <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                        Spares
                                    </Text>
                                    {booking?.spareParts.map((spareParts, index) => (
                                        <View
                                            key={index}
                                            width="100%"
                                            bg="#ffffff"
                                            borderRadius="10px"
                                            alignItems="center"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                        >
                                            <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                                {index + 1}. {spareParts?.name}
                                            </Text>
                                            <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                                ₹{spareParts?.price}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            }


                            <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                Accessories
                            </Text>
                            {booking?.accessories.map((accessory, index) => (
                                <View
                                    key={index}
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    // marginTop={2}
                                    // p={3}
                                    alignItems="center"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                >
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        {index + 1}. {accessory?.accessories?.accessories?.name}
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        ₹{accessory?.price}
                                    </Text>
                                </View>
                            ))}

                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={4}
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                            >
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    Spare Part Permission :
                                </Text>
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    {booking?.sparePartPermission == false ? 'No' : 'Yes'}
                                </Text>
                            </View>

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
                                    Grand Total :
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mb={0}  color="bd_dark_text">
                                    ₹{booking?.amount}
                                </Text>
                            </View>

                            {
                                booking?.bikedootDiscount &&
                                <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={3}
                                paddingBottom={1}
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                            >

                                <Text fontWeight="500" fontSize={12} mb={0} lineHeight="14px" color="bd_sec_text">
                                    {booking?.bikedootDiscount?.title}
                                </Text>
                                <Text fontWeight="500" fontSize={12} mb={0} color="bd_sec_text">
                                    - ₹{booking?.bikedootDiscount?.amount}
                                </Text>
                                </View>
                            }

                            {
                                booking?.garageDiscount &&
                                <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                                paddingBottom={1}
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                            >

                                <Text fontWeight="500" fontSize={12} mb={0} lineHeight="14px" color="bd_sec_text">
                                    {booking?.garageDiscount?.title}
                                </Text>
                                <Text fontWeight="500" fontSize={12} mb={0} color="bd_sec_text">
                                    - ₹{booking?.garageDiscount?.amount}
                                </Text>
                                </View>
                            }

                            {
                                booking?.finalAmount &&
                                <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                                paddingBottom={1}
                                alignItems="center"
                                flexDirection="row"
                                justifyContent="space-between"
                            >

                                <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="14px" color="bd_dark_text">
                                  Total Amount :
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mb={0} color="bd_dark_text">
                                    ₹{booking?.finalAmount}
                                </Text>
                                </View>
                            }


                        </View>

                        {
                            booking?.mechanics &&
                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                            >
                                <View
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    p={3}
                                >
                                    <View>
                                        <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                            Mechanic
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            Name : {booking?.mechanics?.name}
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            Mobile : {booking?.mechanics?.mobile}
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            Experience : {booking?.mechanics?.experience} Years
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            Specialist Bikes : {booking?.mechanics?.specialistBike.map(bike => bike.name).join(', ')}
                                        </Text>
                                    </View>
                                    <View>
                                        <Image
                                            source={{ uri: booking?.mechanics?.profile }}
                                            alt="Mechanic Image"
                                            size={"72px"}
                                            borderRadius="lg"
                                            mt={6}
                                        />
                                    </View>
                                </View>
                            </View>
                        }

                        {
                            booking?.paymentDetails &&
                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                                p={3}
                            >

                                <View>
                                    <Text fontWeight="500" fontSize="bd_sm" mb={2} lineHeight="18px" color="bd_dark_text">
                                        Payment Details
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Transaction Id : {booking?.paymentDetails?.order_id}
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Payment Date & Time : {formatDate2(booking?.paymentDetails?.created_at)}
                                    </Text>
                                </View>
                            </View>


                        }


                        {
                            booking?.status == 'COMPLETED' && booking?.garageRating &&
                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                                p={3}>
                                <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                    Ratings
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                    Garage
                                </Text>
                                <HStack space={2}>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Rating :
                                    </Text>
                                    <Rating
                                        type='custom'
                                        imageSize={14}
                                        readonly
                                        startingValue={booking?.garageRating}
                                        ratingColor='#F17339'
                                        tintColor={'#FFF'}
                                        style={{ padding: 0, alignSelf: 'center' }}
                                    />
                                </HStack>
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    Review : <Text color="darkText">{booking?.garageReview}</Text>
                                </Text>

                                <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                    BikeDooT
                                </Text>
                                <HStack space={2}>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Rating :
                                    </Text>
                                    <Rating
                                        type='custom'
                                        imageSize={14}
                                        readonly
                                        startingValue={booking?.bikedootRating}
                                        ratingColor='#F17339'
                                        tintColor={'#FFF'}
                                        style={{ padding: 0, alignSelf: 'center' }}
                                    />
                                </HStack>
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    Review : <Text color="darkText">{booking?.bikedootReview}</Text>
                                </Text>

                                <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                    Mechanic
                                </Text>
                                <HStack space={2}>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Rating :
                                    </Text>
                                    <Rating
                                        type='custom'
                                        imageSize={14}
                                        readonly
                                        startingValue={booking?.mechanicsRating}
                                        ratingColor='#F17339'
                                        tintColor={'#FFF'}
                                        style={{ padding: 0, alignSelf: 'center' }}
                                    />
                                </HStack>
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    Review : <Text color="darkText">{booking?.mechanicsReview}</Text>
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                    User
                                </Text>
                                <HStack space={2}>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        Rating :
                                    </Text>
                                    <Rating
                                        type='custom'
                                        imageSize={14}
                                        readonly
                                        startingValue={booking?.userRating}
                                        ratingColor='#F17339'
                                        tintColor={'#FFF'}
                                        style={{ padding: 0, alignSelf: 'center' }}
                                    />
                                </HStack>
                                <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    Review : <Text color="darkText">{booking?.userReview}</Text>
                                </Text>

                            </View>


                        }
                    </Box>
                </View>
            </ScrollView>

            {
                booking?.status === 'CREATED' && (
                    <>
                        {mechanic.length > 0 ?
                            (
                                <CustomButton onPress={() => setModalVisible(!modalVisible)} btnStyle={{ margin: 10 }}>
                                    Assign Mechanic
                                </CustomButton>
                            )
                            :
                            (
                                <CustomButton onPress={() => navigation.navigate('MechanicAdd', { from: 'booking', id: booking?._id })} btnStyle={{ margin: 10 }}>
                                    No mechanic, click to add !!
                                </CustomButton>
                            )}
                    </>
                )
            }






            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Select Mechanic</Text>

                        <ScrollView style={styles.scrollView}>
                            <View style={styles.checkboxContainer}>
                                {mechanic.map((item, index) => (
                                    <View key={index} style={styles.checkboxRow}>
                                        <TouchableOpacity
                                            onPress={() => handleCheckboxChange(item.id)}
                                            style={styles.checkboxItem}
                                        >
                                            <View style={[styles.checkbox, { backgroundColor: selectedMechanic === item.id ? 'transparent' : 'transparent' }]}>
                                                {selectedMechanic === item.id && <Text style={styles.checkmark}>&#x2713;</Text>}
                                            </View>
                                            <Text style={styles.checkboxText}>{item.name}</Text>
                                        </TouchableOpacity>
                                        {index % 2 === 0 && index !== mechanic.length - 1 && <View style={{ width: 20 }} />}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <View flexDirection={'row'}
                            justifyContent={'space-evenly'}
                            p={3}
                            marginTop={0}
                            width={'100%'}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleAssignMechanic}
                                style={styles.submitButton}>
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginBottom: 0,
        width: "100%"
    },
    modalView: {
        position: 'absolute',
        backgroundColor: 'white',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
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
        width: '100%',
        height: 700,
        bottom: 0
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black'
    },
    submitButton: {
        backgroundColor: '#5349f8',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '43%',
        // marginTop: 40
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'white',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        // marginTop: 10,
        width: '43%',
        borderColor: '#5349f8',
        borderWidth: 1
    },
    cancelText: {
        color: '#5349f8',
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        // marginBottom:10
    },
    checkboxContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 8,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '60%',
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 4,
        borderWidth: 2,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#5349f8'
    },
    checkmark: {
        fontSize: 20,
        color: 'green',
    },
    checkboxText: {
        fontSize: 15,
        color: 'black'
    },
});
export default BookingCardDetail;
