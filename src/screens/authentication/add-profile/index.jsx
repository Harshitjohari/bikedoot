import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Box, Heading, Avatar, Input, Button, Toast, Text, ScrollView, Menu, Pressable, HStack } from 'native-base';
import { handleToast } from '../../../utils/toast';
import CommonStyle from '../../../assets/style';
import CustomButton from '../../../components/UI/button'
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { imageConstant } from '../../../utils/constant';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


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
    const [profile, setProfile] = useState("https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png");
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [modalVisibleProfile, setModalVisibleProfile] = useState(false);



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
                if (response?.status) {
                    show(response?.message, "success");
                    setAuthData(JSON.stringify(token), JSON.stringify(response?.data[0]))
                    onLogin(true);
                } else {
                    show(response?.message || "Failed to update, please try again later", "error");
                }
            } catch (e) {
                setIsLoading(false)
                show("Some error has occured!", "error");
            }

        } else {
            show("Please check your form", "error")
        }
    }

    const updateImage = async (reqData, key) => {
        try {
            // console.log('key====================>',key)
            let formDataReq = new FormData();
            let data = {
                uri: reqData?.assets?.[0]?.uri,
                type: reqData?.assets?.[0]?.type,
                name: reqData?.assets?.[0]?.fileName,
            };

            formDataReq.append(key, data);
            // console.log('formDataReq=================+>',formDataReq)



            setIsLoading(true)
            let response = await fetch(Constant.BASE_URL + Constant.UPDATE_USER_PROFILE, {
                method: "PUT",
                headers: {
                    "token": token,
                    'Content-Type': 'multipart/form-data'
                },
                body: formDataReq
            })
            let result = await response.json()

            setIsLoading(false)

            if (result?.status) {
                setProfile(result?.data[0]?.profile)
                show(result?.message, "success");
                setModalVisibleProfile(false)
            }
            else {
                show(result?.message || "Failed to update, please try again later", "error");
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    const openCamera = (key) => {
        let options = {
            mediaType: 'photo',
            quality: 0.5,
        };
        launchCamera(options, (response) => {
            if (response.didCancel) {
                // toastShow('User cancelled ', colorConstant.darkRed)
                console.log('User cancelled image picker');
            } else if (response.error) {
                // toastShow('Something went wrong', colorConstant.darkRed)
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // console.log(
                //   'response from camera------------------->',
                //   JSON.stringify(response)
                // );
                updateImage(response, key);
            }
        });
    };

    const openGallery = (key) => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
        };
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                // toastShow('User cancelled ', colorConstant.darkRed)
                console.log('User cancelled image picker');
            } else if (response.error) {
                // toastShow('Something went wrong', colorConstant.darkRed)
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // console.log(
                //   'response from gallery------------------->',
                //   response
                // );
                updateImage(response, key);
            }
        });
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const [cities, setCities] = useState([]);

    const fetchCities = async () => {
        try {
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_ALL_CITIES, token)
            if (response?.status) {
                setCities(response?.data);
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
                    {/* <Box alignItems="center" justifyContent="center" mb={4}>
                        <Image
                            style={{
                                borderRadius: 50,
                                height:80,
                                width:80,
                                marginTop:5,
                                resizeMode:'contain'
                              }}
                              alt="" 
                            source={imageConstant.dummy}
                        />
                    </Box> */}

                    <View style={styles.profileContainer}>
                        <View style={styles.imageContainer}>
                            {/* <Image
                                style={styles.imageStyle}
                                source={imageConstant.dummy}
                            /> */}
                            <Image
                                style={styles.imageStyle}
                                source={{
                                uri: profile,
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={() => setModalVisibleProfile(!modalVisibleProfile)}
                        >
                            <Image
                                style={styles.imageStyle}
                                source={imageConstant.edit}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text fontSize="bd_xlg" textAlign="center" fontWeight="900" mb={5}>
                        Create your profile
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
                                    <Text>{city?.name || "Select City"}</Text>
                                    <Icon type="FontAwesome5" name="angle-down"
                                        style={{ color: '#5349f8', fontSize: 20, paddingLeft: 5 }} />
                                </HStack>
                            </Pressable>
                        }}>
                            {cities.map((data, index) => {
                                return (<Menu.Item onPress={() => setCity(data)}>{data?.name}</Menu.Item>)
                            })
                            }
                        </Menu>
                    </Box>
                    <CustomButton
                        onPress={updateProfile}
                        isLoading={isLoading}
                        isLoadingText="Creating Please wait.."
                        disabled={isLoading}>
                        Create
                    </CustomButton>
                </Box>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleProfile}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={() => {
                    setModalVisibleProfile(!modalVisibleProfile);
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisibleProfile(!modalVisibleProfile)}
                    style={styles.centeredView}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalView}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                padding: 40,
                                justifyContent: 'space-evenly',
                            }}>
                            <TouchableOpacity onPress={() => openCamera('profile')}>
                                <Image
                                    style={{
                                        width: 60,
                                        height: 60,
                                        resizeMode: 'contain',
                                    }}
                                    source={imageConstant.camera}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openGallery('profile')}>
                                <Image
                                    style={{
                                        width: 60,
                                        height: 60,
                                        resizeMode: 'contain',
                                    }}
                                    source={imageConstant.galary}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    textStyle: {
        color: 'black',
        marginBottom: 10
    },
    input: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        paddingVertical: 0,
        borderWidth: 0.5,
        borderRadius: 8,
        backgroundColor: '#f4f5f7',
        borderColor: '#e7e7e7',
        padding: 15,
        height: 50,
        marginTop: 5
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginVertical: 10
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    backArrow: {
        width: 30,
        height: 30,
    },
    itemContainer: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#4CAF50', // Customize item border color
    },
    selectedItem: {
        backgroundColor: '#4CAF50',
    },
    itemText: {
        color: '#4CAF50', // Customize item text color
    },
    container: {
        flex: 0,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
        paddingBottom: 50
    },
    rowContainer: {
        justifyContent: 'center',
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    imageContainer: {
        borderRadius: 60,
        height: 100,
        width: 100,
        overflow: 'hidden',
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        width: 35,
        height: 35,
        bottom: -2,
        right: 140,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 21
    },
    imageStyle: {
        height: '100%',
        width: '100%',
        borderWidth: 0.5,
        resizeMode: 'contain'
    },
    profileText: {
        marginBottom: 8,
        fontWeight: '400',
        color: 'black',
        fontSize: 15
    },
    modalView: {
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'white',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        height: 200,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
});

export default ProfileScreen;