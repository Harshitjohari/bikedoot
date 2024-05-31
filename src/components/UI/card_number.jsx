import React from 'react';
import { Box, HStack, Image, Text, Pressable } from 'native-base';

const RoundBoxCardNumber = ({ value, title = "Bike", onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <Box bg="white" p={5} borderRadius="10px" width={115} height={160} borderWidth={0} borderColor="gray.200" shadow={0.8} mr={2}>

                <Box
                    bg="#fff"
                    // bg="#eeedff"
                    borderRadius="full"
                    width={20}
                    height={20}
                    alignSelf="center"
                    alignItems="center"
                    justifyContent="center"
                >

                <Text numberOfLines={2} fontWeight="bold" fontSize="30" textAlign="center" mt={2}>
                    {value}
                </Text>
                     
                </Box>

                {/* Title */}
                <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={2}>
                    {title}
                </Text>
            </Box>
        </Pressable>
    );
};

export default RoundBoxCardNumber;
