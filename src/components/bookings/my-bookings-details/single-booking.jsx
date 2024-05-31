// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, ScrollView, FlatList, HStack, IconButton, Divider,VStack, navigation, Pressable, View } from 'native-base';
import { TouchableOpacity, Alert, Modal,StyleSheet } from 'react-native';

import BadgeComponent from '../../UI/badges'
import { Rating, AirbnbRating } from 'react-native-ratings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Timeline from 'react-native-timeline-flatlist';
import CustomButton from '../../../components/UI/button'
import { Component, useEffect, useRef, useState } from 'react';
import ImagePreviewModal from '../../../components/UI/image_view';


import { imageConstant } from '../../../utils/constant';

import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuth } from '../../../context/loginContext';
import Apis from '../../../utils/api';
import Constant from '../../../common/constant';
import Ratings from '../../UI/rating';
import { handleToast } from '../../../utils/toast';

const BookingCardDetail = ({ booking,refresh }) => {


    const navigation = useNavigation()
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [garageData, setGarageData] = useState([]);
    const [selectedDateIndex, setSelectedDateIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);



    const { token,userData } = useAuth();
    const { show, close, closeAll } = handleToast();

    useEffect(() => {
        fetchGarageData();
      }, []);

    const handleClosePreview = () => {
        setPreviewVisible(false);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setPreviewVisible(true);
    };

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

    // setTimeout(() => {
    //     let data=booking?.timeline.map((event, index) => ({
    //         time: event.updatedOn ? new Date(event.updatedOn) : '',
    //         title: event.title,
    //         status: event.status,
    //         }))

    //         console.log('==============>',data)
    // }, 100);

    // let data = [{ "status": true, "time": '2024-01-22T18:04:20.228Z', "title": "CREATED" }, { "status": true, "time": '2024-01-22T18:04:20.228Z', "title": "ASSIGNED" }, { "status": false, "time": "", "title": "PROCESSING" }, { "status": false, "time": "", "title": "WORKING" }, { "status": false, "time": "", "title": "DONE" }]

    const fetchGarageData = async () => {
        try {
          let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.AUTH.GURAGE_DEATIL_API +  booking?.garage?._id , token)
          if (response ?.status) {
            setGarageData(response.data)
            const dates = garageData.availableDates                
            const index = dates.indexOf(booking.date);
            // console.log('123=============++>',index);

            setSelectedDateIndex(index+1)              
          } else {
            // show(response ?.message || "Failed to send OTP, try again later");
          }
        } catch (e) {
          // show("Some error has occured!");
        }
    };

    const createOrder = async () => {
        try {
            let data = {
                bookingId: booking?._id
            }

            let response = await Apis.HttpPostRequest(
                Constant.BASE_URL + '/api/user/payment/createOrder',
                token,
                data
            );
            // console.log('create order=========>',response)
            if (response?.status) {
                return response.data
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    };

    const handlePayment = async () => {
        const order = await createOrder();

        if (!order) {
            Alert.alert('Error', 'Failed to create order');
            return;
        }

        const options = {
            description: 'Test Transaction',
            image: 'http://bikedoot.s3-website.eu-north-1.amazonaws.com/static/media/logo.dd715e89596e1e595fa7.png',
            currency: order.currency,
            key: order.key_id,
            amount: order.amount,
            order_id: order.id,
            prefill: {
                email: order.notes.email,
                contact: order.notes.contact,
                name: order.notes.name,
            },
            theme: { color: '#5349f8' },
        };

        RazorpayCheckout.open(options)
            .then(async (data) => {

                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;

                let data1 = {
                    razorpay_order_id: razorpay_order_id,
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                }

                let response = await Apis.HttpPostRequest(
                    Constant.BASE_URL + '/api/user/payment/verify',
                    token,
                    data1
                );

                if (response?.status) {
                    refresh()
                } else {
                    Alert.alert('Failure', 'Payment verification failed');
                }
            })
            .catch((error) => {
                console.log('error===============>', error)
                Alert.alert('Error', `Payment failed: ${error.description}`);
            });
    };

    function formatDate1(dateString) {
        const dateObject = new Date(dateString);
        const day = dateObject.getDate();

        const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNamesShort[dateObject.getDay()];

        const monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthIndex = dateObject.getMonth();
        const monthShort = monthNamesShort[monthIndex];

        return { day, monthShort, dayName };
    }

    const handleDateSelection = (date, index) => {
        setSelectedDateIndex(index)
        setSelectedDate(date);
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
    };

    const renderTimeItem = (time, index) => (
        <Pressable
            key={index}
            onPress={() => handleTimeSelection(time)}
            p={3}
            bg={selectedTime === time ? '#ff5c39' : '#ffeeec'}
            borderRadius={8}
            mr={1}
            mt={3}
        >
            <Text fontWeight="500" fontSize="bd_sm" lineHeight="20px" color={selectedTime === time ? 'white' : '#ce8b7b'}>{time}</Text>
        </Pressable>
    );


    const handleCancelAlert = () => {
        Alert.alert(
            'Cancell Booking',
            'Are you sure, you want to cancel this booking?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => handleCancel() },
            ],
            { cancelable: false }
        );
    };

    const handleReschedule = async () => {
        try {
            let data = {
                "bookingId": booking?._id,
                "date": selectedDate,
                "time": selectedTime
            }

            let response = await Apis.HttpPostRequest(
                Constant.BASE_URL + Constant.RESCHEDULE_BOOKING,
                token,
                data
            );
            if (response?.status) {
                setModalVisible(!modalVisible)
                show(response ?.message, "success");
                refresh()
            } else {
                show('Some error', "error");
            }
        } catch (e) {
            console.log('========>',e)
        }
    };

    const handleCancel = async () => {
        try {
            let data = {
                bookingId: booking?._id
            }

            let response = await Apis.HttpPostRequest(
                Constant.BASE_URL + Constant.CANCEL_BOOKING,
                token,
                data
            );
            if (response?.status) {
                show(response ?.message, "success");
                refresh()
            } else {
                show('Some error', "error");
            }
        } catch (e) {
            return false
        }
    };



    return (
        <>
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
                    <View
                        width="100%"
                        // borderColor="#ffffff"
                        // borderWidth={1}
                        // borderRadius="10px"
                        paddingBottom={0}
                        border={0}
                        shadow={0}
                        padding={3}>

                        <View
                            width="100%"
                            bg="#ffffff"
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
                                        {booking?.bookingId}
                                    </Text>
                                    {
                                        booking?.authCode &&
                                        <Text fontWeight="500" fontSize="bd_sm" mt={2} lineHeight="20px" color="bd_dark_text">
                                            Auth Code
                                        </Text>
                                    }

                                </Box>
                                <Box flex={1}>
                                </Box>
                                <Box flex={3}>
                                    <Text fontWeight="600" fontSize="bd_sm" lineHeight="50px" color="bd_dark_text" textAlign="right">
                                        <BadgeComponent text={booking?.status == 'UPDATED' ? 'Pre Inspection Done' : booking?.status} />
                                    </Text>
                                    {
                                        booking?.authCode &&
                                        <View style={{ backgroundColor: '#66ff66', padding: 1, borderRadius: 5, width: 70, alignSelf: 'flex-end', marginTop: 10 }}>
                                            <Text fontWeight="600" fontSize={18} lineHeight="20px" color="bd_dark_text" letterSpacing={4} textAlign="center">
                                                {booking?.authCode}
                                            </Text>
                                        </View>
                                    }
                                </Box>
                            </HStack>
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
                            <Image source={imageConstant.time} alt="" style={{ width: 14, height: 14, resizeMode: 'contain' }} />
                            <Text fontSize="bd_xsm" color="bd_sec_text" marginLeft={2}>
                                {formatDate(booking?.date) + " at " + booking?.time}
                            </Text>
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
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </View>
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
                                    Garage
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                    {booking?.garage?.name}
                                    </Text>
                                    <Ratings count={booking?.garage.avgRating ? booking?.garage.avgRating : 1} rating={booking?.garage.avgRating ? booking?.garage.avgRating : 1} ratingCount={booking?.garage.ratingCount ? booking?.garage.ratingCount : 1} />
                                </View>
                                <View>
                                    <Image
                                        source={{ uri: booking?.garage?.icon }}
                                        alt="Bike Image"
                                        size={"72px"}
                                        borderRadius="md"
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </View>
                        </View>


                        {/* <View
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
                                        Garage
                                    </Text>
                                    <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                                        {booking?.garage?.name}
                                    </Text>
                                </View>
                            </View>
                        </View> */}


                        {
                            booking?.mechanics ?
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
                                :
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
                                                Mechanic is yet to be assigned
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                        }

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
                            {[booking?.services[0]].map((service, index) => (
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

                            {
                                booking?.services.length > 1 && (
                                    <>
                                        <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                            Add Ons (User)
                                        </Text>
                                        {booking?.services.slice(1).map((service, index) => (
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
                                booking?.additionalServices.length > 0 && (
                                    <>
                                        <Text fontWeight="500" fontSize="bd_sm" mt={4} mb={2} lineHeight="18px" color="bd_dark_text">
                                            Add Ons (Mechanic)
                                        </Text>
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
                                )
                            }


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
                                booking?.spareParts.length > 0 &&
                                <View
                                    width="100%"
                                    bg="#ffffff"
                                    borderRadius="10px"
                                    marginTop={0}
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
                                    {/* <CustomButton
                            onPress={() => navigation.navigate("SpareListScreen", booking?._id)}
                            btnStyle={{ marginTop: 15, height: 40, width: '30%', alignSelf: 'flex-end' }}
                            textStyle={{
                                color: "#FFF",
                                fontWeight: "500",
                                fontSize: 12
                            }}
                        >
                            View spares list
                        </CustomButton> */}
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
                                    {booking?.completed ? 'Total ' : 'Estimated '}
                                    Amount :
                                </Text>
                                <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="14px" color="bd_dark_text">
                                    ₹{booking?.amount}
                                </Text>



                            </View>



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
                            booking?.status == 'COMPLETED' && booking?.garageRating &&
                            <View
                                width="100%"
                                bg="#ffffff"
                                borderRadius="10px"
                                marginTop={2}
                                p={3}>
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
                            </View>
                        }

                    </View>


                </View>

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
                        <Text style={styles.modalTitle}>Reschedule Service</Text>

                        <VStack space={2} mb={2} height={200}>
                            <Text fontWeight="500" fontSize="14" mb={1} lineHeight="20px" color="grey">
                                Selected Date : {formatDate(booking?.date)}
                            </Text>
                            <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                                Select Date
                            </Text>
                            <Divider />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={0}>
                                {garageData?.availableDates && garageData?.availableDates.map((data, index) => {
                                    let formattedDate = formatDate1(data);
                                    return (
                                        <Pressable onPress={() => handleDateSelection(data, index)}>
                                            <VStack mr={2} space={2} bg={selectedDateIndex === index ? "#5349f8" : "transparent"} p={2} borderRadius={50} pt={4} pb={4}>
                                                <Text fontWeight="700" fontSize="bd_md" mb={0} lineHeight="20px" color={selectedDateIndex === index ? "#FFF" : "bd_sec_text"} textAlign="center">{formattedDate.monthShort}</Text>
                                                <Text fontWeight="500" fontSize="bd_md" mb={0} lineHeight="20px" color={selectedDateIndex === index ? "#FFF" : "bd_dark_text"} textAlign="center">{formattedDate.dayName}</Text>
                                                <Text fontWeight="500" fontSize="bd_md" mb={0} lineHeight="20px" color={selectedDateIndex === index ? "#FFF" : "bd_dark_text"} textAlign="center">{formattedDate.day}</Text>
                                            </VStack>
                                        </Pressable>
                                    )
                                })}
                            </ScrollView>
                        </VStack>

                        <VStack space={2} mb={1} mt={0} height={130}>
                            <Text fontWeight="500" fontSize="14" mb={1} lineHeight="20px" color="grey">
                                Selected Time Slot : {booking?.time}
                            </Text>
                            <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                                Select Time Slot
                            </Text>
                            <Divider />

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={0}>
                                {garageData?.availableTimes && garageData?.availableTimes.map((data, index) => {
                                    return renderTimeItem(data, index)
                                })}
                            </ScrollView>

                        </VStack>

 

                        <View flexDirection={'row'}
                            justifyContent={'space-evenly'}
                            p={3}
                            marginTop={20}
                            width={'100%'}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleReschedule()}
                                style={styles.submitButton}>
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </ScrollView>

            {/* CREATED */}
            {booking?.status === 'CREATED' && (
                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <CustomButton onPress={() => {
                  setModalVisible(!modalVisible)
                }} btnStyle={{ margin: 10, borderRadius: 10, width:'40%' }}>
                    Reschedule
                </CustomButton>
                <CustomButton onPress={() => {
                    handleCancelAlert()
                }} btnStyle={{ margin: 10, borderRadius: 10, width:'40%' }}>
                    Cancel
                </CustomButton>
                </View>
            )}

            {/* ASSIGNED */}
            {booking?.status === 'ASSIGNED' && (
                <CustomButton onPress={() => {
                    navigation.navigate("OtpVerify", { booking })
                }} btnStyle={{ margin: 10, borderRadius: 10 }}>
                    Verify
                </CustomButton>
            )}


            {/* UPDATED */}
            {booking?.status === 'UPDATED' && (
                <CustomButton onPress={() => {
                    navigation.navigate("ApprovedPreInspection", { booking })
                }} btnStyle={{ margin: 10, borderRadius: 10 }}>
                    Approve Pre Inspection
                </CustomButton>
            )}

            {booking?.status === 'COMPLETED' && !booking?.garageRating && (
                <CustomButton onPress={() => {
                    navigation.navigate("Rating", { booking })
                }} btnStyle={{ margin: 10, borderRadius: 10 }}>
                    Rate Us
                </CustomButton>
            )}

            {booking?.status === 'SERVICE DONE' && (
                <CustomButton
                    onPress={() => {
                        handlePayment()
                    }} btnStyle={{ margin: 10, borderRadius: 10 }}>
                    Pay Now
                </CustomButton>
            )}

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
        height: 600,
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
    }
});

export default BookingCardDetail;
