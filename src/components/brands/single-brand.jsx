import React from 'react';

import { Box, Image, Text, HStack, IconButton, Divider,Pressable } from 'native-base';
import BadgeComponent from '../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BrandCard = ({ index, brand, onPress }) => {
    const {
        name,
        icon,
    } = brand;
    return (
        <Box
            flex={1}
            bg="#FFF"
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            justifyContent="space-between"
            rowGap={1}
            alignItems="center" justifyContent="center" alignSelf="center"
            shadow={0}

            m={0.5}>
            <Pressable alignItems="center" justifyContent="center" alignSelf="center" onPress={onPress} >
                <Box
                    width="100%"
                    bg="white"
                    borderRadius="10px"
                    alignItems="center" justifyContent="center" alignSelf="center"
                    // borderBottomRadius={"0px"}
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
                                bg="#ffffff"
                                borderRadius="full"
                                width={20}
                                height={20}
                                alignSelf="center"
                                alignItems="center"
                                justifyContent="center">
                                {/* Image Icon */}
                                <Image style={{
                                    resizeMode: "contain"
                                }} alignItems="center" textAlign="center" source={{ uri: icon }} alt="Icon" width={20} height={20} />
                            </Box>

                            <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={2} fontWeight="800">
                                {name}
                            </Text>
                        </Box>
                    </HStack>
                </Box>
            </Pressable>
        </Box>
    );
};

export default BrandCard;
