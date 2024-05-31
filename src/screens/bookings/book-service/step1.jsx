import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Box, Text, Button, VStack, HStack, Pressable, ScrollView, Divider } from 'native-base';
import Header from '../../../components/header';
import FlatListContainer from '../../../components/flatlist';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { useAuth } from '../../../context/loginContext';
import VechicleCard from '../../../components/vechicle/single-vehicle'
import { useIsFocused } from '@react-navigation/native';
const SelectBike = ({ validateStep1, setSelectedBike, navigation }) => {


  const isFocused = useIsFocused();


  const { token } = useAuth();

  const [vehicalData, setVehicalData] = useState([])
  const [isLoading, setLoading] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);

  const [selectedBikeIndex, setSelectedBikeIndex] = useState(-1)

  useEffect(() => {
    if (isFocused)
      fetchSavedVechiclesData();
  }, [isFocused]);

  const fetchSavedVechiclesData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_USER_VEHICLES, token)
      if (response ?.status) {
        let fullData = response ?.data;
        let vehicalData = []
        for (let index = 0; index < fullData.length; index++) {
          vehicalData.push({
            "id": fullData[index] ?.model ?._id,
            "name": fullData[index] ?.model ?.name,
            "brand_name": fullData[index] ?.model ?.brand?.name,
            "image": fullData[index] ?.model ?.icon,
            "cc": fullData[index] ?.model ?.cc,
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

  const onVehiclePressed = (item, index) => {
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
        <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={() => navigation.navigate("MyVehicles")}>
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
        <Divider />

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
