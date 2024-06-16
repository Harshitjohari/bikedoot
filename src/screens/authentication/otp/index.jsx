import React, { useState, useRef } from 'react';
import { Box, Text, Input, Button, HStack, Pressable } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyle from '../../../assets/style'
import CustomButton from '../../../components/UI/button'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { handleToast } from '../../../utils/toast';
import Storage from '../../../utils/async-storage';
import { useAuth } from '../../../context/loginContext';

const VerifyOTP = ({ navigation, onLogin, route }) => {

    const { setAuthData } = useAuth();

    const { show, close, closeAll } = handleToast();

    const { phone } = route.params;
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const [otpNumber, setOtpNumber] = useState('');
    const [otpNumberError, setOtpNumberError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

    const handleFocus = (index) => {
        inputRefs.current[index].current.focus();
    };


    let hiddenDigits = phone.substring(0, 2) + "xxxxxx" + phone.substring(8);

    const handleInputChange = (text, index) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = text;

        setOtpDigits(newOtpDigits);

        if (text !== '' && index < 3) {
            handleFocus(index + 1);
        }
    };

    const validateOtpNumber = (text) => {
        if (/^\d*$/.test(text)) {
            setOtpNumber(text);

            // Display error only when the length is not 10
            if (text.length !== 4) {
                setOtpNumberError('Please enter a valid 4-digit OTP');
            } else {
                setOtpNumberError('');
            }
        }
    };

    const handleSignIn = async () => {
        const otpNumber = otpDigits.join('');


        if (otpNumber === "") {
            setOtpNumberError('Please enter valid OTP');
            return;
        }

        try {
            setIsLoading(true)
            let response = await Apis.HttpPostRequestForLogin(Constant.BASE_URL + Constant.AUTH.OTP_VERIFY, { mobile: phone, otp: otpNumber })
            setIsLoading(false)
            if (response?.status) {
                show(response?.message, "success");
                if (response?.data?.profileCreated) {
                    setAuthData(JSON.stringify(response?.data?.token), JSON.stringify(response?.data))
                    onLogin(true);
                } else {
                    navigation.navigate("AddProfile", { token: response?.data?.token })
                }
            } else {
                show(response?.message || "Failed to send OTP, try again later", "error");
            }
        } catch (e) {
            setIsLoading(false)
            show("Some error has occured!", "error");
        }

    };

    const resendOtp = async () => {
        try {
            let response = await Apis.HttpPostRequestForLogin(Constant.BASE_URL + Constant.AUTH.OTP_REQUEST, { mobile: phone })
            if (response?.status) {
                show(response?.message, "success");
            } else {
                show(response?.message || "Failed to send OTP, try again later", "error");
            }
        } catch (e) {
            show("Some error has occured!", "error");
        }
    };

    return (
        <Box flex={1} justifyContent="center" p={4} bg="screen_bg">
            <Pressable onPress={() => navigation.navigate("Login")}>
                <HStack space={1} alignItems="center">
                    <FontAwesome name="angle-left" color="#000" size={26} />
                    <Text>Back</Text>
                </HStack>
            </Pressable>

            <Box flex={1} justifyContent="center" p={0} bg="bg_white">
                <Text fontSize="bd_xlg" textAlign="center" mb={0} fontWeight="900">
                    Enter the OTP send on
                </Text>
                <Text fontSize="bd_md" textAlign="center" fontWeight="600" color="bd_secondary_c" mb={5}>+91 {hiddenDigits}</Text>

                {/* <Input
                    borderRadius={50}
                    style={CommonStyle.input}
                    backgroundColor="input_bg"
                    placeholder="Enter 4 digit OTP"
                    keyboardType="numeric"
                    maxLength={4}
                    value={otpNumber}
                    onChangeText={(text) => validateOtpNumber(text)}
                    isInvalid={!!otpNumberError}
                />
                {otpNumberError && (
                    <Text color="red.500" pt={0} mb={3} fontSize={12}>
                        {otpNumberError}
                    </Text>
                )} */}
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

                <CustomButton
                    onPress={handleSignIn}
                    isLoading={isLoading}
                    isLoadingText="Logging in.."
                    disabled={isLoading}
                >
                    Verify OTP
                </CustomButton>
                <Text textAlign="center" mt={4}>
                    Didn't get any OTP?{' '}
                    <Text color="blue.500" onPress={() => resendOtp()}>
                        click to resend
                    </Text>
                </Text>
            </Box>
        </Box>
    );
};

export default VerifyOTP;
