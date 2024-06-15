// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, FlatList, HStack, IconButton, Divider, navigation, Pressable, View } from 'native-base';
import { Alert, Button, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';

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
import { useIsFocused } from '@react-navigation/native';



const FinishService = ({ booking }) => {

    const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [isLoading, setLoading] = useState(true);
    const { show, close, closeAll } = handleToast();
    const [spareData, setSpareData] = useState(null);

    const { token } = useAuth();

    const [selectedServices, setSelectedServices] = useState(booking?.services.map(d => {
        return { _id: d._id }
    }));
    const [selectedAccessories, setSelectedAccessories] = useState(booking?.accessories.map(d => {
        return { _id: d._id }
    }));
    const [selectedAdditionalServicesMechanic, setSelectedAdditionalServicesMechanic] = useState(booking?.additionalServices.map(d => {
        return { _id: d._id }
    }));
    const [selectedAdditionalServicesUser, setSelectedAdditionalServicesUser] = useState(booking?.services.slice(1).map(d => {
        return { _id: d._id }
    }));
    const [selectedSpareParts, setSelectedSpareParts] = useState(booking?.spareParts.map(d => {
        return { _id: d._id }
    }));

    useEffect(() => {
        if (isFocused)
          fetchBookingsDetails();
      }, [isFocused]);

    const handleCheckboxChange = (_id, type) => {
        switch (type) {
            case 'service':
                toggleCheckbox(selectedServices, setSelectedServices, _id);
                break;
            case 'accessory':
                toggleCheckbox(selectedAccessories, setSelectedAccessories, _id);
                break;
            case 'additionalServiceMechanic':
                toggleCheckbox(
                    selectedAdditionalServicesMechanic,
                    setSelectedAdditionalServicesMechanic,
                    _id
                );
                break;
            case 'additionalServiceUser':
                toggleCheckbox(
                    selectedAdditionalServicesUser,
                    setSelectedAdditionalServicesUser,
                    _id
                );
                break;
            case 'sparePart':
                toggleCheckbox(selectedSpareParts, setSelectedSpareParts, _id);
                break;
            default:
                break;
        }
    };

    const toggleCheckbox = (selectedItems, setSelectedItems, _id) => {
        if (selectedItems.some((item) => item._id === _id)) {
            setSelectedItems(selectedItems.filter((item) => item._id !== _id));
        } else {
            setSelectedItems([...selectedItems, { _id, checked: true }]);
        }
    };

    const fetchBookingsDetails = async () => {
        try {
          let response = await Apis.HttpGetRequest(
            Constant.BASE_URL + Constant.GET_MECHANIC_BOOKINGS_DETAILS + booking?._id,
            token
          );
          if (response?.status) {
    
            const data = await response?.data;
            setSpareData(data.spareParts);
          } else {
          }
        } catch (e) {
        }
      };

    const handleAlert = () => {
        Alert.alert(
            'Check Alert',
            'Are you sure you have checked all the required checkbox?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: finishBooking },
            ],
            { cancelable: false }
        );
    };




    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

   

    const finishBooking = async () => {
        try {
            let validationFailed = false;
    
            spareData.forEach(part => {
                if (!part.beforeImage || !part.afterImage) {
                    validationFailed = true;
                    Alert.alert(
                        "Validation Error",
                        `Part ${part.name} has missing images. Please provide both before and after images.`
                    );
                }
            });
    
            // If validation failed, return early and don't proceed to the API call
            if (validationFailed) {
                return;
            }
    
            setLoading(true);
    
            let data = {
                services: [...selectedServices.map(d => d._id), ...selectedAdditionalServicesUser.map(d => d._id)],
                additionalServices: selectedAdditionalServicesMechanic.map(d => d._id),
                accessories: selectedAccessories.map(d => d._id),
                spareParts: selectedSpareParts.map(d => d._id)
            };
    
            // console.log('dataaaaa===============+>',data)
    
            let response = await Apis.HttpPostRequest(
                Constant.BASE_URL + Constant.COMPLETE_SERVICE + booking?._id + '/completeService',
                token,
                data
            );
            if (response?.status) {
                show(response?.message, "success");
                navigation.navigate("MechanicBookingsDetails", { id: booking?._id });
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };
    



    return (
        <View
            width="100%"
            // borderColor="#ffffff"
            // borderWidth={1}
            // borderRadius="10px"
            mb={2}
            border={0}
            shadow={0}
            padding={2}>
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
                    </Box>
                    <Box flex={1}>
                    </Box>
                    <Box flex={4}>
                        <Text fontWeight="600" fontSize="bd_sm" lineHeight="50px" color="bd_dark_text" textAlign="right">
                            <BadgeComponent text={booking?.status} />
                        </Text>
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
                            Customer
                        </Text>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                            Name : {booking?.user?.name}
                        </Text>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                            Mobile No. : {booking?.user?.mobile}
                        </Text>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={1} lineHeight="20px" color="bd_sec_text">
                            Address : {booking?.address?.address}
                        </Text>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_sec_text">
                            City : {booking?.address?.city?.name}, Pincode : {booking?.address?.pincode}
                        </Text>
                    </Box>
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
                {booking?.services.map((service, index) => (
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

                        <TouchableOpacity onPress={() => handleCheckboxChange(service?._id, 'service')} >
                            <View
                                style={[
                                    styles.checkbox,
                                    {
                                        backgroundColor: selectedServices.some(
                                            (service) => service._id === service?._id
                                        )
                                            ? 'transparent'
                                            : 'transparent',
                                    },
                                ]}>
                                {selectedServices.some(
                                    (service) => service._id === service._id
                                ) && <Text style={styles.checkmark}>&#x2713;</Text>}
                            </View>
                        </TouchableOpacity>
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
                                    <TouchableOpacity onPress={() => handleCheckboxChange(service?._id, 'additionalServiceUser')} >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                {
                                                    backgroundColor: selectedAdditionalServicesUser.some(
                                                        (additionalService) => additionalService._id === service._id
                                                    )
                                                        ? 'transparent'
                                                        : 'transparent',
                                                },
                                            ]}>
                                            {selectedAdditionalServicesUser.some(
                                                (additionalService) => additionalService?._id === service?._id
                                            ) && <Text style={styles.checkmark}>&#x2713;</Text>}
                                        </View>
                                    </TouchableOpacity>
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
                                    <TouchableOpacity onPress={() => handleCheckboxChange(service?._id, 'additionalServiceMechanic')} >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                {
                                                    backgroundColor: selectedAdditionalServicesMechanic.some(
                                                        (additionalService) => additionalService._id === service._id
                                                    )
                                                        ? 'transparent'
                                                        : 'transparent',
                                                },
                                            ]}>
                                            {selectedAdditionalServicesMechanic.some(
                                                (additionalService) => additionalService?._id === service?._id
                                            ) && <Text style={styles.checkmark}>&#x2713;</Text>}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </>
                    )
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

                        <TouchableOpacity onPress={() => handleCheckboxChange(accessory?._id, 'accessory')} >
                            <View
                                style={[
                                    styles.checkbox,
                                    {
                                        backgroundColor: selectedAccessories.some(
                                            (accessoryy) => accessoryy._id === accessory?._id
                                        )
                                            ? 'transparent'
                                            : 'transparent',
                                    },
                                ]}>
                                {selectedAccessories.some(
                                    (accessoryy) => accessoryy._id === accessory._id
                                ) && <Text style={styles.checkmark}>&#x2713;</Text>}
                            </View>
                        </TouchableOpacity>

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

                {
                    booking?.spareParts &&
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
                            <CustomButton
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
                            </CustomButton>
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
                                    {index + 1}. {spareParts?.name}
                                </Text>

                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleCheckboxChange(spareParts._id, 'sparePart')}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            {
                                                backgroundColor: selectedSpareParts.some(
                                                    (sparePart) => sparePart._id === spareParts._id
                                                )
                                                    ? 'transparent'
                                                    : 'transparent',
                                            },
                                        ]}>
                                        {selectedSpareParts.some(
                                            (sparePart) => sparePart?._id === spareParts?._id
                                        ) && <Text style={styles.checkmark}>&#x2713;</Text>}
                                    </View>
                                </TouchableOpacity>
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

            </View>

            <CustomButton
                onPress={handleAlert}
                btnStyle={{ marginTop: 10 }}>
                Generate Bill
            </CustomButton>


        </View>
    );
};

const styles = StyleSheet.create({
    modalView: {
        bottom: 0,
        position: 'absolute',
        // margin: 20,
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
        height: 200,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
        // bottom:0,
        // position:'absolute',
        // width:'100%',
        // height:'100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black'
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        width: '100%', // Ensure items take full width
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#5349f8',
        flexShrink: 0,
    },
    checkmark: {
        fontSize: 20,
        color: 'green',
    },
});

export default FinishService;
