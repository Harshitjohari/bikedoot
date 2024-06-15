import React, { useState, useRef } from 'react';
import { Box, Text, HStack, Pressable, Input } from 'native-base';
import CustomButton from '../../../components/UI/button';
import Apis from '../../../utils/api';
import Constant from '../../../common/constant';
import { handleToast } from '../../../utils/toast';
import { useAuth } from '../../../context/loginContext';

import { useNavigation } from '@react-navigation/native';


const Otpverify = (props) => {

  let booking = props.route?.params?.booking
  // console.log('props===========>',booking?._id)
  const navigation = useNavigation()

  const { show } = handleToast();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();


  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

  const handleFocus = (index) => {
    inputRefs.current[index].current.focus();
  };

  const handleInputChange = (text, index) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = text;

    setOtpDigits(newOtpDigits);

    if (text !== '' && index < 3) {
      handleFocus(index + 1);
    }
  };

  const verifyOtp = async () => {
    const otpNumber = otpDigits.join('');

    if (otpNumber === '') {
      show('Please enter a valid OTP');
      return;
    }

    try {
      setIsLoading(true);

      const response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.START_BOOKING + booking?._id + '/startService',token, { authCode: otpNumber });
      // console.log('==========>',response)
      setIsLoading(false);

      if (response?.status) {
        show(response?.message, 'success');
        navigation.navigate("MechanicBookingsDetails", { id:booking?._id })
      } else {
        show(response?.message || 'Failed to verify auth code, try again later', 'error');
      }
    } catch (e) {
      setIsLoading(false);
      show('Some error has occurred!', 'error');
    }
  };

  return (
    <Box flex={1} justifyContent="center" p={4} bg="screen_bg">
      <Pressable onPress={() => navigation.navigate('Login')}>
        <HStack space={1} alignItems="center">
          {/* Back button */}
        </HStack>
      </Pressable>

      <Box flex={1} justifyContent="center" p={4} bg="bg_white">
        <Text fontSize="bd_xlg" textAlign="center" mb={0} fontWeight="900">
          Enter Auth Code
        </Text>

        <HStack space={4} alignItems="center" justifyContent="center" padding={4}>
          {otpDigits.map((digit, index) => (
            <Input
              key={index}
              width={12}
              textAlign="center"
              keyboardType="numeric"
              maxLength={1}
              ref={inputRefs.current[index]}
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              variant="filled"
              borderColor="#534AF9"
              _focus={{
                borderColor: '#534AF9',
              }}
              borderWidth={1}
              borderRadius={10}
              fontSize={24}
            />
          ))}
        </HStack>

        <CustomButton onPress={verifyOtp} isLoading={isLoading} isLoadingText="Verifying auth code" disabled={isLoading}>
          Verify Auth Code
        </CustomButton>

      </Box>
    </Box>
  );
};

export default Otpverify;


