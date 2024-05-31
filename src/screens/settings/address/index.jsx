import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { Box, Heading, Avatar, Input, Button, Toast, Text, ScrollView } from 'native-base';
import { handleToast } from '../../../utils/toast';
import CommonStyle from '../../../assets/style';
import CustomButton from '../../../components/UI/button'
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import Header from '../../../components/header';
import AddressCard from '../../../components/address/single-address'
import FlatListContainer from '../../../components/flatlist';
import CustomBottomSheet from "../../../components/modals";
import { useAuth } from '../../../context/loginContext';

const SavedAddress = ({ navigation }) => {
    const { token } = useAuth();
    const { show, close, closeAll } = handleToast();
    const [contentType, setContentType] = useState('');
    const [bottomSheetHeight, setBottomSheetHeight] = useState(380);
    const [openAddressModal, setOpenAddressModal] = useState(false);

    const [newAddress, setNewAddress] = useState({
        address1: "",
        zipcode: "",
        address_type: "",
        city: "",

    })

    const [isLoading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState([])
    const [addressFullData, setAddressFullData] = useState([])

    useEffect(() => {
        fetchSavedAddress();
    }, []);

    const fetchSavedAddress = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_USER_ADDRESS, token)
            if (response ?.status) {
                let fullData = response ?.data;
                setAddressFullData(fullData);
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

    const renderItem = ({ item }) => <AddressCard address={item} onAddressDeletePressed={() => onAddressDeletePressed(item.id)} />;

    const onAddressDeletePressed = async (id) => {
        try {
            let response = await Apis.HttpDeleteRequest(Constant.BASE_URL + Constant.DELETE_USER_ADDRESS + id, token, {})
            if (response ?.status) {
                fetchSavedAddress()
                show(response ?.message, "success");
            } else {
                show(response ?.message || "Failed to delete, please try again later", "error");
            }
        } catch (e) {
            show("Some error has occured!", "error");
        }
    }

    const bottomSheetRef = useRef(null);

    const openBottomSheet = (type = "addUpdateAddress") => {

        setBottomSheetHeight(450)
        setContentType(type);
        setTimeout(() => {
            bottomSheetRef.current.open();
        }, 50)
    };

    const closeBottomSheet = () => {
        setContentType("");
        bottomSheetRef.current.close();
    };

    const addAddress = async () => {
        if (newAddress.city._id === undefined || newAddress.city._id === "") {
            show("Please select city", "error");
            return;
        }

        closeBottomSheet()
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

    return (
        <Box flex={1} justifyContent="center" p={0} bg="screen_bg">
            <Header showRightBtn={true}
                onBtnPressed={() => openBottomSheet()} title="My Addresses" navigation={navigation} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
                    contentType={contentType}
                    pricing={0} active={1}
                    addAddress={addAddress} newAddress={newAddress} setNewAddress={setNewAddress}
                    openAddressModal={openAddressModal}
                    setOpenAddressModal={setOpenAddressModal} />


                <Box flex={1} justifyContent="center" p={2} bg="bg_white">
                    <FlatListContainer
                        containerStyle={{ margin: 0 }}
                        data={addressData}
                        emptyMessage="No address found"
                        isLoading={isLoading}
                        renderItem={renderItem} // Pass the renderItem function as a prop
                    />
                </Box>
            </ScrollView>
        </Box>
    );
};

export default SavedAddress;
