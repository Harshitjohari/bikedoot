import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { View, Box, Text, Button, VStack, HStack, Pressable, ScrollView, Divider } from 'native-base';
import Header from '../../../components/header';
import FlatListContainer from '../../../components/flatlist';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { useAuth } from '../../../context/loginContext';
import VechicleCard from '../../../components/vechicle/single-vehicle'
import { useIsFocused } from '@react-navigation/native';
import CustomBottomSheet from "../../../components/modals";
const { height } = Dimensions.get("window")


const SelectBike = ({
  setAddOnData,
  addOnData,
  setSelectedAccessories,
  setSelectedAddOns,
  setSelectedServices,
  servicesData,
  setServicesData,
  selectedBike, validateStep1, setSelectedBike, navigation }) => {

  const isFocused = useIsFocused();

  const { token } = useAuth();

  const [vehicalData, setVehicalData] = useState([])
  const [isLoading, setLoading] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);

  const [selectedBikeIndex, setSelectedBikeIndex] = useState(-1)
  const [bottomSheetHeight, setBottomSheetHeight] = useState(height - 100);
  const [contentType, setContentType] = useState('');


  useEffect(() => {
    if (isFocused) {
      fetchSavedVechiclesData();
    }
  }, [isFocused]);

  const bottomSheetRef = useRef(null);

  const openBottomSheet = (type = "add_bike") => {

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

  const fetchSavedVechiclesData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_USER_VEHICLES, token)
      if (response?.status) {
        let fullData = response?.data;
        let vehicalData = []
        for (let index = 0; index < fullData.length; index++) {

          if (Object.keys(selectedBike).length !== 0) {
            if (selectedBike.uniqueID === fullData[index]?._id)
              setSelectedBikeIndex(index);
          }

          vehicalData.push({
            "uniqueID": fullData[index]?._id,
            "id": fullData[index]?.model?._id,
            "name": fullData[index]?.model?.name,
            "brand_name": fullData[index]?.model?.brand?.name,
            "image": fullData[index]?.model?.icon,
            "cc": fullData[index]?.model?.cc,
          })
        }
        if (vehicalData.length > 0)
          validateStep1(true)
        else
          validateStep1(false)

        setVehicalData(vehicalData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };


  const clearAddOns = () => {
    const updatedServices = [...addOnData];
    // Update the is_selected property based on the _id
    updatedServices.forEach((booking, i) => {
      updatedServices[i].is_selected = false;
    });

    setAddOnData(updatedServices)
    setSelectedAddOns([])
  };

  const clearServices = () => {
    const updatedServices = [...servicesData];
    updatedServices.forEach((booking, i) => {
      updatedServices[i].is_selected = false;
    });
    // Update the state with the modified array
    setServicesData(updatedServices);
    setSelectedServices({})
  };

  const onVehiclePressed = (item, index) => {

    if (Object.keys(selectedBike).length !== 0) {
      if (selectedBike.uniqueID !== item?.uniqueID)
        //clear accessories
        setSelectedAccessories([])
      //clear addons
      clearAddOns();
      //clear services
      clearServices()
    }
    setSelectedBikeIndex(index);
    setSelectedBike(item)
  }

  const renderItem = ({ item, index }) => <VechicleCard index={index} vehicleData={item} showDelete={false} selectedBikeIndex={selectedBikeIndex} onVehiclePressed={() => onVehiclePressed(item, index)} />;

  return (
    <Box p={0} flex={1}>
      <VStack space={2} mb={4}>
        <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
          Select Bike
        </Text>
        {
          vehicalData.length > 0 &&
          <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={() => openBottomSheet()}>
            {/* <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={() => navigation.navigate("MyVehicles")}> */}
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
        }

        {
          vehicalData.length == 0 &&
          <TouchableOpacity style={{ alignSelf: 'center', right: 0 }} onPress={() => openBottomSheet()}>
            {/* <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={() => navigation.navigate("MyVehicles")}> */}
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
                Add New Bike
              </Text>
            </Box>
          </TouchableOpacity>
        }

        <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
          contentType={contentType}
          closeBottomSheet={() => closeBottomSheet()}
          fetchSavedVechiclesData={() => fetchSavedVechiclesData()}
        />
        <Divider />

        {
          vehicalData.length > 0 &&
          <Text fontWeight="400" fontSize={15} mb={0} alignSelf={'center'} lineHeight="20px" color="bd_dark_text">
            Choose Your Bike For Service
          </Text>
        }


        <ScrollView showsVerticalScrollIndicator={false}>
          <Box flex={1} justifyContent="center" p={2} bg="bg_white">
            <FlatListContainer
              containerStyle={{ margin: 0 }}
              data={vehicalData}
              keyExtractor={(item) => item.id}
              emptyMessage="No vehicles found"
              isLoading={isLoading}
              numColumns={2}
              contentContainerStyle={{ padding: 0 }}
              renderItem={renderItem} // Pass the renderItem function as a prop
            />
          </Box>
        </ScrollView>


      </VStack>
    </Box>
  );
};

export default SelectBike;
