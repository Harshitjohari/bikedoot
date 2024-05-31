import React, { useState } from 'react';
import { Box, Text, Button, VStack, Pressable, ScrollView } from 'native-base';

const ServiceSelectionScreen = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const services = [
        {
            title: 'General Service',
            price: 50,
            description: 'Regular maintenance for your bike.',
        },
        {
            title: 'Inspection Service',
            price: 40,
            description: 'Thorough inspection to identify any issues.',
        },
        {
            title: 'Premium Service',
            price: 80,
            description: 'Comprehensive service for premium bikes.',
        },
        {
            title: 'Bike Reboot',
            price: 30,
            description: 'Reset and optimize your bike system.',
        },
        // Add more services as needed
    ];

    const handleServiceSelection = (service) => {
        if (selectedService === service) {
            // If the same service is selected again, deselect it
            setSelectedService(null);
            setTotalPrice(0);
        } else {
            // Deselect the previous service and select the new one
            setSelectedService(service);
            setTotalPrice(service.price);
        }
    };


    const handleContinue = () => {
        // Handle continue button click with the selected service and total price
        console.log('Continue button clicked with service:', selectedService);
        console.log('Total price:', totalPrice);
    };

    const renderServiceItem = (service, index) => (
        <Box
            key={index}
            p={2}
            bg={selectedService === service ? '#ff0' : 'white'}
            borderRadius={8}
            mb={2}
            borderWidth={1}
            borderColor="gray.300"
            shadow={selectedService === service ? 2 : 0}
        >
            <Text fontSize="lg" fontWeight="bold">
                {service.title}
            </Text>
            <Text fontSize="md" color="gray.500">
                {service.price} USD
      </Text>
            <Text>{service.description}</Text>
            <Button
                mt={2}
                colorScheme={selectedService === service ? 'red' : 'green'}
                onPress={() => handleServiceSelection(service)}
            >
                {selectedService === service ? 'Remove' : 'Add'}
            </Button>
        </Box>
    );

    return (
        <Box p={4} flex={1} bg="white">
            <ScrollView>
                <VStack space={2} mb={4}>
                    {services.map(renderServiceItem)}
                </VStack>
            </ScrollView>

            <Box position="absolute" top={4} right={4}>
                <Text fontSize="lg" fontWeight="bold">
                    Total Price: {totalPrice} USD
        </Text>
            </Box>

            <Button
                onPress={handleContinue}
                colorScheme="blue"
                mt={4}
                isDisabled={!selectedService}
            >
                Continue
      </Button>
        </Box>
    );
};

export default ServiceSelectionScreen;
