// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, FlatList, HStack, IconButton, Divider, navigation, Pressable, View } from 'native-base';
import { Alert, Button, Dimensions, StyleSheet, ScrollView, Modal, Linking, TouchableOpacity, TextInput } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import BadgeComponent from '../../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Timeline from 'react-native-timeline-flatlist';
import CustomButton from '../../../components/UI/button'
import { Component, useEffect, useRef, useState } from 'react';
import Constant from '../../../common/constant';

import Apis from '../../../utils/api';
import { useAuth } from '../../../context/loginContext';

import { imageConstant } from '../../../utils/constant';

import { useNavigation } from '@react-navigation/native';
import { handleToast } from '../../../utils/toast';
const { width } = Dimensions.get('window');


const BookingCardDetail = ({ booking, refresh }) => {



    const navigation = useNavigation()
    const { show } = handleToast();
    const [isLoading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [discount, setDiscount] = useState('');


    const { token } = useAuth();


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

    const submitDiscount = async () => {
        try {
            setLoading(true);

            let data = {
                amount : discount
            }

            let response = await Apis.HttpPostRequest(
                Constant.BASE_URL + Constant.START_BOOKING + booking?._id + '/addDiscount',
                token,
                data
            );

            if (response?.status) {
                setLoading(false);
                setModalVisible(false)
                setDiscount('')
                show(response?.message, 'success');
                refresh()
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    const handleAlert = () => {

        Alert.alert(
            'Check Spare List',
            'Are you sure you have checked the spare list?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => navigation.navigate("OtpVerify", { booking })
                },
            ],
            { cancelable: false }
        );
    };

    const navigate = () => {

        const coordinates = `${booking?.address?.latitude},${booking?.address?.longitude}`;
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
        Linking.openURL(mapUrl);
    }

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



    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: "#edeeec" }}></View>
                <View
                    width="100%"
                    // borderColor="#ffffff"
                    // borderWidth={1}
                    // borderRadius="10px"
                    mb={2}
                    border={0}
                    shadow={0}
                    padding={2}>
                    {/* <View
                        width="100%"
                        bg="#ffffff"
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
                                {
                                    booking?.shareCode &&
                                    <Text fontWeight="500" fontSize="bd_sm" mt={2} lineHeight="20px" color="bd_dark_text">
                                        Share Code
                                    </Text>
                                }
                            </Box>
                            <Box flex={1}>
                            </Box>
                            <Box flex={5} width={width-40}>
                                <Text fontWeight="100" fontSize="bd_sm" lineHeight="50px" color="bd_dark_text" textAlign="right">
                                    <BadgeComponent text={booking?.status} />
                                </Text>
                                {
                                    booking?.shareCode &&
                                    <View style={{ backgroundColor: '#66ff66', padding: 1, borderRadius: 5, width: 70, alignSelf: 'flex-end', marginTop: 10 }}>
                                        <Text fontWeight="600" fontSize={18} lineHeight="20px" color="bd_dark_text" letterSpacing={4} textAlign="center">
                                            {booking?.shareCode}
                                        </Text>
                                    </View>
                                }
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


                            {/* {
                                booking?.shareCode &&
                                <View flexDirection={'row'}
                                    justifyContent={'space-between'}
                                >
                                    <Text fontWeight="500" fontSize="bd_sm" mt={2} lineHeight="20px" color="bd_dark_text">
                                        Auth Code
                                    </Text>

                                    <View style={{ backgroundColor: '#66ff66', padding: 1, borderRadius: 5, width: 70, alignSelf: 'flex-end' }}>
                                        <Text fontWeight="600" fontSize={18} lineHeight="20px" color="bd_dark_text" letterSpacing={4} textAlign="center">
                                            {booking?.shareCode}
                                        </Text>
                                    </View>
                                </View>

                            } */}

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
                        <HStack space={2}>
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
                            {/* Add Ons (Mechanic) */}
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
                                        Additional Services
                                    </Text> */}
                                    {booking?.additionalServices
                                        // .filter(d => d.approved === true)
                                        .map((service, index) => (
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
                            booking?.accessories.length > 0 && (
                                <>
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
                                </>
                            )}


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

                        {
                            (['UPDATED', 'APPROVED', 'IN PROGRESS'].includes(booking?.status) && booking?.spareParts) &&
                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                            >
                                <View
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    // marginTop={2}
                                    // p={3}
                                    alignItems="center"
                                    flexDirection="row"
                                    justifyContent="space-between">
                                    <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                        Spares
                                    </Text>
                                    {/* <CustomButton
                                        onPress={() => navigation.navigate("SpareListScreen", booking?._id)}
                                        btnStyle={{ margin: 0, padding: 0, height: 35, alignSelf: 'flex-end', backgroundColor: '#5349f8' }}
                                        textStyle={{
                                            color: "#fff",
                                            fontWeight: "500",
                                            fontSize: 12,
                                            lineHeight: 12,
                                            padding: 0
                                        }}
                                    >
                                        Add/Edit Spares Images
                                    </CustomButton> */}
                                </View>

                                {booking?.spareParts.map((spareParts, index) => (
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
                                            {index + 1}. {spareParts?.name} {spareParts?.quantity > 1 ? `x ${spareParts?.quantity}` : ''}
                                        </Text>
                                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                            ₹{spareParts?.price}
                                        </Text>
                                    </View>
                                ))}

                            </View>
                        }

                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={5}
                            paddingBottom={2}
                            alignItems="center"
                            flexDirection="row"
                            justifyContent="space-between"
                        >

                            <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="14px" color="bd_dark_text">
                                Grand Total :
                            </Text>
                            <Text fontWeight="500" fontSize="bd_sm" mb={0} color="bd_dark_text">
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
                                {booking?.completed ? 'Total ' : 'Estimated '}
                                     Amount : 
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mb={0} color="bd_dark_text">
                                    ₹{booking?.finalAmount}
                                </Text>
                                </View>
                            }




                    </View>

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
                        booking?.status == 'COMPLETED' && booking?.userRating &&
                        <View
                            width="100%"
                            bg="#ffffff"
                            borderRadius="10px"
                            marginTop={2}
                            p={3}>
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

                </View>
            </ScrollView>

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
                        <Text style={styles.modalTitle}>Withdraw Earnings</Text>

                        <View style={{
                            width: "90%",
                            minHeight: 40,
                            maxHeight: 40,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: 20,
                            borderBottomWidth: 1,
                            borderColor: '#E6E8EC',
                        }}>
                            <Text style={styles.textStyle}>Discount</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="black"
                                keyboardType='numeric'
                                value={discount}
                                onChangeText={setDiscount}
                                maxLength={2}
                            />
                        </View>



                        <View flexDirection={'row'}
                            justifyContent={'space-evenly'}
                            p={3}
                            marginTop={50}
                            width={'100%'}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => submitDiscount()}
                                style={styles.submitButton}>
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* <CustomButton
                onPress={() => navigation.navigate("SpareListScreen", booking?._id)}
                btnStyle={{ margin: 10 }}
                textStyle={{
                    // color: "#ffffff",
                    // fontWeight: "500",
                    // fontSize: 12,
                    // lineHeight: 12,
                    // padding: 0
                }}
            >
                View Spares List
            </CustomButton> */}

            {
                booking?.status == 'ASSIGNED' &&

                <CustomButton
                    onPress={() => navigation.navigate("OtpVerify", { booking })}
                    btnStyle={{ margin: 10 }}>
                    Verify Details
                </CustomButton>

                // <CustomButton
                //     onPress={() => navigation.navigate("OtpVerify", { booking })}
                //     btnStyle={{ margin: 10 }}>
                //     End Service
                // </CustomButton>
            }

            {
                booking?.status == 'VERIFIED' &&

                <CustomButton
                    // onPress={handleAlert}
                    onPress={() => navigation.navigate("InseptionScreen", { booking })}
                    btnStyle={{ margin: 10 }}>
                    Start Service
                </CustomButton>
            }

            {
                booking?.status == 'IN PROGRESS' &&

                <CustomButton
                    onPress={() => navigation.navigate('FinishService', booking?._id)}
                    btnStyle={{ margin: 10 }}>
                    Start Service
                </CustomButton>
            }

            {
                booking?.status == 'APPROVED' &&

                // <CustomButton
                //     onPress={handleAlert}
                //     btnStyle={{ margin: 10 }}>
                //     Enter Auth Code
                // </CustomButton>
                <CustomButton
                    onPress={() => navigation.navigate("OtpVerify", { booking })}
                    btnStyle={{ margin: 10 }}>
                    Enter Auth Code
                </CustomButton>
            }

            {/* {
                booking?.status == 'SERVICE DONE' &&

                <CustomButton
                    onPress={() => navigation.navigate('AddPayment', booking?._id)}
                    btnStyle={{ margin: 10 }}>
                    Add Payment
                </CustomButton>
            } */}

            {
                booking?.status == 'COMPLETED' && !booking?.userRating &&

                <CustomButton
                    onPress={() => navigation.navigate('Rating', booking?._id)}
                    btnStyle={{ margin: 10 }}>
                    Rate & Review User
                </CustomButton>
            }

            {booking?.status === 'SERVICE DONE' && (
                <CustomButton
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }} btnStyle={{ margin: 10, borderRadius: 10 }}>
                    Add Discount
                </CustomButton>
            )}



        </>
    );
};

const styles = StyleSheet.create({
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
        height: 300,
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
        width: '40%',
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
        width: '40%',
        borderColor: '#5349f8',
        borderWidth: 1
      },
      cancelText: {
        color: '#5349f8',
        fontSize: 16,
        fontWeight: 'bold',
      },
      input: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        paddingVertical: 0,
        borderWidth: 0.5,
        borderRadius: 8,
        backgroundColor: '#f4f5f7',
        borderColor: '#e7e7e7',
        padding: 15,
        height: 50,
        marginTop: 5,
      },
      textStyle: {
        color: 'black'
      },
});

export default BookingCardDetail;
