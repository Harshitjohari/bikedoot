import React, { useState, useRef } from 'react';
import { Box, Text, HStack, Pressable, Input } from 'native-base';
import CustomButton from '../../../components/UI/button';
import Apis from '../../../utils/api';
import Constant from '../../../common/constant';
import { handleToast } from '../../../utils/toast';
import { useAuth } from '../../../context/loginContext';
import Header from '../../../components/header';

import { useNavigation } from '@react-navigation/native';
import { color } from 'native-base/lib/typescript/theme/styled-system';


const Otpverify = (props) => {

  let booking = props.route?.params?.booking
  // console.log('props12===========>',booking?._id)
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
      const response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.VERIFY_MECHANIC ,token, {bookingId:booking?._id, shareCode: otpNumber });
      // console.log('==========>',response)
      setIsLoading(false);

      if (response?.status) {
        show(response?.message, 'success');
        navigation.navigate("BookingsScreenDetail", { id: booking?._id })
        // navigation.navigate("InseptionScreen", { booking })
      } else {
        show(response?.message || 'Failed to verify OTP, try again later', 'error');
      }
    } catch (e) {
      setIsLoading(false);
      show('Some error has occurred!', 'error');
    }
  };

  return (
    <Box flex={1} justifyContent="center" p={4} bg="screen_bg">
  <Box flex={1} justifyContent="center" p={4} bg="bg_white">
    <Text fontSize="bd_xlg" textAlign="center" mb={0} fontWeight="900">
      Enter OTP to verify
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

    <HStack space={3} mt={5} justifyContent="center">
      <CustomButton onPress={verifyOtp} isLoading={isLoading} isLoadingText="Verifying OTP" disabled={isLoading} btnStyle={{ width : '40%'}}>
        Verify OTP
      </CustomButton>

      <CustomButton onPress={() => navigation.goBack()} isLoading={isLoading} disabled={isLoading} btnStyle={{ 
        width : '40%',
        backgroundColor: 'white',
        paddingVertical: 15,
        borderRadius: 50,
        alignItems: 'center',
        borderColor:'#5349f8',
        borderWidth:1
        }}
        textStyle={{
          color: '#5349f8',
          fontSize: 16,
          fontWeight: 'bold'
        }}>
        Cancel
      </CustomButton>
    </HStack>

  </Box>
</Box>

  );
};

export default Otpverify;


