import React, { useState } from 'react';
import { Box, Text, Input, Button } from 'native-base';
import { SafeAreaView, StyleSheet, TextInput, View, Image } from 'react-native';
import CommonStyle from '../../../assets/style'
import CustomButton from '../../../components/UI/button'
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { handleToast } from '../../../utils/toast';
import { imageConstant } from '../../../utils/constant';


const Login = ({ navigation, onLogin }) => {

    const { show, close, closeAll } = handleToast();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validatePhoneNumber = (text) => {
        if (/^\d*$/.test(text)) {
            setPhoneNumber(text);

            // Display error only when the length is not 10
            if (text.length !== 10) {
                setPhoneNumberError('Please enter a valid 10-digit phone number');
            } else {
                setPhoneNumberError('');
            }
        }
    };

    const handleSignIn = async () => {
        if (phoneNumber === "") {
            setPhoneNumberError('Please enter your Phone no');
            return;
        }

        try {
            setIsLoading(true)
            let response = await Apis.HttpPostRequestForLogin(Constant.BASE_URL + Constant.AUTH.OTP_REQUEST, { mobile: phoneNumber })
            setIsLoading(false)
            if (response?.status) {
                show(response?.message, "success");
                navigation.navigate("VerifyOTP", { phone: phoneNumber })
            } else {
                show(response?.message || "Failed to send OTP, try again later", "error");
            }
        } catch (e) {
            setIsLoading(false)
            show("Some error has occured!", "error");
        }
    };

    return (
        <Box flex={1} justifyContent="center" p={4} bg="screen_bg">
            <Box flex={1} justifyContent="center" p={4} bg="bg_white">
                <View style={styles.imageContainer}>
                    <Image source={imageConstant.bikedoot} style={{ height: 120, width: 120, resizeMode: "contain" }} />
                </View>
                <Text fontSize={25} textAlign="center" mb={5} fontWeight="900">
                    Welcome to BikedooT
                </Text>
                {/* <Text fontSize="bd_md" textAlign="center" fontWeight="600" color="bd_secondary_c" mb={8}>  Phone Number </Text> */}
                {/* <Input
                    borderRadius={50}
                    style={CommonStyle.input}
                    backgroundColor="input_bg"
                    placeholder="Phone Number"
                    keyboardType="numeric"
                    fontSize={20}
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(text) => validatePhoneNumber(text)}
                    isInvalid={!!phoneNumberError}
                /> */}
                <View style={styles.inputContainer}>
                    <Image source={imageConstant.phone} style={styles.icon} />
                    <TextInput
                        borderRadius={50}
                        style={CommonStyle.input}
                        backgroundColor="input_bg"
                        placeholder="Enter Mobile Number"
                        placeholderTextColor={"grey"}
                        keyboardType="numeric"
                        maxLength={10}
                        fontSize={15}
                        value={phoneNumber}
                        color={"black"}
                        onChangeText={(text) => validatePhoneNumber(text)}
                        isInvalid={!!phoneNumberError}
                    />
                </View>
                {phoneNumberError && (
                    <Text color="red.500" pt={0} mb={3} fontSize={12}>
                        {phoneNumberError}
                    </Text>
                )}

                <CustomButton
                    onPress={handleSignIn}
                    isLoading={isLoading}
                    isLoadingText="Sending OTP.."
                    disabled={isLoading}>
                    Get OTP
                </CustomButton>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'pink',
        padding: 8,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: -60,
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f4f5f7",
        borderRadius: 50,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#DEDEDE'
    },
    input: {
        flex: 1,
        height: 50,
        marginLeft: 10,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
});

export default Login;
