import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Picker, Input, Select, Box, Menu, HStack } from "native-base";
import { RadioButton } from "react-native-paper";
import CommonStyle from '../../assets/style'
import CustomButton from '../UI/button'
import { useAuth } from '../../context/loginContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AddAddress = ({ openAddressModal, setOpenAddressModal, newAddress = {}, setNewAddress, addAddress }) => {

    const { cities } = useAuth();

    const [error, setError] = useState({});

    const addAddressNew = () => {
        for (const key in newAddress) {
            if (newAddress[key] === "") {
                const message = `Please fill in the ${key.replace('_', ' ')}`;
                // UtilityClass.showAndroidToast(message);
                return false;
                break;
            }
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
                    mb={3}
                    borderRadius={50}
                    style={CommonStyle.input}
                    value={newAddress.address1}
                    onChangeText={(value) => {
                        setNewAddress({ ...newAddress, address1: value });
                        // setError({...error, address1: ''});
                    }}
                    placeholder="Full Address"
                // style={[styles.input, error.address1 && styles.errorInput]}
                />

                {/*{error.address1 && <Text style={styles.errorMsg}>{error.address1}</Text>}*/}

                {/* <Select borderRadius={50} style={CommonStyle.input} selectedValue={newAddress?.city} accessibilityLabel="Choose city" placeholder="Choose city" mt={1} onValueChange={value =>  setNewAddress({ ...newAddress, city: value })}>
                    <Select.Item label="UX Research" value="ux" />
                    <Select.Item label="Web Development" value="web" />
                    <Select.Item label="Cross Platform Development" value="cross" />
                    <Select.Item label="UI Designing" value="ui" />
                    <Select.Item label="Backend Development" value="backend" />
                </Select> */}

                {/* <Input
                    mb={3}
                    borderRadius={50}
                    style={CommonStyle.input}
                    value={newAddress.city}
                    onChangeText={(value) => {
                        setNewAddress({ ...newAddress, city: value });
                    }}
                    placeholder="City"
                /> */}

                {/*{error.city && <Text style={styles.errorMsg}>{error.city}</Text>}*/}
                <Input
                    mb={3}
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
                // style={[styles.input, error.zipcode && styles.errorInput]}
                />
                {/*{error.zipcode && <Text style={styles.errorMsg}>{error.zipcode}</Text>}*/}

                {/*{error.state && <Text style={styles.errorMsg}>{error.state}</Text>}*/}
                <View style={styles.checkBoxForm}>
                    {/* <View style={styles.checkBoxItem}>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setNewAddress({
                            ...newAddress,
                            is_default: !newAddress.is_default
                        })}>
                            {newAddress.is_default ?
                                <Icon name="check" type={"FontAwesome5"}
                                      style={{fontSize: 16, color: '#F17438', marginRight: 5}}/> :
                                <View
                                    style={[styles.checkbox, newAddress.is_default ? styles.checked : styles.unchecked]}/>
                            }
                            <Text>Default Address</Text>
                        </TouchableOpacity>
                    </View> */}

                    <Box w="90%" alignItems="flex-start" ml={5}>
                        <Menu w="190" trigger={triggerProps => {
                            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <HStack>
                                    <Text>{newAddress ?.city?.name || "Select City"}</Text>
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

                    {/* <View style={styles.radioForm}>
                        <TouchableOpacity
                            style={[styles.radioContainer, newAddress.address_type === 'Home' && styles.selected]}
                            onPress={() => setNewAddress({ ...newAddress, address_type: 'Home' })}>
                            <Text
                                style={[styles.nonSelectedbtnText, newAddress.address_type === 'Home' && styles.selectedbtnText]}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.radioContainer, newAddress.address_type === 'Office' && styles.selected]}
                            onPress={() => setNewAddress({ ...newAddress, address_type: 'Office' })}>
                            <Text
                                style={[styles.nonSelectedbtnText, newAddress.address_type === 'Office' && styles.selectedbtnText]}>Office</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.radioContainer, newAddress.address_type === 'Other' && styles.selected]}
                            onPress={() => setNewAddress({ ...newAddress, address_type: 'Other' })}>
                            <Text
                                style={[styles.nonSelectedbtnText, newAddress.address_type === 'Other' && styles.selectedbtnText]}>Others</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                {/*{error.address_type && <Text style={styles.errorMsg}>{error.address_type}</Text>}*/}
                <CustomButton onPress={() => addAddress()} btnStyle={{ marginTop: 10 }}>
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
