import React, { useState, useEffect } from 'react';
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
const SelectAddress = ({ data, setSelectedAddress, closeBottomSheet,addNewAddress }) => {

    const {token} = useAuth()

    const onItemPressed = (item, index) => {
        setSelectedAddress(prevItems => [item]);
        closeBottomSheet();
    };

    const [isLoading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState([])
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
                // setAddressFullData(fullData);
                let addressData = []
                for (let index = 0; index < fullData.length; index++) {
                    addressData.push({
                        id: fullData[index] ?._id,
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


 <TouchableOpacity style={{ position: 'absolute', right: 50 }} onPress={addNewAddress}>
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
