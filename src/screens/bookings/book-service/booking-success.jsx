import React, { useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { Box } from 'native-base';
import Header from '../../../components/header';
import CustomButton from '../../../components/UI/button';
import { imageConstant } from '../../../utils/constant';
import FastImage from 'react-native-fast-image';



const BookingConfirmation = (props) => {
  const { navigation, route } = props;
  const { bookingID } = route.params;

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleGoHome();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box p={0} flex={1} bg="#fff">
      <Header title="Booking Confirmed" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          source={imageConstant.verified}
          style={{ width: 200, height: 200, marginBottom: 10 }}
          resizeMode="contain"
        />

        <Text style={{ color:'black',fontWeight: '500', fontSize: 16, marginBottom: 10, textAlign: 'center', paddingHorizontal: 20 }}>
          Your booking has been created successfully. Booking ID - {bookingID}. We will contact you soon. Thank you!
        </Text>

        <CustomButton btnStyle={{ width: "50%" }} onPress={handleGoHome}>Go Home</CustomButton>
      </View>
    </Box>
  );
};

export default BookingConfirmation;
