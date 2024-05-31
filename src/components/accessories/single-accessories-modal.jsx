import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, Pressable } from 'native-base';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AccessoriesCard = ({ showAddButton = true, data, onVehicleDelete, onPress }) => {
    const {
        name,
        icon,
        price
    } = data;

    let image = { name: require("../../assets/images/tool.png") }
    if (icon)
        image = { name: { uri: icon } }

    return (
        <Box
            flex={1}
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            flexWrap="wrap"
            justifyContent="space-between"
            rowGap={1}
            shadow={0}
            m={0.5}>
            <Box
                width="100%"
                bg="white"
                borderRadius="10px"
                borderBottomRadius={showAddButton ? "0px" : "10px"}
                p={3}>

                {/* First Row */}
                <HStack space={0}
                    alignSelf="center"
                    alignItems="center"
                    justifyContent="center">
                    <Box bg="white" p={0} borderRadius="10px" borderWidth={0} borderColor="gray.200" shadow={0.8} mr={0}
                        alignSelf="center"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* Round Box */}
                        <Box
                            bg="#eeedff"
                            borderRadius="full"
                            width={20}
                            height={20}
                            alignSelf="center"
                            alignItems="center"
                            justifyContent="center">
                            {/* Image Icon */}
                            <Image style={{
                                resizeMode: "contain"
                            }} alignItems="center" textAlign="center" source={image?.name} alt="Icon" width={10} height={10} />
                        </Box>

                        <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={2} fontWeight="800">
                            {name}
                        </Text>

                        <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={2} fontWeight="800">
                            {price}
                        </Text>
                    </Box>
                </HStack>
            </Box>

            {showAddButton && <Pressable onPress={onPress}>
                <Box
                    width="100%"
                    bg={"#5349f8"}
                    borderRadius="10px"
                    borderTopRadius="0px"
                    p={3}>
                    <HStack space={2}>
                        <Box flex={4}>
                            <Box flex={1.5} alignItems="center">
                                {/* <FontAwesome color="#7F7F7F" size={16} name="trash" /> */}
                                <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={0} fontWeight="700" color="#FFF">
                                    Add
                                    </Text>
                            </Box>
                        </Box>
                    </HStack>
                </Box>
            </Pressable>}


        </Box>
    );
};

export default AccessoriesCard;
