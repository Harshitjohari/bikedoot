import React, { useState, useEffect } from 'react';
import { View, Linking, TouchableOpacity } from 'react-native';
import { Box, VStack, Divider, ScrollView, Switch, Text, HStack, Image } from 'native-base';
import FlatListContainer from '../../../components/flatlist';
import BookingCard from '../../../components/bookings/services-list/single-service';
import Header from '../../../components/header';
import VechicleCard from '../../../components/vechicle/horizontal-single-vehical'
import ServiceCard from '../../../components/bookings/services-list/single-service';
import AccessoriesCard from '../../../components/accessories/single-accessories-modal'
import AddressCard from '../../../components/address/single-address'
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TextHeader from '../../../components/UI/text-header';
import { useAuth } from '../../../context/loginContext';
import Checkbox from '../../../components/UI/checkbox';
import Ratings from '../../../components/UI/rating';
import { imageConstant } from '../../../utils/constant';

const FinalizeAndConfirmBooking = ({
    selectedDate,
    selectedTime,
    selectedAddress,
    selectedAccessories,
    selectedAddOns,
    selectedServices, selectedBike, setOtherSuggestionText, otherSuggestionText,
    takePermissionBeforeReplacing,
    setTakePermissionBeforeReplacing,
    setIsAgreed,
    isAgreed, setCurrentStep, setSelectedBike, garageData, title

}) => {

    const { userData } = useAuth();
    const [visible, setVisible] = useState(false);


    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };

        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    };

    function mergeObjectWithArray(mainObject, arrayOfObjects) {
        return [{ ...mainObject }, ...arrayOfObjects];
    }

    const showServices = (item, index) => {
        return (
            <VStack space={2} key={index} pt={0}>
                <HStack space={0}>
                    <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bb_dark">{item?.name}</Text>
                    <Text style={{ position: 'absolute', right: 0 }} fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">{'\u20B9' + item?.price}</Text>
                </HStack>
                <Divider />
            </VStack>
        )
    }


    const showAccessories = (item, index) => {

        let image = { name: require("../../../assets/images/tool.png") }
        if (item?.icon)
            image = { name: { uri: item?.icon } }


        return (
            <VStack space={2} key={index} pt={0}>
                <HStack space={0} alignItems="center">

                    <Box
                        bg="#FFF"
                        borderRadius="full"
                        width={10}
                        height={10}
                        alignSelf="center"
                        alignItems="center"
                        justifyContent="center">
                        {/* Image Icon */}
                        <Image style={{
                            resizeMode: "contain"
                        }} alignItems="center" textAlign="center" source={image?.name} alt="Icon" width={10} height={10} />
                    </Box>

                    <Text pl={3} fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bb_dark">{item?.name}</Text>
                    <Text style={{ position: 'absolute', right: 0 }} fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">{'\u20B9' + item?.price}</Text>
                </HStack>
                <Divider />
            </VStack>
        )
    }

    const handlePress = () => {
        // Replace 'YOUR_TERMS_AND_CONDITIONS_URL' with the actual URL of your terms and conditions
        Linking.openURL('https://bikedoot.com/terms-of-use.php');
    };

    return (
        <Box p={0} flex={1} mb={20}>
            <VStack space={2} mb={4}>
                <TextHeader text="" mb={0} title="Selected Garage" />
                <Divider />
                {/* <Box>
                    <Text fontWeight="600" fontSize="bd_sm" mb={1} lineHeight="20px" color="bd_sec_text">{garageData?.name}</Text>
                    <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_sec_text">{garageData?.address},{garageData?.pincode}</Text>
                </Box>
                <Image style={{
                    resizeMode: "contain",
                    width:40,
                     height:40,
                     backgroundColor:'red',
                     borderRadius:8
                }}
                source={garageData?.icon} alt="Icon"  /> */}
                <Box
                    width={"100%"}
                    borderRadius="10px"
                    mb={0}

                    justifyContent="space-between"
                >

                    <Box
                        bg="white"
                        borderRadius="10px"
                        p={3}
                    >
                        <HStack space={2}>
                            <Box flex={1}>
                                <Image
                                    source={{uri:garageData?.icon}}
                                    alt="Icon"
                                    width={60}
                                    height={60}
                                    borderRadius={8}
                                    resizeMode='contain'
                                />

                            </Box>
                            <Box flex={3}>
                                {/* Text name and description */}
                                <Text fontWeight="bold" color={'black'} fontSize="bd_sm" numberOfLines={1} textAlign="left" mb={1}>
                                    {garageData?.name}
                                </Text>
                                <Text fontSize="bd_xsm" color="bd_sec_text" numberOfLines={1} textAlign="left">
                                    {garageData?.address},{garageData?.pincode}
                                </Text>
                                <Text fontSize="bd_xsm" color="bd_sec_text" numberOfLines={2} textAlign="left">
                                    <Ratings count={garageData.avgRating ? garageData.avgRating : 1} rating={garageData.avgRating ? garageData.avgRating : 1} ratingCount={garageData.ratingCount ? garageData.ratingCount : 1} />
                                </Text>
                            </Box>
                        </HStack>
                    </Box>


                </Box>

                <TextHeader text="" mb={0} title="Service Category Selected" />
                <Divider />
                <Box>
                    <Text fontWeight="600" fontSize="bd_sm" mb={1} lineHeight="20px" color="bd_sec_text">{title}</Text>
                </Box>

            </VStack>
            <VStack space={2} mb={4}>
                <TextHeader text="Edit" mb={0} title=" Selected Bike" onPressSeeAll={() => { setSelectedBike({}); setCurrentStep(1) }} />
                <Divider />
                <VechicleCard showAddedButton={false} width="35%" vehicleData={selectedBike} showDelete={false} selectedBikeIndex={-1} />
            </VStack>

            {Object.keys(selectedServices).length > 0 && <VStack space={2} mb={4}>

                <TextHeader text="Edit" mb={0} title=" Selected Service" onPressSeeAll={() => setCurrentStep(2)} />

                <Divider />

                {mergeObjectWithArray(selectedServices, selectedAddOns).map((data, index) => {
                    return showServices(data, index)
                })}

            </VStack>}

            {selectedAccessories && selectedAccessories.length > 0 && <VStack space={2} mb={4}>
                <TextHeader text="Edit" mb={0} title=" Selected Accessories" onPressSeeAll={() => setCurrentStep(2)} />
                <Divider />
                {selectedAccessories && selectedAccessories.map((data, index) => {
                    return showAccessories(data, index);
                })}

            </VStack>}

            <VStack space={2} mb={4}>

                <TextHeader text="Edit" mb={0} title=" Selected Date & Time" onPressSeeAll={() => setCurrentStep(3)} />

                <Divider />
                <HStack>
                    <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">
                        {formatDate(selectedDate)}
                    </Text>
                    <Text style={{ position: "absolute", right: 0 }} fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                        {selectedTime}
                    </Text>
                </HStack>
            </VStack>

            <VStack space={2} mb={0}>
                <TextHeader text="Edit" mb={0} title="Selected Address" onPressSeeAll={() => setCurrentStep(3)} />
                <Divider />
                <Box p={4} pl={0} pt={1}>
                    <HStack space={4} alignItems="center">
                        <FontAwesome5 color="#000" name="globe" style={{ position: "absolute", left: 0, top: 5 }} />
                        <Box>
                            <Text fontWeight="600" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">{userData?.name}</Text>
                            <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_sec_text">{userData?.mobile}</Text>
                            <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_sec_text">{selectedAddress[0]?.address1}</Text>
                            <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_sec_text">{selectedAddress[0]?.city}</Text>
                            <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_sec_text">{selectedAddress[0]?.pincode}</Text>
                        </Box>
                    </HStack>
                </Box>
            </VStack>

            <VStack space={2} mb={4}>
                <TextHeader text="Edit" mb={0} title="Any Suggesstions?" onPressSeeAll={() => setCurrentStep(3)} />

                <Divider />
                <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">
                    {otherSuggestionText || "N/A"}
                </Text>
            </VStack>

            {/* <Box>
                <HStack space={0} mb={4} mt={5}>
                    <Icon name="gear" style={{ marginTop: 5 }} size={18} />
                    <Text pl={1} w="85%" fontWeight="600" fontSize="bd_sm" mb={0} color="bd_dark_text">
                        Do you want Detailed Estimate?
                    </Text>

                    <Box
                        px={0}
                        py={0}
                        justifyContent="center"
                        alignItems="center">
                        <Switch disabled={false} defaultIsChecked={takePermissionBeforeReplacing} colorScheme="primary" />
                    </Box>
                </HStack>
            </Box> */}

            <Box>
                <HStack space={0} mb={5} mt={5} justifyContent="space-between" alignItems="center">

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

            <Box>
                <Checkbox isChecked={isAgreed} onChange={() => setIsAgreed((pre) => !pre)} >
                    <Text pl={2} fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">I accept the</Text>
                    {/* <Text pl={1} fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">Terms and Conditions</Text> */}
                    <TouchableOpacity onPress={handlePress}>
                        <Text style={{
                            marginLeft: 2,
                            fontWeight: '600',
                            fontSize: 12,
                            marginBottom: 0,
                            lineHeight: 16,
                            color: 'blue'
                        }}>Terms and Conditions</Text>
                    </TouchableOpacity>
                </Checkbox>
            </Box>

        </Box>
    );
};

export default FinalizeAndConfirmBooking;
