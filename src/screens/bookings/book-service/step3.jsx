import React, { useState, useRef } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Box, Text, Button, VStack, HStack, Pressable, ScrollView, Divider, TextArea, Switch } from 'native-base';
import Header from '../../../components/header';
import CustomBottomSheet from "../../../components/modals";
import CustomButton from '../../../components/UI/button';
const { height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import AddressCard from '../../../components/address/single-address'

const DateTimePicker = ({ dateArray, timeArray, navigation, selectedDate, setSelectedDateIndex, selectedDateIndex,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedAddress,
    setOtherSuggestionText, otherSuggestionText,
    takePermissionBeforeReplacing,
    setTakePermissionBeforeReplacing,
    setSelectedAddress }) => {

    // function formatDate(dateString) {
    //     const dateObject = new Date(dateString);
    //     // Get day of the month (e.g., '15')
    //     const day = dateObject.getDate();
    //     const dayName = dateObject.getDay();
    //     // Get month name in short format (e.g., 'JAN')
    //     const monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    //     const monthIndex = dateObject.getMonth();
    //     const monthShort = monthNamesShort[monthIndex];
    //     return { day, monthShort, dayName };
    // }
    function formatDate(dateString) {
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

    const bottomSheetRef = useRef(null);

    const openBottomSheet = (type = "addons") => {

        setBottomSheetHeight(height - 100)
        setContentType(type);
        setTimeout(() => {
            bottomSheetRef.current.open();
        }, 50)
    };

    const closeBottomSheet = () => {
        setContentType("");
        bottomSheetRef.current.close();
    };

    const [bottomSheetHeight, setBottomSheetHeight] = useState(height - 100);
    const [contentType, setContentType] = useState('');


    return (
        <Box p={0} flex={1} mb={5}>
            <VStack space={2} mb={4}>
                <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                    Select Date
                </Text>
                <Divider />

                <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
                    contentType={contentType}
                    addNewAddress={() => {
                        closeBottomSheet();
                        navigation.navigate("SavedAddress")
                    }}
                    setSelectedAddress={setSelectedAddress}
                    // setSelectedAccessories={setSelectedAccessories}

                    closeBottomSheet={() => closeBottomSheet()}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={3}>
                    {dateArray && dateArray.map((data, index) => {
                        let formattedDate = formatDate(data);
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

            <VStack space={2} mb={4} mt={5}>
                <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                    Select Time Slot
                </Text>
                <Divider />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={0}>
                    {timeArray && timeArray.map((data, index) => {
                        return renderTimeItem(data, index)
                    })}
                </ScrollView>

            </VStack>


            <VStack space={2} mb={4} mt={5}>
                <Text fontWeight="600" fontSize="bd_md" mb={2} lineHeight="20px" color="bd_dark_text">
                    Select Addresss
                </Text>

                {selectedAddress.length > 0 && <AddressCard showDeleteIcon={false} address={selectedAddress[0]} />}

                <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={() => openBottomSheet("select_address")}>
                    <Box
                        px={2}
                        py={1}
                        bg="#5349f8"
                        borderRadius={15}
                        justifyContent="center"
                        alignItems="center"
                        pl={3}
                        pr={3}
                    >
                        <Text color="#FFF" fontSize="bd_xsm" fontWeight="700">
                            {selectedAddress.length > 0 ? "Change" : "Select"}
                        </Text>
                    </Box>
                </TouchableOpacity>

                <Divider />
                {/* {selectedAddress.length > 0 && <AddressCard showDeleteIcon={false} address={selectedAddress[0]} />}
                <CustomButton onPress={() => openBottomSheet("select_address")} btnStyle={{ width: "30%", alignSelf: "center", height: 40, borderRadius: 5, borderWidth: 2, borderColor: "#DDD", backgroundColor: "transparent", alignItems: "center", alignContents: "center", paddingTop: 8 }} textStyle={{ color: "#000", fontSize: 12 }}>{selectedAddress.length > 0 ? "Change" : "Select"}</CustomButton> */}
            </VStack>


            <VStack space={2} mb={4}>
                <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text">
                    Any Suggesstions?
                </Text>
                <Divider />

                <TextArea
                    value={otherSuggestionText}
                    onChangeText={text => setOtherSuggestionText(text)}
                    placeholder="Enter any other problems" w="100%" />
            </VStack>

            <Box>
                <HStack space={0} mb={4} mt={5}>
                    <Icon name="gear" style={{ marginTop: 3 }} size={18} />
                    <Text pl={1} w="85%" fontWeight="500" fontSize="bd_sm" mb={0} color="bd_dark_text">
                        Don't take permission before replacing any spare
                    </Text>

                    <Box
                        px={0}
                        py={0}
                        justifyContent="center"
                        alignItems="center">
                        <Switch onValueChange={() => setTakePermissionBeforeReplacing((pre) => !pre)} defaultIsChecked={takePermissionBeforeReplacing} colorScheme="primary" />
                    </Box>
                </HStack>
            </Box>
        </Box>
    );
};

export default DateTimePicker;
