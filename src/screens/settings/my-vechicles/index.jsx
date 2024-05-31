import React, { useState, useEffect,useRef } from 'react';
import { View,Dimensions } from 'react-native';
import { Box, Heading, Avatar, Input, Button, Toast, Text, ScrollView } from 'native-base';
import { handleToast } from '../../../utils/toast';
import CommonStyle from '../../../assets/style';
import CustomButton from '../../../components/UI/button'
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import Header from '../../../components/header';
import VechicleCard from '../../../components/vechicle/single-vehicle'
import FlatListContainer from '../../../components/flatlist';
import { useAuth } from '../../../context/loginContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomBottomSheet from "../../../components/modals";
const {height} = Dimensions.get("window")

const MyVehicles = ({ navigation }) => {
    const { token } = useAuth();
    const { show, close, closeAll } = handleToast();
    const [isLoading, setLoading] = useState(false);
    const [vehicalData, setVehicalData] = useState([])
    const [vehicalFullData, setVehicalFullData] = useState([])

    const [contentType, setContentType] = useState('');
    const [bottomSheetHeight, setBottomSheetHeight] = useState(height-100);

    useEffect(() => {
        fetchSavedVechiclesData();
    }, []);

    const fetchSavedVechiclesData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_USER_VEHICLES, token)
            if (response ?.status) {
                let fullData = response ?.data;
                setVehicalFullData(fullData);
                let vehicalData = []
                for (let index = 0; index < fullData.length; index++) {
                    vehicalData.push({
                        "id" : fullData[index]?._id,
                        "name": fullData[index] ?.model ?.name,
                        "image": fullData[index] ?.model ?.icon,
                        "brand": fullData[index] ?.model?.brand?.name,
                        "cc": fullData[index] ?.model?.cc,
                    })
                }
                setVehicalData(vehicalData);
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

    const onVehicleDelete = async (id) => {
        try {
            let response = await Apis.HttpDeleteRequest(Constant.BASE_URL + Constant.GET_USER_VEHICLES + "/" + id, token, {})
            if (response ?.status) {
                fetchSavedVechiclesData()
                show(response ?.message, "success");
            } else {
                show(response ?.message || "Failed to delete, please try again later", "error");
            }
        } catch (e) {
            show("Some error has occured!", "error");
        }
    }

    const renderItem = ({ item, index }) => <VechicleCard vehicleData={item} onVehicleDelete={() => onVehicleDelete(item.id)} />;


    const bottomSheetRef = useRef(null);

    const openBottomSheet = (type = "add_bike") => {

        setBottomSheetHeight(height-100)
        setContentType(type);
        setTimeout(() => {
            bottomSheetRef.current.open();
        }, 50)
    };

    const closeBottomSheet = () => {
        setContentType("");
        bottomSheetRef.current.close();
    };

    return (
        <Box flex={1} justifyContent="center" p={0} bg="screen_bg">
            <Header title="My Vehicles" navigation={navigation} 
            showRightBtn={true}
            onBtnPressed={()=> openBottomSheet()}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
             
            <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
                    contentType={contentType}
                    closeBottomSheet={()=>closeBottomSheet()}
                    fetchSavedVechiclesData={()=> fetchSavedVechiclesData()}
                    />

                <Box flex={1} justifyContent="center" p={2} bg="bg_white">
                    <FlatListContainer
                        containerStyle={{ margin: 0 }}
                        data={vehicalData}
                        keyExtractor={(item) => item.id}
                        emptyMessage="No vehicles found"
                        isLoading={isLoading}
                        // numColumns={2}
                        horizontal={false}
                        contentContainerStyle={{ padding: 0 }}
                        renderItem={renderItem} // Pass the renderItem function as a prop
                    />
                </Box>
            </ScrollView>

        </Box>
    );
};

export default MyVehicles;
