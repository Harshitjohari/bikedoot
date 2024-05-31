import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Box, Text, Divider, VStack, Button } from 'native-base';
import FlatListContainer from '../../../components/flatlist';
import ServiceCard from '../../../components/bookings/services-list/single-service';
import AccessoriesCard from '../../../components/accessories/single-accessories'
import Header from '../../../components/header';
import CustomButton from '../../../components/UI/button';
import CustomBottomSheet from "../../../components/modals";
const { height } = Dimensions.get('window');
const AddAllServices = ({ selectedBike, calculateTotalAmount, horizontal = false, services, accessories, addOns, setSelectedAccessories, selectedAccessories, selectedAddOns, setSelectedAddOns, selectedServices, setSelectedServices }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [accessoriesData, setAccessoriesData] = useState(accessories);
    const [addOnData, setAddOnData] = useState(addOns);
    const [servicesData, setServicesData] = useState(services);

    const [bottomSheetHeight, setBottomSheetHeight] = useState(height - 100);
    const [contentType, setContentType] = useState('');

    const [openAddressModal, setOpenAddressModal] = useState(false);


    useEffect(() => {
        let servicesDataTemp = [];
        for (let index = 0; index < servicesData.length; index++) {
            if (servicesData[index] ?.cc ?._id === selectedBike ?.cc ?._id) {
                servicesDataTemp.push(servicesData[index]);
            }
        }
        setServicesData(servicesDataTemp)
    }, []);

    const onItemPressed = (item, index) => {
        // Create a new array to avoid directly modifying the state
        const updatedServices = [...servicesData];
        // Update the is_selected property based on the _id
        updatedServices.forEach((booking, i) => {
            if (booking._id === item._id) {
                updatedServices[i].is_selected = true;
                setSelectedServices(updatedServices[i]);
            } else {
                updatedServices[i].is_selected = false;
            }
        });
        // Update the state with the modified array
        setServicesData(updatedServices);

        calculateTotalAmount();


    };

    const clearServices = (item, index) => {
        const updatedServices = [...servicesData];
        updatedServices.forEach((booking, i) => {
            updatedServices[i].is_selected = false;
        });
        // Update the state with the modified array
        setServicesData(updatedServices);
        setSelectedServices({})
        calculateTotalAmount();
    };

    const onItemRemoved = (item, index) => {
        const updatedServices = [...addOnData];
        // Update the is_selected property based on the _id
        updatedServices.forEach((booking, i) => {
            if (booking._id === item._id) {
                updatedServices[i].is_selected = false;
            }
            // setSelectedServices(updatedServices[i]);
        });

        setAddOnData(updatedServices)
        setSelectedAddOns(selectedAddOns.filter(service => service._id !== item._id))
        calculateTotalAmount();
    };

    // const onAccessoriesItemRemoved = (item, index) => {
    //     setSelectedAccessories(selectedAccessories.filter(service => service._id !== item._id))
    //     calculateTotalAmount();
    // };

    const onAccessoriesItemRemoved = (item, index) => {
        const updatedAccessories = [...selectedAccessories];
        updatedAccessories.splice(index, 1); // Removes 1 element at the specified index
        setSelectedAccessories(updatedAccessories);
        calculateTotalAmount();
      };
      

    const renderItem = ({ item, index }) => <ServiceCard onPress={() => onItemPressed(item, index)} booking={item} />;
    const renderAddOnsItem = ({ item, index }) => <ServiceCard showRemoveBtn={true} itemRemovedBtnPressed={() => onItemRemoved(item, index)} onPress={() => onItemPressed(item, index)} booking={item} />;
    const renderAccessoriesItem = ({ item, index }) => <AccessoriesCard showRemoveBtn={true} itemRemovedBtnPressed={() => onAccessoriesItemRemoved(item, index)} booking={item} />;

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

    return (
        <Box p={0} flex={1} mb={12}>
            <CustomBottomSheet ref={bottomSheetRef} height={bottomSheetHeight} openDuration={250}
                contentType={contentType}
                setSelectedAddOns={setSelectedAddOns}
                addOnData={addOnData}
                setData={setAddOnData}
                setSelectedAccessories={setSelectedAccessories}
                accessories={accessoriesData}
                closeBottomSheet={() => closeBottomSheet()}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={2} mb={4}>
                    <VStack space={2} mb={4}>
                        <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                            Select Service
                        </Text>
                        <Divider />

                        <FlatListContainer
                            containerStyle={{ margin: 0 }}
                            data={servicesData}
                            isLoading={isLoading}
                            renderItem={renderItem} // Pass the renderItem function as a prop
                        />
                        <Button style={{ borderWidth: 1, borderColor: "#000", backgroundColor: "transparent", color: "#000" }} onPress={() => clearServices()}><Text color="#000">Clear Service</Text></Button>
                    </VStack>

                    <VStack space={2} mb={4}>
                        <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                            Select Accessories
                        </Text>
                        <Divider />
                        <FlatListContainer
                            containerStyle={{ margin: 0 }}
                            data={selectedAccessories}
                            isLoading={isLoading}
                            showEmaptyMessage={false}
                            renderItem={renderAccessoriesItem} // Pass the renderItem function as a prop
                        />
                        <CustomButton onPress={() => openBottomSheet("accessories")} btnStyle={{ width: "30%", alignSelf: "center", height: 40, borderRadius: 5, borderWidth: 2, borderColor: "#DDD", backgroundColor: "transparent", alignItems: "center", alignContents: "center", paddingTop: 8 }} textStyle={{ color: "#000", fontSize: 12 }}>{selectedAccessories.length > 0 ? "Add More" : "Click to add"}</CustomButton>
                    </VStack>

                    <VStack space={2} mb={4}>
                        <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                            Select Add Ons
                        </Text>
                        <Divider />
                        <FlatListContainer
                            containerStyle={{ margin: 0 }}
                            data={selectedAddOns}
                            isLoading={isLoading}
                            showEmaptyMessage={false}
                            renderItem={renderAddOnsItem} // Pass the renderItem function as a prop
                        />
                        <CustomButton onPress={() => openBottomSheet()} btnStyle={{ width: "30%", alignSelf: "center", height: 40, borderRadius: 5, borderWidth: 2, borderColor: "#DDD", backgroundColor: "transparent", alignItems: "center", alignContents: "center", paddingTop: 8 }} textStyle={{ color: "#000", fontSize: 12 }}>{selectedAddOns.length > 0 ? "Add More" : "Click to add"}</CustomButton>
                    </VStack>

                </VStack>
            </ScrollView>
        </Box>
    );
};

export default AddAllServices;
