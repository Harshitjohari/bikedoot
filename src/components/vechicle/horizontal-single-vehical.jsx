import React from 'react';
import { Box, Image, Text, HStack, Pressable } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const VehicleCard = ({ width = "undefined", index, vehicleData, onVehicleDelete, onVehiclePressed, selectedBikeIndex }) => {
    const {
        name,
        image,
        brand_name, // Add description from your data
    } = vehicleData;

    return (
        <Box
            width={"100%"}
            borderColor="#E1E1E1"
            borderWidth={1}
            borderRadius="10px"
            mb={2}
            flexWrap="wrap"
            justifyContent="space-between"
            rowGap={1}
            shadow={0}
            m={0.5}>
            <Pressable onPress={onVehiclePressed} style={{ width: '100%' }}>
                <Box
                    bg="white"
                    borderRadius="10px"
                    p={3}
                >
                    <HStack space={2}>
                        <Box flex={1}>
                            {/* Image Icon */}
                            <Image
                                source={{ uri: image }}
                                alt="Icon"
                                width={60}
                                height={60}
                                borderRadius="0px"
                            />
                        </Box>
                        <Box flex={3}>
                            {/* Text name and description */}
                            <Text fontWeight="bold" color="bd_dark" fontSize="bd_sm" numberOfLines={1} textAlign="left" mb={1}>
                                {brand_name}
                            </Text>
                            <Text fontSize="bd_xsm" color="bd_sec_text" numberOfLines={2} textAlign="left">
                                {name}
                            </Text>
                        </Box>
                    </HStack>
                </Box>
            </Pressable>


        </Box>
    );
};

export default VehicleCard;
