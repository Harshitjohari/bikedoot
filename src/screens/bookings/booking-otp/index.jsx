import React, { useState, useRef } from 'react';
import { Box, Text, HStack, Pressable, Input } from 'native-base';
import { View, TextInput, Button, Image, Modal, Alert, StyleSheet, TouchableOpacity, Permissions, KeyboardAvoidingView,ScrollView, Platform, Dimensions } from 'react-native';

import CustomButton from '../../../components/UI/button';
import Apis from '../../../utils/api';
import Constant from '../../../common/constant';
import { handleToast } from '../../../utils/toast';
import { useAuth } from '../../../context/loginContext';
import Header from '../../../components/header';

import { useNavigation } from '@react-navigation/native';


const Otpverify = (props) => {

  let booking = props.route?.params?.booking
  // console.log('props===========>',booking._id)
  const navigation = useNavigation()

  const { show } = handleToast();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [Reading, setReading] = useState('');
  const [FuelReading, setFuelReading] = useState('');
  const [RcNumber, setRcNumber] = useState('');


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

  const verifyOtp = async () => {
    const otpNumber = otpDigits.join('');

    if(booking.serviceCategory.name !== 'Bike Service at Garage'){
      if (otpNumber === '') {
        show('Please enter a valid OTP');
        return;
      }
    }
    

    try {
      setIsLoading(true);

      let data = { shareCode : otpNumber, odometerReading : Reading, rcNumber : RcNumber, fuel : FuelReading, serviceCategory : booking.serviceCategory.name }
      const response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.START_BOOKING + booking?._id + '/verifyDetails', token, data);
      // console.log('==========>',response)
      setIsLoading(false);

      if (response?.status) {
        show(response?.message, 'success');
        navigation.navigate("MechanicBookingsDetails", { id: booking?._id })
        
      } else {
        show(response?.message || 'Failed to verify auth code, try again later', 'error');
      }
    } catch (e) {
      setIsLoading(false);
      show('Some error has occurred!', 'error');
    }
  };

  return (
    <Box flex={1} justifyContent="center" p={0} bg="screen_bg">
      <Header title="Verify Details"/>

      <ScrollView showsVerticalScrollIndicator={false}>

      <Box flex={1} justifyContent="center" p={4} bg="bg_white">
        {
          (
            booking.serviceCategory.name != 'Bike Service at Garage' &&
            <>
             <Text fontSize={24} textAlign="center" mb={0} fontWeight="600">
          Share Code
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
            </>
          )
        }

        <View style={{
          width: "90%",
          minHeight: 40,
          maxHeight: 40,
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 40,
          marginBottom: 40,
          borderBottomWidth: 1,
          borderColor: '#E6E8EC',
        }}>
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={{ color: 'black' }}> Registration Number</Text>
          </View>
          <TextInput
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '400',
              paddingVertical: 0,
              borderWidth: 0.5,
              borderRadius: 8,
              backgroundColor: '#f4f5f7',
              borderColor: 'grey',
              padding: 15,
              height: 50,
              marginTop: 5,
              textTransform: 'uppercase'
            }}
            placeholder="Registration Number"
            placeholderTextColor="grey"
            value={RcNumber}
            onChangeText={setRcNumber}
            maxLength={12}
          />
        </View>

        <View style={{
          width: "90%",
          minHeight: 40,
          maxHeight: 40,
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 10,
          marginBottom: 40,
          borderBottomWidth: 1,
          borderColor: '#E6E8EC',
        }}>
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={{ color: 'black' }}> Odometer Readings(km.)</Text>
          </View>
          <TextInput
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '400',
              paddingVertical: 0,
              borderWidth: 0.5,
              borderRadius: 8,
              backgroundColor: '#f4f5f7',
              borderColor: 'grey',
              padding: 15,
              height: 50,
              marginTop: 5,
              keyboardType: "numeric"
            }}
            placeholder="Odometer Readings(km.)"
            placeholderTextColor="grey"
            value={Reading}
            onChangeText={setReading}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        <View style={{
          width: "90%",
          minHeight: 40,
          maxHeight: 40,
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 10,
          marginBottom: 40,
          borderBottomWidth: 1,
          borderColor: '#E6E8EC'
        }}>
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={{ color: 'black' }}> Fuel Readings(%)</Text>
          </View>
          <TextInput
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '400',
              paddingVertical: 0,
              borderWidth: 0.5,
              borderRadius: 8,
              backgroundColor: '#f4f5f7',
              borderColor: 'grey',
              padding: 15,
              height: 50,
              marginTop: 5,
              keyboardType: "numeric"
            }}
            placeholder="Fuel Readings(%)"
            placeholderTextColor="grey"
            value={FuelReading}
            onChangeText={setFuelReading}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>



        <CustomButton onPress={verifyOtp} isLoading={isLoading} isLoadingText="Saving Details..." disabled={isLoading}>
          Save
        </CustomButton>

      </Box>
      </ScrollView>
    </Box>
  );
};

export default Otpverify;


