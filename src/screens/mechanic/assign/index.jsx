import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet, Platform, Text, Dimensions } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MultiSelect from 'react-native-multiple-select';
import SelectBox from 'react-native-multi-selectbox'
import CustomButton from '../../../components/UI/button'

import SelectDropdown from 'react-native-select-dropdown';
import { handleToast } from '../../../utils/toast';




let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;


const assignMechanic = (props) => {

  const { token } = useAuth();
  const { show } = handleToast();
  const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [mechanic, setMechanic] = useState([]);



  useEffect(() => {
    fetchMechanicData();
  }, []);

  const fetchMechanicData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_MECHANICS,
        token
      );
  
      if (response?.status) {
        let fullData = response?.data;
        const mechanicData = fullData.map((item) => ({
          id: item?._id,
          name: item?.name,
        }));
        setMechanic(mechanicData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  // console.log('hiii========>',selectedItems[0]?.id)
  

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      // If no mechanic is selected, show an error message
      Alert.alert('Error', 'Please select a mechanic');
      return;
    }
    
    const data = {
      booking_id: props.route?.params?.booking?._id,
      mechanic_id:selectedItems[0]?.id
    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.ASSIGN_MECHANIC,
      token,
      data
    );
    // setLoading(false)
    if (response?.status) {
      show(response?.message, 'success');
      props.navigation.navigate('Bookings');
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      <Header title="ASSIGN MECHANIC" />


      <View style={{
        width: "90%",
        minHeight: 40,
        maxHeight: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 40,
        borderBottomWidth: 1,
        borderColor: '#E6E8EC',
      }}>
        <Text>Booking Id</Text>
        <TextInput
          style={styles.input}
          // placeholder="Name"
          placeholderTextColor="black"
          value={props.route?.params?.booking?.bookingId}
          onChangeText={setName}
          editable={false}
        />
      </View>

      <View style={{
        // width: "90%",
        minHeight: 40,
        maxHeight: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 40
       }}>
        <SelectDropdown
        data={mechanic}
        onSelect={(selectedItem, index) => {
          // Handle selected mechanic
          setSelectedItems([selectedItem]);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // Display selected mechanic
          return selectedItem.name;
        }}
        rowTextForSelection={(item, index) => {
          // Display mechanic name in dropdown
          return item.name;
        }}
        buttonStyle={[styles.input1]}
        buttonTextStyle={{ color: 'black',fontSize:16,textAlign:'left' }}
        defaultButtonText="Select Mechanic"
        dropdownStyle={{ borderColor: '#E6E8EC' }}
      />
      </View>


      <View style={{
        marginLeft: 20,
        marginRight: 20

      }}>
        <CustomButton onPress={handleSubmit} btnStyle={{ marginTop: 50 }}>
          Submit
        </CustomButton>
      </View>


    </View>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input1: {
    width: '90%',
    // marginBottom: 10,
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    // color:'black'
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
  input: {
    // width: '100%',
    // marginBottom: 10,
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    // color:'black'
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
  imageContainer: {
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  buttonStyle: {
    width: 343,
    height: 64,
    marginTop: 5,
    alignSelf: 'center',
    position: Platform.OS === 'ios' ? null : 'absolute',
    bottom: Platform.OS === 'ios' ? null : 0,
    resizeMode: "contain",
  }
});


export default assignMechanic;