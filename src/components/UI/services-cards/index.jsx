import React from 'react';
import { Box, HStack, Image, Text, Pressable } from 'native-base';

const RoundBoxCard = ({ iconSource, title = "Bike", onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <Box bg="white" p={5} borderRadius="10px" width={115} height={160} borderWidth={0} borderColor="gray.200" shadow={0.8} mr={2}>
                {/* Round Box */}
                <Box
                    bg="#ffffff"
                    borderRadius="full"
                    width={20}
                    height={20}
                    alignSelf="center"
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* Image Icon */}
                    <Image style={{
                        resizeMode: "contain"
                    }} alignItems="center" textAlign="center" source={iconSource} alt="Icon" width={20} height={20} />
                </Box>

                {/* Title */}
                <Text numberOfLines={2} fontWeight="bold" fontSize="bd_xsm" textAlign="center" mt={2}>
                    {title}
                </Text>
            </Box>
        </Pressable>
    );
};

export default RoundBoxCard;
