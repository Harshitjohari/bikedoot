import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker, Icon, Input } from "native-base";
import { RadioButton } from "react-native-paper";
import CommonStyle from '../../assets/style'
import CustomButton from '../UI/button'
import FlatListContainer from '../flatlist';
import AccessoriesCard from '../accessories/single-accessories-modal';
import { Box, Text, Divider, VStack, HStack } from 'native-base';
import AddressCard from '../address/single-address'
import { useAuth } from '../../context/loginContext';
import Apis from '../../utils/api'
import Constant from '../../common/constant';
import CustomBottomSheet from "../../components/modals";

const SelectAddress = ({ data, setSelectedAddress, closeBottomSheet,addNewAddress }) => {

    const {token} = useAuth()

    const onItemPressed = (item, index) => {
        setSelectedAddress(prevItems => [item]);
        closeBottomSheet();
    };

    const [isLoading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState([])
    const [bottomSheetHeight, setBottomSheetHeight] = useState(380);
    const [contentType, setContentType] = useState('');
    const [newAddress, setNewAddress] = useState({
        address1: "",
        zipcode: "",
        address_type: "",
        city: "",

    })
    const [openAddressModal, setOpenAddressModal] = useState(false);


    // const [addressFullData, setAddressFullData] = useState([])

    useEffect(() => {
        fetchSavedAddress();
    }, []);

    const fetchSavedAddress = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_USER_ADDRESS, token)
            if (response ?.status) {
                let fullData = response ?.data;
                // console.log('====================>',fullData)
                // setAddressFullData(fullData);
                let addressData = []
                for (let index = 0; index < fullData.length; index++) {
                    addressData.push({
                        id: fullData[index]?.city?._id,
                        type: "Home",
                        address1: fullData[index] ?.address,
                        city: fullData[index] ?.city ?.name,
                        pincode: fullData[index] ?.pincode
                    })
                }
                setAddressData(addressData);
                setLoading(false);
            } else {
                setLoading(false);
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            setLoading(false);
            // show("Some error has occured!");
        }
    };

    const addAddress = async () => {
        if (newAddress.city._id === undefined || newAddress.city._id === "") {
            show("Please select city", "error");
            return;
        }

        closeBottomSheetAddress()
        
        try {
            let data = {
                address: newAddress.address1,
                city: newAddress.city._id,
                pincode: newAddress.zipcode
            }

            setLoading(true)
            let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.GET_USER_ADDRESS, token, data)
            setLoading(false)
            if (response ?.status) {
                fetchSavedAddress()
                show(response ?.message, "success");
            } else {
                show(response ?.message || "Failed to add address, try again later", "error");
            }
        } catch (e) {
            setLoading(false)
            show("Some error has occured!", "error");
        }
    }

    const openBottomSheetAddress = (type = "addUpdateAddress") => {

        setBottomSheetHeight(450)
        setContentType(type);
        setTimeout(() => {
            bottomSheetRef.current.open();
        }, 50)
    };

    const closeBottomSheetAddress = () => {
        setContentType("");
        bottomSheetRef.current.close();
    };
    const bottomSheetRef = useRef(null);


    const renderItem = ({ item, index }) => <AddressCard showDeleteIcon={false} address={item} onPress={() => onItemPressed(item,index)} />;
    return (
        <Box p={5} flex={1} mb={12}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={2} mb={4}>
                    <VStack space={2} mb={4}>
                        <HStack mb={3}>
                            <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                                Select Address
                    </Text>


 <TouchableOpacity style={{ position: 'absolute', right: 50 }} onPress={() => openBottomSheetAddress()}>
 {/* <TouchableOpacity style={{ position: 'absolute', right: 50 }} onPress={addNewAddress}> */}
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
              Add
            </Text>
          </Box>
        </TouchableOpacity>

        <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
                    contentType={contentType}
                    pricing={0} active={1}
                    addAddress={addAddress} newAddress={newAddress} setNewAddress={setNewAddress}
                    openAddressModal={openAddressModal}
                    setOpenAddressModal={setOpenAddressModal} 
                    closeBottomSheet={()=>closeBottomSheetAddress()}/>


                            <CustomButton onPress={closeBottomSheet} btnStyle={{ height: 30, width: "10%", position: "absolute", right: 0, top: 0, borderRadius: 0, paddingTop: 4 }} textStyle={{ fontSize: 12 }}>X</CustomButton>
                        </HStack>
                        <Divider />
                        <FlatListContainer
                            keyExtractor={(item) => item._id}
                            emptyMessage="No address found"
                            containerStyle={{ margin: 0 }}
                            data={addressData}
                            numColumns={1}
                            contentContainerStyle={{ padding: 0 }}
                            isLoading={isLoading}
                            renderItem={renderItem} // Pass the renderItem function as a prop
                        />
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>

    );
};

export default SelectAddress;
