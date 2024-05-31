import React from 'react';
import { View, Image, Button } from 'react-native';
import { Box, Text } from 'native-base';
import Header from '../../../components/header';
import CustomButton from '../../../components/UI/button';

const BookingConfirmation = (props) => {

  const { navigation } = props;

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }], // Replace 'Root' with the name of your root route
    });
  };

  return (
    <Box p={0} flex={1} bg="#fff">
      <Header title="Booking Confirmed"  {...props} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../../assets/images/booking-online.png')} // Replace with the actual path to your image
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />

        <Text p={2} fontWeight="500" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text" textAlign="center" mb={5}>
          Your booking has been successfully done, We will contact you soon, Thank you!
                        </Text>

        <CustomButton btnStyle={{ width: "50%" }} onPress={handleGoHome} >Go Home</CustomButton>
      </View>
    </Box>
  );
};

export default BookingConfirmation;
