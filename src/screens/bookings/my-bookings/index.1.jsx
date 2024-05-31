import React from 'react';
import { Box, Image, Text, VStack, HStack, IconButton } from 'native-base';

const BookingCard = ({ booking }) => {
//   const {
//     bookingId,
//     bikeImage,
//     bikeName,
//     serviceProvider,
//     status,
//     date,
//     time,
//   } = booking;

  // Dummy data
  const dummyBooking = {
    bookingId: '123456',
    bikeImage: 'https://picsum.photos/200/300',
    bikeName: 'Awesome Bike Model',
    serviceProvider: 'Best Bike Rentals',
    status: 'Confirmed',
    date: '2024-01-06',
    time: '14:30',
  };

  return (
    <Box
      width="100%"
      bg="white"
      p={4}
      mb={4}
      borderRadius="md"
      shadow={2}
    >
      <Image
        source={{ uri: dummyBooking.bikeImage }}
        alt="Bike Image"
        size="md"
        borderRadius="md"
        mb={2}
      />
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        Booking ID: {dummyBooking.bookingId}
      </Text>
      <Text mb={2}>Bike Name: {dummyBooking.bikeName}</Text>
      <Text mb={2}>Service Provider: {dummyBooking.serviceProvider}</Text>
      <Text mb={2}>Status: {dummyBooking.status}</Text>
      <Text mb={2}>Date: {dummyBooking.date}</Text>
      <Text mb={2}>Time: {dummyBooking.time}</Text>

     
      <HStack space={2} mt={4} justifyContent="flex-end">
      <Text mb={2}>Delete</Text>
        
      </HStack>
    </Box>
  );
};

export default BookingCard;
