import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert,
  TextInput,
  Image,
  Picker,
  FlatList,
  Platform,
  Dimensions,
  KeyboardAwareScrollView
} from 'react-native';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import CustomButton from '../../../components/UI/button'
import { imageConstant } from '../../../utils/constant';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import { handleToast } from '../../../utils/toast';
import LoadingSpinner from '../../../components/UI/loading';



let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;

const AddSparePartsPage = (props) => {

  const navigation = useNavigation()

  const isFocused = useIsFocused();
  const { show, close, closeAll } = handleToast();

  const [spareData, setSpareData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  // const [isOther, setIsOther] = useState(false);
  const { token } = useAuth();
  const [GarageData, setGarageData] = useState({});
  const [customData, setCustomData] = useState({
    name: '',
    quantity: '',
    price: '',
    gstRate: ''
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchTimeout = useRef(null);



  useEffect(() => {
    if (isFocused)
      fetchSpareList();
    fetchGarageData();
  }, [isFocused]);

  const fetchSpareList = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.SPARE_LIST + props.route?.params?.booking?._id + '/spareParts',
        token
      );
      if (response?.status) {

        const data = await response?.data;
        setSpareData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const fetchGarageData = async () => {
    try {
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.AUTH.GURAGE_DEATIL_API + props.route?.params?.booking?.garage?._id, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjIzNGNjZTczOTcyM2U0MmNiM2UwMGEiLCJyb2xlIjoiTUVDSEFOSUMiLCJnYXJhZ2UiOiI2NjFhNmMxNzkxODE3YWMxYjAxOTI1YWEiLCJjaXR5IjoiNjU5ZWQ2YWY5OThkN2E4Y2JjOGI0N2Q0IiwiaWF0IjoxNzI2NTkzMjAxLCJleHAiOjE3NTgxMjkyMDF9.pEcJmYxSAoCkfTi6gUoaDQWQfqGnJD1XfCZar9160Lk")
      if (response?.status) {
        // console.log('============>',response.data)
        setGarageData(response?.data)
      } else {
        show(response?.message || "Failed to fetch data");
      }
    } catch (e) {
      // show("Some error has occured!");
    }
  };

  let gstData = [
    {
      "_id": '1',
      "name": '0%'
    },
    {
      "_id": '2',
      "name": '5%'
    },
    {
      "_id": '3',
      "name": '12%'
    },
    {
      "_id": '4',
      "name": '18%'
    },
    {
      "_id": '5',
      "name": '28%'
    }
  ]



  const handleCustomInputChange = (key, value) => {
    setCustomData({ ...customData, [key]: value });
    if (key === 'name') {
      setSearchText(value);
    }
  };
  const handleCustomInputChange1 = (key, value) => {
    setCustomData({ ...customData, [key]: value });
  };

  const handleSubmitCustomData = async () => {
    if (!customData.name || !customData.quantity || !customData.price) {
      Alert.alert('All fields are required');
      return;
    }
    const data = {
      name: customData.name,
      quantity: customData.quantity,
      price: customData.price,
      gstRate: customData.gstRate.replace("%", ""),
      approved: props.route?.params?.booking?.sparePartPermission === true && props.route?.params?.booking?.approved === false ? false : true    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.ADD_ONS_LIST + props.route?.params?.booking?._id + '/spareParts/add',
      token,
      data
    );
    setLoading(false)
    if (response?.status) {
      show(response?.message, "success");
      setCustomData({ name: '', quantity: '', price: '', gstRate: '' });
      setSearchText('')
      navigation.goBack();
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };


  const selectedItemFn1 = (selectedItem, index) => {
    // console.log('Selected item received:', selectedItem.name);
    handleCustomInputChange1('gstRate', selectedItem.name)
  };

  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

  const handleSearch = (text) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      let filtered = spareData.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredData(filtered);
    }, 300);
  };


  useEffect(() => {
    handleSearch(searchText);
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchText]);

  const handleItemSelection = (item) => {

    handleCustomInputChange('name', item.name)
    setFilteredData([]);
    setSearchText('')

  };


  return (

    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Add Spare Part" />

      {isLoading ? <LoadingSpinner /> : <>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>


            <View style={{
              width: "90%",
              minHeight: 40,
              maxHeight: 40,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 40,
              borderBottomWidth: 1,
              borderColor: '#E6E8EC',
              // backgroundColor:'pink',
              // marginBottom: isOther ? 30 : 0
            }}>
              <Text style={styles.textStyle}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter spare part name"
                placeholderTextColor="grey"
                value={customData.name}
                onChangeText={(text) => handleCustomInputChange('name', text)}
              />
            </View>

            {searchText.length > 1 && (
              <View style={styles.filteredListContainer}>
                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.filteredItem}
                      onPress={() => handleItemSelection(item)}>
                      <Text style={styles.searchTextStyle}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

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
              <Text style={styles.textStyle}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="grey"
                placeholder="Enter quantity"
                value={customData.quantity}
                keyboardType="numeric"
                onChangeText={(text) => handleCustomInputChange('quantity', text)}
              />
            </View>

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
              <Text style={styles.textStyle}>Price</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="grey"
                placeholder="Enter price"
                value={customData.price}
                keyboardType="numeric"
                onChangeText={(text) => handleCustomInputChange('price', text)}
              />
            </View>

            {GarageData?.garage?.firmRegistered === true && GarageData?.garage?.firmGstNo !== '' &&
              <View style={{
                // width: "90%",
                minHeight: 40,
                maxHeight: 40,
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 40,
                borderBottomWidth: 1,
                borderColor: '#E6E8EC',
              }}>
                <Text style={styles.textStyle}>Gst Rate</Text>
                <SelectDropdown
                  data={gstData}
                  onSelect={(selectedItem, index) => {
                    selectedItemFn1(selectedItem, index)

                    // console.log('selected item ===========>',selectedItems)
                    // setSelectedItems([selectedItem]);
                    // selectedItems[0].name
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    // Display mechanic name in dropdown
                    return item.name;
                  }}
                  buttonStyle={{
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
                    marginTop: 5,
                    width: '90%'
                  }}
                  buttonTextStyle={{ color: 'black' }}
                  defaultButtonText="Select Gst Rate"
                  dropdownStyle={{ borderColor: '#E6E8EC' }}
                />
              </View>
            }

            <View flexDirection={'row'}
              justifyContent={'space-evenly'}
              p={3}
              marginTop={40}
              width={'100%'}>

              <TouchableOpacity
                onPress={handleSubmitCustomData}
                style={styles.submitButton}>
                <Text style={styles.submitText}>Add Spare Part</Text>
              </TouchableOpacity>

            </View>

          </View>
        </ScrollView>
      </>
      }
    </View>

  );

};

const styles = StyleSheet.create({
  textStyle: {
    color: 'black'
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: '#5349f8',
    borderWidth: 2
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontWeight: '500'
  },
  quantity: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    color: 'grey',
  },
  price1: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    color: 'grey',
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '500',
    // marginTop: 5,
    // marginBottom: 5,
    color: 'black',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  modalView: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black'
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
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#5349f8',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    marginTop: 40
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    // marginTop: 10,
    width: '43%',
    borderColor: '#5349f8',
    borderWidth: 1
  },
  cancelText: {
    color: '#5349f8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButton: {
    width: 25,
    height: 25,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },

  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button2: {
    flex: 1,
    padding: 10,
    // borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    // marginHorizontal: 5,
    borderRadius: 5,
    borderColor: '#e7e7e7'
  },
  selectedButton2: {
    backgroundColor: '#5349f8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 500
  },
  unselectedButtonText: {
    color: '#5349f8',
    fontSize: 16,
    fontWeight: 500
  },

  filteredListContainer: {
    width: '90%',
    maxHeight: 200, // Adjust the height as needed
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderTopWidth: 0
  },
  filteredItem: {
    padding: 10,
    // borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchTextStyle: {
    color: '#5349f8',
    fontSize: 14,
    fontWeight: '600'
  }

});


export default AddSparePartsPage;