import React, { useState } from 'react';
import { Linking } from 'react-native'
import { Box, Button, ScrollView, Text, VStack, HStack, Divider } from 'native-base';

const AboutTab = ({ about = "N/A" }) => {
    return (
        <VStack space={2} mb={4}>
            <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text">
                {about}
            </Text>
        </VStack>
    )
};

const LocationTab = ({ about = "N/A", navigate }) => {
    return (
        <VStack space={2} mb={4}>
            <CustomButton btnStyle={{  width: "40%" }} onPress={navigate}>Navigate</CustomButton>
        </VStack>
    )
};

const ReviewsTab = () => {
    return (
        <VStack space={2} mb={4}>
            <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text">
                No reviews found
         </Text>
        </VStack>
    )
};

const ServicesTab = ({ services }) => {
    return (
        <VStack space={2} mb={4}>
            <Box>
                {services.map((serviceType, index) => (
                    <Box key={index} mb={4}>
                        <Text fontSize="lg" fontWeight="bold">
                            {serviceType.type}
                        </Text>
                        {serviceType.data.length === 0 ? (
                            <Text>No {serviceType.type} available</Text>
                        ) : (
                                <Box mt={2}>
                                    {serviceType.data.map((service) => {
                                        return (
                                            <VStack space={2} key={service._id} pt={2}>
                                                <HStack space={4}>
                                                    <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">{service ?.name}</Text>
                                                    <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">{'\u20B9' + service ?.price}</Text>


                                                </HStack>
                                                <Divider />
                                            </VStack>
                                        )
                                    })}
                                </Box>
                            )}
                    </Box>
                ))}
            </Box>
        </VStack>
    )
};
import CustomButton from '../../../components/UI/button'

const TabsScreen = ({ about, services }) => {


    const navigate = () => {
        const coordinates = '37.7749,-122.4194';
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
        Linking.openURL(mapUrl);
    }

    const tabs = [
        { title: 'About', component: <AboutTab about={about} /> },
        { title: 'Location', component: <LocationTab navigate={navigate} /> },
        { title: 'Reviews', component: <ReviewsTab /> },
        { title: 'Services', component: <ServicesTab services={services} /> },
    ];

    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box bg="#FFF" borderRadius="10px" borderWidth="1px" borderColor="#CCC" p={1}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Button.Group
                    space={2}
                    mx={2}
                    my={4}
                    alignSelf="center"
                    onPress={(index) => setActiveTab(index)}
                    selected={activeTab}
                >
                    {tabs.map((tab, index) => (
                        <CustomButton btnStyle={{ height: 40, backgroundColor: activeTab === index ? "#5349f8" : "#c4ceff" }} textStyle={{ fontSize: 14, color: activeTab === index ? "#FFF" : "#5349f8" }} onPress={() => setActiveTab(index)} key={index}>{tab.title}</CustomButton>
                    ))}
                </Button.Group>
            </ScrollView>

            <Box mt={0} p={2}>{tabs[activeTab].component}</Box>
        </Box>
    );
};

export default TabsScreen;
