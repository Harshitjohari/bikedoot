import React, { useState, useRef } from 'react';
import { Box, Text, HStack, Pressable, Input } from 'native-base';
import CustomButton from '../../../components/UI/button';
import Apis from '../../../utils/api';
import Constant from '../../../common/constant';
import { handleToast } from '../../../utils/toast';
import { useAuth } from '../../../context/loginContext';

const VerifyOTP = ({ navigation, onLogin, route }) => {
  const { setAuthData } = useAuth();
  const { show } = handleToast();

  const { phone } = route.params;
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const hiddenDigits = phone.substring(0, 2) + 'xxxxxx' + phone.substring(8);

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

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = '';
      setOtpDigits(newOtpDigits);
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleSignIn = async () => {
    const otpNumber = otpDigits.join('');

    if (otpNumber === '') {
      show('Please enter a valid OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await Apis.HttpPostRequestForLogin(Constant.BASE_URL + Constant.AUTH.OTP_VERIFY, { mobile: phone, otp: otpNumber });
      setIsLoading(false);
      if (response?.status) {
        show(response?.message, 'success');
        setAuthData(JSON.stringify(response?.data?.token), JSON.stringify(response?.data));
        onLogin(true);
      } else {
        show(response?.message || 'Failed to verify OTP, try again later', 'error');
      }
    } catch (e) {
      setIsLoading(false);
      show('Some error has occurred!', 'error');
    }
  };

  const resendOtp = async () => {
    try {
      const response = await Apis.HttpPostRequestForLogin(Constant.BASE_URL + Constant.AUTH.OTP_REQUEST, { mobile: phone });
      if (response?.status) {
        show(response?.message, 'success');
      } else {
        show(response?.message || 'Failed to send OTP, try again later', 'error');
      }
    } catch (e) {
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
          Enter the OTP sent on
        </Text>
        <Text fontSize="bd_md" textAlign="center" fontWeight="600" color="bd_secondary_c" mb={5}>
          +91 {hiddenDigits}
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
              onKeyPress={(e) => handleKeyPress(e, index)}
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

        <CustomButton onPress={handleSignIn} isLoading={isLoading} isLoadingText="Verifying OTP..." disabled={isLoading}>
          Verify OTP
        </CustomButton>

        <Text textAlign="center" mt={4}>
          Didn't get any OTP?{' '}
          <Text color="blue.500" onPress={resendOtp}>
            Click to resend
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

export default VerifyOTP;