import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker, Icon, Input } from "native-base";
import { RadioButton } from "react-native-paper";
import CommonStyle from '../../assets/style'
import CustomButton from '../UI/button'
import FlatListContainer from '../flatlist';
import AccessoriesCard from '../accessories/single-accessories-modal';
import { Box, Text, Divider, VStack, HStack } from 'native-base';
import BrandCard from '../brands/single-brand'
import { useAuth } from '../../context/loginContext';
import Apis from '../../utils/api'
import Constant from '../../common/constant';
import { handleToast } from '../../utils/toast';

const AddBike = ({ data, fetchData, closeBottomSheet }) => {

    const { token } = useAuth()
    const { show, close, closeAll } = handleToast();

    const [isLoading, setLoading] = useState(false);
    const [selectedBrandID, setSelectedBrandID] = useState("");
    const [bikeBrands, setBikeBrands] = useState([])
    const [bikeModels, setBikeModels] = useState([])
    const [flatListData, setFlatListData] = useState([])
    const [step, setStep] = useState(1);

    const addBikeModel = async(modelID) => {
        try {
            let data = {
                model: modelID
            }

            // setLoading(true)
            closeBottomSheet()
            let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.ADD_BIKE, token, data)
            // setLoading(false)
            if (response ?.status) {
                fetchData()
                show(response ?.message, "success");
            } else {
                show(response ?.message || "Failed to add, try again later", "error");
            }
        } catch (e) {
            show("Some error has occured!", "error");
        }
    }
    useEffect(() => {
        fetchBikeBrands();
    }, []);

    const fetchBikeBrands = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.BIKE_BRAND, token)
            if (response ?.status) {
                setBikeBrands(response ?.data);
                setFlatListData(response ?.data);
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

    const fetchBikeModels = async (brandID) => {
        if (step === 2)
            addBikeModel(brandID);
        else
            try {
                setStep(2);
                setSelectedBrandID(brandID)
                setLoading(true);
                let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.BIKE_BRAND + "/" + brandID + "/model", token)
                if (response ?.status) {
                    setBikeModels(response ?.data);
                    setFlatListData(response ?.data);
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


    const renderItem = ({ item, index }) => <BrandCard brand={item} onPress={() => fetchBikeModels(item._id)} />;
    return (
        <Box p={5} flex={1} mb={12}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={2} mb={4}>
                    <VStack space={2} mb={4}>
                        <HStack mb={3}>
                            <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                                Select Brand
                            </Text>
                            <CustomButton onPress={closeBottomSheet} btnStyle={{ height: 30, width: "10%", position: "absolute", right: 0, top: 0, borderRadius: 0, paddingTop: 4 }} textStyle={{ fontSize: 12 }}>X</CustomButton>
                        </HStack>
                        <Divider />
                        <FlatListContainer
                            keyExtractor={(item) => item._id}
                            emptyMessage="No bike found"
                            containerStyle={{ margin: 0.5 }}
                            data={flatListData}
                            numColumns={3}
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

export default AddBike;
