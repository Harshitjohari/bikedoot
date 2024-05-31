// Updated BookingCard.js
import React from 'react';
import { Box, Image, Text, HStack, IconButton, Divider } from 'native-base';

const BookingCard = ({ booking }) => {
    const bookingId = "1234";
    const bikeImage = "https://picsum.photos/200/300";
    const bikeName = "Awesome Bike Model";
    const status = "Pending";
    const date = "22/10/2024";
    const time = "10:00PM";
    const bookingAmount = "Rs 200";

    return (
        <Box
      width="100%"
      bg="white"
      p={4}
     
      borderRadius="10px"
      shadow={2}
      m={2} // Add margin of 10px
    >
            {/* First Row */}
            <HStack space={4}>
                {/* Left Column */}
                <Box flex={1}>
                    <Image
                        source={{ uri: bikeImage }}
                        alt="Bike Image"
                        size="md"
                        borderRadius="md"
                    />
                </Box>

                {/* Middle Column */}
                <Box flex={2}>
                    <Text fontWeight="bold" fontSize="lg" mb={2}>
                        {bikeName}
                    </Text>
                    <Text>Booking ID: {bookingId}</Text>
                </Box>

                {/* Right Column */}
                <Box flex={1} alignItems="flex-end">
                    <Text>Delete</Text>
                </Box>
            </HStack>

            {/* Full Border Line */}
            <Divider my={4} width="100%"/>

            {/* Second Row */}
            <HStack space={4}>
                {/* Left Column */}
                <Box>
                    {/* Status with icon */}
                    <HStack space={2} alignItems="center">
                        {/* Replace 'statusIcon' with your actual icon component */}
                        <Text>Status Icon</Text>
                        <Text>{status}</Text>
                    </HStack>

                    {/* Date and timing */}
                    <HStack space={2} alignItems="center">
                        {/* Replace 'dateIcon' with your actual icon component */}
                        <Text>Date Icon</Text>
                        <Text>{date}, {time}</Text>
                    </HStack>

                    {/* Booking Amount */}
                    <HStack space={2} alignItems="center">
                        {/* Replace 'amountIcon' with your actual icon component */}
                        <Text>Amount Icon</Text>
                        <Text>{bookingAmount}</Text>
                    </HStack>
                </Box>

                {/* Right Column */}
                <Box flex={1} alignItems="flex-end">
                    {/* Any additional content on the right */}
                </Box>
            </HStack>
        </Box>
    );
};

export default BookingCard;
