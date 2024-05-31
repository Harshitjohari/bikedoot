import React, { useState, useEffect } from 'react';
import { Linking, FlatList } from 'react-native'
import { Box, Button, ScrollView, Text, VStack, HStack, Divider } from 'native-base';
import RatingList from '../../../components/UI/rating_list'


const AboutTab = ({ about = "N/A" }) => {
    return (
        <VStack space={2} mb={4} alignItems={'stretch'}>
            <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text" textAlign="justify">
                {about}
            </Text>
        </VStack>
    )
};

const LocationTab = ({ about = "N/A", navigate }) => {
    return (
        <VStack space={2} mb={4} justifyContent={'center'} flex={1}>
            <Box>
                <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text">
                    { }
                </Text>
            </Box>
            <Box flex={1} justifyContent="center" alignItems="center">
                <CustomButton btnStyle={{ width: "25%" }} textStyle={{ fontSize: 13, fontWeight: 500 }} onPress={navigate}>Navigate</CustomButton>
            </Box>
        </VStack>

        // <VStack space={2} mb={4} justifyContent={'center'} alignSelf={''}>
        //     <CustomButton btnStyle={{ width: "30%" }} onPress={navigate}>Navigate</CustomButton>
        // </VStack>
    )
};

const ReviewsTab = ({ rating }) => {
    const renderItem = ({ item }) => (
        <RatingList
            userName={item.user.name}
            userImage={item.user?.profile || 'https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png'}
            value={item.garageRating}
            review={item.garageReview}
        />
    )
    return (
        <>
            {
                rating.length > 0 ?
                    <VStack space={2} mb={4}>
                        <FlatList
                            data={rating}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,
                            }}
                        />
                    </VStack>
                    :
                    <VStack space={2} mb={4}>
                        <Text fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="20px" color="bd_dark_text">
                            No reviews found
                        </Text>
                    </VStack>
            }
        </>
    )
};


// const ServicesTab = ({ services }) => {
//     // console.log('=================>',services)
//     return (
//         <VStack space={2} mb={4}>
//             <Box>
//                 {services.map((serviceType, index) => (
//                     <Box key={index} mb={4}>
//                         <Text fontSize="lg" fontWeight="bold">
//                             {serviceType.type}
//                         </Text>
//                         {serviceType.data.length === 0 ? (
//                             <Text>No {serviceType.type} available</Text>
//                         ) : (
//                             <Box mt={2}>
//                                 {serviceType.data.map((service) => {
//                                     return (
//                                         <VStack space={2} key={service._id} pt={2}>
//                                             <HStack space={4}>
//                                                 <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">{service?.name} {service?.cc?.name}</Text>
//                                                 <Text style={{ position: "absolute", right: 0 }} fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">{'\u20B9' + service?.price}</Text>
//                                             </HStack>
//                                             <Divider />
//                                         </VStack>
//                                     )
//                                 })}
//                             </Box>
//                         )}
//                     </Box>
//                 ))}
//             </Box>
//         </VStack>
//     )
// };

const ServicesTab = ({ services }) => {
    return (
        <VStack space={2} mb={4}>
            <Box>
                {services.map((serviceType, index) => {
                    let ccGroupService = serviceType?.data.reduce((arr, item) => {
                        let refIndex = arr.findIndex(a => a._id == item.cc._id)
                        if (refIndex < 0) {
                            arr.push({
                                _id: item.cc._id,
                                name: item.cc.name,
                                data: [item]
                            })
                        } else {
                            arr[refIndex].data.push(item)
                        }

                        return arr
                    }, [])
                    return (
                        <Box key={index} my={4}>
                            <Text fontSize="lg" fontWeight="bold">
                                {serviceType.type}
                            </Text>
                            <Divider mt={2}/>
                            {serviceType.data.length === 0 ? (
                                <Text>No {serviceType.type} available</Text>
                            ) : (
                                <Box>
                                    {
                                        ccGroupService.map(cc => {
                                            return (
                                                <>
                                                    <Text style ={{
                                                        marginTop : 15,
                                                        color:'#333',
                                                        fontWeight:'600'
                                                    }}>
                                                        {cc?.name}
                                                    </Text>

                                                    {cc.data.map((service) => {
                                                        return (
                                                            <VStack space={2} key={service._id} pt={2}>
                                                                <HStack space={4}>
                                                                    <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">{service?.name}</Text>
                                                                    <Text style={{ position: "absolute", right: 0 }} fontWeight="500" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_dark_text">{'\u20B9' + service?.price}</Text>
                                                                </HStack>
                                                                {/* <Divider /> */}
                                                            </VStack>
                                                        )
                                                    })}
                                                </>
                                            )
                                        })
                                    }

                                </Box>
                            )}
                        </Box>
                    )
                })}
            </Box>
        </VStack>
    )
};


import CustomButton from '../../../components/UI/button'

const TabsScreen = ({ about, services, rating, direction }) => {
    const navigate = () => {
        
        const coordinates = `${direction?.latitude},${direction?.longitude}`;
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
        Linking.openURL(mapUrl);
    }

    const tabs = [
        { title: 'About', component: <AboutTab about={about} /> },
        { title: 'Services', component: <ServicesTab services={services} /> },
        { title: 'Location', component: <LocationTab navigate={navigate} /> },
        { title: 'Reviews', component: <ReviewsTab rating={rating} /> },
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
