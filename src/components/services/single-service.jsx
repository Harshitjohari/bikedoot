import React, { useState } from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, View, Pressable, FlatList, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ratings from '../UI/rating'
import Button from '../UI/button'
import { compareSpecificity } from 'native-base/lib/typescript/hooks/useThemeProps/propsFlattener';

const ServicesCard = ({ fromDetailPage = false, serviceObj, serviceType, navigation, title }) => {
    let {
        _id,
        name,
        distance,
        specialization = '',
        serviceCategory,
        icon = "https://freepngimg.com/thumb/bike/23104-9-hero-bike-transparent-background.png",
        avgRating,
        ratingCount,
        address
    } = serviceObj;

    serviceCategory = serviceCategory.filter( d=> d.active)

    const TruncatedText = ({ text }) => {
        const [showFullText, setShowFullText] = useState(false);

        const toggleFullText = () => {
            setShowFullText(!showFullText);
        };

        const truncatedText = text.length > 40 ? text.slice(0, 40) + '...' : text;

        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'grey', fontWeight: 500, fontSize: 12, lineHeight: 20 }}>
                        {showFullText ? text : truncatedText}
                    </Text>
                </View>
                {text.length > 40 && (
                    <TouchableOpacity onPress={toggleFullText}>
                        <Text style={{ color: 'blue', fontWeight: 500, fontSize: 12 }}>
                            {showFullText ? 'Read Less' : 'Read More'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };



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
                    <Box flex={7}>
                        {/* <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">
                            {name}
                        </Text> */}
                        <HStack>
                            <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">
                                {name}
                            </Text>
                            <Text fontWeight="500" fontSize={10} mb={0} lineHeight="20px" color="grey" marginLeft={1}>
                                ({distance})
                            </Text>
                        </HStack>
                        <Text fontWeight="400" fontSize={12} mb={2} lineHeight="20px" color="grey">
                            {address}
                        </Text>
                        <TruncatedText text={specialization} />
                        <Ratings count={avgRating ? avgRating : 0} rating={avgRating ? avgRating : 0} ratingCount={avgRating} />

                        {!fromDetailPage &&

                            <HStack space={5} >
                                <Button onPress={() => navigation.navigate('DateTimeSelectStep1', { garageID: _id, name: name, serviceType: serviceType, title: title })} p={0} mt={5} textStyle={{ fontSize: 12, fontWeight: "500" }} btnStyle={{ height: 40, borderRadius: 50, padding: 0, width: fromDetailPage ? "100%" : "60%" }}>Book Now</Button>
                                {!fromDetailPage && <Button onPress={() => navigation.navigate('ServiceDetailPage', { garageID: _id, name: name, address: address, distance: distance, serviceType: serviceType, title: title })} p={0} mt={5} textStyle={{ fontSize: 12, fontWeight: "500" }} btnStyle={{ height: 40, borderRadius: 50, padding: 0, width: "60%" }}>View Garage</Button>}
                            </HStack>

                        }

                        {/* {fromDetailPage && 

                        <View alignContent={'center'} justifyContent="center" alignItems="center" marginLeft={20}>
                        <HStack space={2}>
                            <Button 
                                onPress={() => navigation.navigate('DateTimeSelectStep1', { garageID: _id, name: name, serviceType: serviceType })} 
                                p={0} 
                                mt={5} 
                                textStyle={{ fontSize: 12, fontWeight: "500" }} 
                                btnStyle={{ height: 40, borderRadius: 50, padding: 0, width: fromDetailPage ? "100%" : "50%" }}
                            >
                                Book Now
                            </Button>
                        </HStack>
                        </View>
                        } */}



                    </Box>

                    <Pressable onPress={() => navigation.navigate('ServiceDetailPage', { garageID: _id, name: name, serviceType: serviceType, title: title })} flex={1.5} alignItems="flex-end">
                        <Image
                            source={{ uri: icon }}
                            alt="Bike Image"
                            size={"62px"}
                            borderRadius="md"
                            resizeMode='contain'
                        />
                    </Pressable>
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
                        {/* <FlatList
                        data={serviceCategory}
                        renderItem={(data) => {
                            return (
                                <HStack key={data._id} mr={4} space={1}>
                                    <FontAwesome5
                                        color={data.item?.active ? "#5cb85c" : "#bb2124"}
                                        name={data.item?.active ? "check-circle" : "times-circle"}
                                    />
                                    <Text
                                        fontWeight="600"
                                        fontSize="bd_xsm"
                                        mb={1}
                                        lineHeight="14px"
                                        color="#616C82"
                                    >
                                        {data.item?.name}
                                    </Text>
                                </HStack>
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        numColumns={2}
                    /> */}

                        {/* {serviceCategory.map((data, index) => {
                            return (
                                <HStack space={1}>
                                    <FontAwesome5 color={data?.active ? "#5cb85c" : "#bb2124"} name={data?.active ? "check-circle" : "times-circle"} />
                                    <Text fontWeight="600" fontSize="bd_xsm" mb={1} lineHeight="14px" color="#616C82">
                                        {data?.name}
                                    </Text>
                                </HStack>
                            )
                        })} */}



                        {serviceCategory.map((data, index) => {
                            const isEvenIndex = index % 2 === 0;
                            const hasNextItem = index + 1 < serviceCategory.length;

                            if (isEvenIndex && hasNextItem) {
                                const nextData = serviceCategory[index + 1];
                                return (
                                    <HStack space={3} key={index}>
                                        <HStack space={1}>
                                            <FontAwesome5 color={data.active ? "#5cb85c" : "#bb2124"} name={data.active ? "check-circle" : "times-circle"} />
                                            <Text fontWeight="600" fontSize="bd_xsm" mb={1} lineHeight="14px" color="#616C82">
                                                {data.name}
                                            </Text>
                                        </HStack>
                                        <HStack space={1}>
                                            <FontAwesome5 color={nextData.active ? "#5cb85c" : "#bb2124"} name={nextData.active ? "check-circle" : "times-circle"} />
                                            <Text fontWeight="600" fontSize="bd_xsm" mb={1} lineHeight="14px" color="#616C82">
                                                {nextData.name}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                );
                            } else if (!hasNextItem && isEvenIndex) {
                                return (
                                    <HStack key={index} space={1}>
                                        <FontAwesome5 color={data.active ? "#5cb85c" : "#bb2124"} name={data.active ? "check-circle" : "times-circle"} />
                                        <Text fontWeight="600" fontSize="bd_xsm" mb={1} lineHeight="14px" color="#616C82">
                                            {data.name}
                                        </Text>
                                    </HStack>
                                );
                            }
                        })}

                    </Box>
                </HStack>
            </Box>
        </Box>
    );
};

export default ServicesCard;
