import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { Box, Heading, Avatar, Input, Button, Toast, Text, ScrollView, Menu, Pressable, HStack } from 'native-base';
import { handleToast } from '../../../utils/toast';
import CommonStyle from '../../../assets/style';
import CustomButton from '../../../components/UI/button'
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ProfileScreen = ({ navigation, onLogin, route }) => {

    const { token } = route.params;
    const { setAuthData } = useAuth();

    const { show, close, closeAll } = handleToast();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');


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

    const updateProfile = async () => {

        // Validate name
        if (!name.trim()) {
            setNameError('Name should not be blank');
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
            setNameError('Invalid name format');
        } else {
            setNameError('');
        }
        // Validate email
        if (!email.trim()) {
            setEmailError('Email should not be blank');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
        if (city === "") {
            show("Please select city", "error");
            return;
        }
        // validatePhoneNumber(phoneNumber);
        if (!nameError && !emailError) {
            try {
                setIsLoading(true)
                let response = await Apis.HttpPutRequest(Constant.BASE_URL + Constant.UPDATE_USER_PROFILE, token, { email: email, name: name, city: city._id })
                setIsLoading(false)
                if (response ?.status) {
                    show(response ?.message, "success");
                    setAuthData(JSON.stringify(token), JSON.stringify(response ?.data[0]))
                    onLogin(true);
                } else {
                    show(response ?.message || "Failed to update, please try again later", "error");
                }
            } catch (e) {
                setIsLoading(false)
                show("Some error has occured!", "error");
            }

        } else {
            show("Please check your form", "error")
        }
    }

    useEffect(() => {
        fetchCities();
    }, []);

    const [cities, setCities] = useState([]);

    const fetchCities = async () => {
        try {
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_ALL_CITIES, token)
            if (response ?.status) {
                setCities(response ?.data);
            } else {
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            // show("Some error has occured!");
        }
    };

    return (
        <Box flex={1} justifyContent="center" p={0} bg="screen_bg">

            <Heading p={4} color="black" fontSize="lg" flex={1} textAlign="center">
                Update Profile
        </Heading>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Box flex={1} justifyContent="center" p={4} bg="bg_white">
                    <Box alignItems="center" justifyContent="center" mb={4}>
                        <Avatar
                            size="xl"
                            source={{
                                uri: 'https://placehold.jp/150x150.png',
                            }}
                        />
                    </Box>

                    <Text fontSize="bd_xlg" textAlign="center" mb={0} fontWeight="900" mb={5}>
                        Update your profile
                    </Text>
                    {/* <Text fontSize="bd_md" textAlign="center" fontWeight="600" color="bd_secondary_c" mb={8}>Profile</Text> */}
                    <Input
                        borderRadius={50}
                        style={CommonStyle.input}
                        backgroundColor="input_bg"
                        placeholder="Name"
                        keyboardType="default"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        isInvalid={!!nameError}
                    />
                    {nameError && (
                        <Text color="red.500" pt={0} mb={3} fontSize={12}>
                            {nameError}
                        </Text>
                    )}

                    <Input
                        borderRadius={50}
                        style={CommonStyle.input}
                        backgroundColor="input_bg"
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        isInvalid={!!emailError}
                    />

                    {emailError && (
                        <Text color="red.500" pt={0} mb={3} fontSize={12}>
                            {emailError}
                        </Text>
                    )}

                    <Box w="90%" alignItems="flex-start" ml={5} mb={5}>
                        <Menu w="190" trigger={triggerProps => {
                            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <HStack>
                                    <Text>{city ?.name || "Select City"}</Text>
                                    <Icon type="FontAwesome5" name="angle-down"
                                        style={{ color: '#5349f8', fontSize: 20, paddingLeft: 5 }} />
                                </HStack>
                            </Pressable>
                        }}>
                            {cities.map((data, index) => {
                                return (<Menu.Item onPress={() => setCity(data)}>{data ?.name}</Menu.Item>)
                            })
                            }
                        </Menu>
                    </Box>
                    <CustomButton
                        onPress={updateProfile}
                        isLoading={isLoading}
                        isLoadingText="Updating Please wait.."
                        disabled={isLoading}>
                        Update
         </CustomButton>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default ProfileScreen;