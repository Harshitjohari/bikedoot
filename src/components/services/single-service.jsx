import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider } from 'native-base';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ratings from '../UI/rating'
import Button from '../UI/button'

const ServicesCard = ({ fromDetailPage = false, serviceObj, navigation }) => {
    const {
        _id,
        name,
        specialization,
        serviceCategory,
        icon = "https://freepngimg.com/thumb/bike/23104-9-hero-bike-transparent-background.png"
    } = serviceObj;

    return (
        <Box
            width="100%"
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            shadow={0}>
            <Box
                width="100%"
                bg="white"
                borderRadius="10px"
                borderBottomRadius="0px"
                p={3}>

                {/* First Row */}
                <HStack space={4}>
                    <Box flex={2.5}>
                        <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">
                            {name}
                        </Text>
                        <Text fontWeight="400" fontSize="bd_xsm" mb={3} lineHeight="16px" color="bd_sec_text">
                            {specialization}
                        </Text>
                        <Ratings count={10} rating={3.2} />
                        <HStack space={2}>
                            <Button onPress={() => navigation.navigate('DateTimeSelectStep1', { garageID: _id, name: name })} p={0} mt={5} textStyle={{ fontSize: 12, fontWeight: "500" }} btnStyle={{ height: 40, borderRadius: 50, padding: 0, width: fromDetailPage ? "100%" : "50%" }}>Book Now</Button>
                           {!fromDetailPage && <Button onPress={() => navigation.navigate('ServiceDetailPage', { garageID: _id, name: name })} p={0} mt={5} textStyle={{ fontSize: 12, fontWeight: "500" }} btnStyle={{ height: 40, borderRadius: 50, padding: 0, width: "50%" }}>View Garage</Button>}
                        </HStack>
                    </Box>

                    <Box flex={1.5} alignItems="flex-end">
                        <Image
                            source={{ uri: icon }}
                            alt="Bike Image"
                            size={"62px"}
                            borderRadius="md"
                        />
                    </Box>
                </HStack>
            </Box>

            <Box
                width="100%"
                bg="#F1F0FE"
                borderRadius="10px"
                borderTopRadius="0px"
                p={3}>

                <HStack space={2}>
                    <Box flex={4}>
                        {serviceCategory.map((data, index) => {
                            return (
                                <HStack space={1}>
                                    <FontAwesome5 color={data ?.active ? "#5cb85c" : "#bb2124"} name={data ?.active ? "check-circle" : "times-circle"} />
                                    <Text fontWeight="400" fontSize="bd_xsm" mb={1} lineHeight="14px" color="#616C82">
                                        {data ?.name}
                                    </Text>
                                </HStack>
                            )
                        })}
                    </Box>
                </HStack>
            </Box>
        </Box>
    );
};

export default ServicesCard;
