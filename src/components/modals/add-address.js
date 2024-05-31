import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Picker, Input, Select, Box, Menu, HStack,Text } from "native-base";
import { RadioButton } from "react-native-paper";
import CommonStyle from '../../assets/style'
import CustomButton from '../UI/button'
import { useAuth } from '../../context/loginContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { handleToast } from '../../utils/toast';

const AddAddress = ({ openAddressModal, setOpenAddressModal, newAddress = {}, setNewAddress, addAddress }) => {
    const { show, close, closeAll } = handleToast();

    const { cities } = useAuth();

    const [error, setError] = useState({});
    const [cityError, setCityError] = useState("")
    const [pinError, setPinError] = useState("")
    const [addressError, setAddressError] = useState("")

    const addAddressNew = () => {
        if (newAddress.address1 === "") {
            setAddressError("Please add address");
            return;
        } else {
            setAddressError("");
        }
        if (newAddress.zipcode === "") {
            setPinError("Please add pincode");
            return;
        } else {
            setPinError("")
        }
        if (newAddress.city._id === undefined) {
            setCityError("Please select city");
            return;
        } else {
            setCityError("")
        }
        addAddress();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{newAddress.id ? "Update" : "Add"} address</Text>
            <View style={styles.formContainer}>

                {/*{error.phone && <Text style={styles.errorMsg}>{error.phone}</Text>}*/}
                <Input
                    mt={3}
                    mb={!addressError ? 3 : 0}
                    borderRadius={50}
                    style={CommonStyle.input}
                    value={newAddress.address1}
                    onChangeText={(value) => {
                        setNewAddress({ ...newAddress, address1: value });
                        // setError({...error, address1: ''});
                    }}
                    placeholder="Full Address"
                />

                {addressError && (
                    <Text color="red.500" pt={0} mb={3} fontSize={12}>
                        {addressError}
                    </Text>
                )}

                <Input
                    mb={!pinError ? 3 : 0}
                    borderRadius={50}
                    style={CommonStyle.input}
                    value={newAddress.zipcode}
                    onChangeText={(value) => {
                        setNewAddress({ ...newAddress, zipcode: value });
                        // setError({...error, zipcode: ''});
                    }}
                    maxLength={6}
                    keyboardType="numeric"
                    placeholder="pin code"
                />
                {pinError && (
                    <Text color="red.500" pt={0} mb={3} fontSize={12}>
                        {pinError}
                    </Text>
                )}

                <View style={styles.checkBoxForm}>
                    <Box w="90%" alignItems="flex-start" ml={5}>
                        <Menu w="190" trigger={triggerProps => {
                            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <HStack>
                                    <Text>{newAddress ?.city ?.name || "Select City"}</Text>
                                    <Icon type="FontAwesome5" name="angle-down"
                                        style={{ color: '#5349f8', fontSize: 20, paddingLeft: 5 }} />
                                </HStack>
                            </Pressable>
                        }}>
                            {cities.map((data, index) => {
                                return (<Menu.Item onPress={() => setNewAddress({ ...newAddress, city: data })}>{data.name}</Menu.Item>)
                            })
                            }
                        </Menu>
                    </Box>
                   
                </View>
                {cityError && (
                        <Text color="red.500" pt={0} mb={3} fontSize={12}>
                            {cityError}
                        </Text>
                    )}
                <CustomButton onPress={() => addAddressNew()} btnStyle={{ marginTop: 10 }}>
                    {newAddress._id ? 'Update address' : 'Add Address'}
                </CustomButton>
            </View>
        </View>

    );
};

export default AddAddress;
const styles = StyleSheet.create({
    radioContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#5349f8',
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 2,
    },
    nonSelectedbtnText: {
        fontSize: 12
    },
    selectedbtnText: {
        color: '#FFF',
        fontSize: 12
    },
    selected: {
        backgroundColor: '#5349f8',
        color: '#FFF'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        marginRight: 8,
    },
    checked: {
        borderColor: 'green',
        backgroundColor: 'green', // You can change this to the desired color when the checkbox is checked
    },
    unchecked: {
        borderColor: 'gray',
    },
    container: {
        margin: 15,
        marginTop: 30
    },
    checkBoxItem: {
        flexDirection: 'row',
        flex: 1,
        marginLeft: 15

    },
    formContainer: {
        // flex: 1,
        flexDirection: 'column',
    },
    errorMsg: {
        color: 'rgb(236, 75, 0)',
        fontSize: 12,
    },
    errorInput: {
        borderWidth: 1,
        borderColor: 'rgb(236, 75, 0)',
    },
    selectContainer: {
        width: '100%',
        padding: 0,
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: '#F1F1F1',
        fontWeight: '600',
        marginTop: 15,
        height: 40,
        justifyContent: 'center'
    },
    input: {
        height: 40,
        width: '100%',
        padding: 5,
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: '#F1F1F1',
        fontWeight: '600',
        marginTop: 15,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkBoxForm: {
        marginTop: 15,
        marginLeft: -10,
        flexDirection: 'row',
        // alignItems: 'center',
    },
    radioForm: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10
    },
    button: {
        // alignSelf: 'flex-start',
        // padding: 15,
        // borderRadius: 5,
        // backgroundColor: '#F17438',
        // color: 'white',
        // fontWeight: '600',
        // fontSize: 18,
        // marginTop: 15,
        // width: '100%',
        // textAlign: 'center'
    },
    addressType: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#CCC'
    }
});
