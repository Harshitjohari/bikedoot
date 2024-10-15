import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, TouchableOpacity, Image } from 'react-native';
import { View, Box, Text, Button, VStack, HStack, Pressable, ScrollView, Divider, TextArea, Switch } from 'native-base';
import Header from '../../../components/header';
import CustomBottomSheet from "../../../components/modals";
import CustomButton from '../../../components/UI/button';
const { height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import AddressCard from '../../../components/address/single-address'
import { imageConstant } from '../../../utils/constant';

const DateTimePicker = ({ dateArrayNew, navigation, selectedDate, setSelectedDateIndex, selectedDateIndex,
    setSelectedDate, selectedTime, setSelectedTime, selectedTimeSlot, setSelectedTimeSlot,
    selectedAddress, setOtherSuggestionText, otherSuggestionText, takePermissionBeforeReplacing, setTakePermissionBeforeReplacing,
    setSelectedAddress }) => {

    const [selectedTimeSlots, setSelectedTimeSlots] = useState(null);
    const [visible, setVisible] = useState(false);
    const bottomSheetRef = useRef(null);
    const [bottomSheetHeight, setBottomSheetHeight] = useState(height - 100);
    const [contentType, setContentType] = useState('');

    useEffect(() => {
        // Automatically select the first date and time slot if they exist
        if (dateArrayNew && dateArrayNew.length > 0) {
            handleDateSelection(dateArrayNew[0], 0);
        }
    }, [dateArrayNew]);

    const handleDateSelection = (date, index) => {
        setSelectedDateIndex(index);
        setSelectedDate(date.date);
        setSelectedTimeSlots(date.slots);

        // Automatically select the first time slot when the date is selected
        if (date.slots && date.slots.length > 0) {
            handleTimeSelection(date.slots[0]);
        }
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time.label);
        setSelectedTimeSlot(time.value);
    };

    const renderTimeItem = (time, index) => (
        <Pressable
            key={index}
            onPress={() => handleTimeSelection(time)}
            p={3}
            bg={selectedTime === time.label ? '#ff5c39' : '#ffeeec'}
            borderRadius={8}
            mr={1}
            mt={3}
        >
            <Text fontWeight="500" fontSize="bd_sm" lineHeight="20px" color={selectedTime === time.label ? 'white' : '#ce8b7b'}>
                {time.label}
            </Text>
        </Pressable>
    );

    const openBottomSheet = (type = "addons") => {
        setBottomSheetHeight(height - 100);
        setContentType(type);
        setTimeout(() => {
            bottomSheetRef.current.open();
        }, 50);
    };

    const closeBottomSheet = () => {
        setContentType("");
        bottomSheetRef.current.close();
    };

    return (
        <Box p={0} flex={1} mb={2}>
            <VStack space={2} mb={4}>
                <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                    Select Date
                </Text>
                <Divider />

                <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
                    contentType={contentType}
                    addNewAddress={() => {
                        closeBottomSheet();
                        navigation.navigate("SavedAddress");
                    }}
                    setSelectedAddress={setSelectedAddress}
                    closeBottomSheet={() => closeBottomSheet()}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={3}>
                    {dateArrayNew && dateArrayNew.map((data, index) => {
                        return (
                            <Pressable key={index} onPress={() => handleDateSelection(data, index)}>
                                <VStack mr={2} space={2} bg={selectedDateIndex === index ? "#5349f8" : "transparent"} p={2} borderRadius={50} pt={4} pb={4}>
                                    <Text fontWeight="700" fontSize="bd_md" mb={0} lineHeight="20px" color={selectedDateIndex === index ? "#FFF" : "bd_sec_text"} textAlign="center">
                                        {data.dateLabel}
                                    </Text>
                                </VStack>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </VStack>

            <VStack space={2} mb={4} mt={5}>
                <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                    Select Time Slot
                </Text>
                <Divider />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={0}>
                    {selectedTimeSlots && selectedTimeSlots.map((data, index) => {
                        return renderTimeItem(data, index);
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

            <Box>
                <HStack space={0} mb={4} mt={5} justifyContent="space-between" alignItems="center">

                    <HStack space={1} alignItems="center">
                        <Image source={imageConstant.estimate} alt="" style={{ width: 18, height: 18, resizeMode: 'contain' }} />

                        <Text fontWeight="500" fontSize={16} color="bd_dark_text">
                            Do you want Detailed Estimate?
                        </Text>

                        <TouchableOpacity
                            onPressIn={() => setVisible(true)} 
                            onPressOut={() => setVisible(false)}
                        >
                            <Image source={imageConstant.tooltip} alt="" style={{ width: 18, height: 18, resizeMode: 'contain' }} />

                        </TouchableOpacity>

                        {visible && (
                            <View style={{
                                position: 'absolute',
                                top: 30,
                                backgroundColor: '#FFFFFF',
                                padding: 10,
                                borderRadius: 5,
                                elevation: 5,
                                zIndex: 10,
                                width: '90%',
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    color:'black',
                                    fontWeight:400
                                }}>
                                    If you opted for detail estimate, the mechanic will send you the pre-inspection and will wait for your approval to start service.
                                </Text>
                            </View>
                        )}
                    </HStack>


                    <Box flexDirection="row" alignItems="center">
                        <Switch
                            onValueChange={() => setTakePermissionBeforeReplacing((pre) => !pre)}
                            defaultIsChecked={takePermissionBeforeReplacing}
                            colorScheme="primary"
                        />
                        <Text
                            style={{
                                color: '#5349f8',
                                fontWeight: '700',
                                fontSize: 16,
                                letterSpacing: 1,
                            }}
                        >
                            {takePermissionBeforeReplacing ? 'Yes' : 'No'}
                        </Text>
                    </Box>

                </HStack>
            </Box>

            <VStack space={2} mb={4} mt={5}>
                <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text">
                    Any Suggestions?
                </Text>
                <Divider />

                <TextArea
                    value={otherSuggestionText}
                    onChangeText={text => setOtherSuggestionText(text)}
                    placeholder="Enter any other problems"
                    w="100%" />
            </VStack>
        </Box>
    );
};

export default DateTimePicker;
