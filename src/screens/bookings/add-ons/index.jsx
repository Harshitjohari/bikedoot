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
  KeyboardAvoidingView
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

const AddOnScreen = (props) => {
  // console.log('props==============+>', props.route?.params?.booking)

  const navigation = useNavigation()

  const isFocused = useIsFocused();
  const { show, close, closeAll } = handleToast();


  const [addonData, setAddonData] = useState([]);
  const [spareData, setSpareData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  // const [isOther, setIsOther] = useState(false);
  const { token } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedServiceCards, setSelectedServiceCards] = useState([]);
  const [customCards, setCustomCards] = useState([]);
  const [addOnCardModalVisible, setAddOnCardModalVisible] = useState(false);
  const [spareCardModalVisible, setSpareCardModalVisible] = useState(false);
  const [customData, setCustomData] = useState({
    name: '',
    quantity: '',
    price: '',
    gstRate: ''
  });
  const [services, setServices] = useState([]);
  const [selectedAdd, setselectedAdd] = useState([]);
  const [selectedButton, setSelectedButton] = useState('Additional Service');
  const [AddOnData, setAddOnData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [BookingData, setBookingData] = useState({});
  const searchTimeout = useRef(null);

  const [addOnCustomData, setAddOnCustomData] = useState({
    name: '',
    price: ''
  });



  let preSelectedServices = props.route?.params?.booking?.services.filter(
    service => service?.service?.service?.serviceType?.name === "Service"
  ).map(service => service.service._id);




  useEffect(() => {
    if (isFocused)
    fetchServiceList();
    setSelectedServiceCards(preSelectedServices);
    fetchBookingsDetails();
  }, [isFocused]);


  const fetchBookingsDetails = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_BOOKING_DETAILS + props.route?.params?.booking?._id,
        token
      );

      // console.log('=========?',response?.data)

      if (response?.status) {

        const data = await response?.data?.additionalServices;
        setBookingData(response?.data);
        setAddonData(data);
        setCustomCards(response?.data?.spareParts)
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };


  const fetchServiceList = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_BOOKING_API + props.route?.params?.booking?._id + '/service', token)
      setLoading(false);
      if (response?.status) {
        let services = response?.data?.services;
        setServices(services)
      } else {
        show(response?.message || "Failed to fetch data");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  let filterServices = services.filter(data => data.cc._id === props.route?.params?.booking?.bike?.cc?._id)

  const data = addonData

  const Card = ({ _id, name, description, price, gstRate, onPress, selected }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{name}</Text>
        {/* <Text style={styles.description}>{description}</Text> */}
        <Text style={styles.price}>{`Price: ₹ ${price}`}</Text>
        {/* <Text style={styles.price}>{`₹${gstRate}`}</Text> */}
      </View>
      <TouchableOpacity
        style={[styles.button, selected ? styles.selectedButton : null]}
        onPress={() => onPress(_id)}>
        <Image
          style={styles.imageButton}
          source={imageConstant.remove} />
      </TouchableOpacity>
    </View>
  );


  const ServiceCard = ({ _id, name, price, onPress, selected }) => (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onPress(_id)}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{`Price: ₹ ${price}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const CustomCard = ({ name, quantity, price, gstRate, onPressRemove }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.quantity}>Quantity: {quantity}</Text>
        <Text style={styles.quantity}>Price: {`₹ ${price}`}</Text>
        <Text style={styles.quantity}>Gst: {`${gstRate}`}%</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onPressRemove}>
        <Image
          style={styles.imageButton}
          source={imageConstant.remove}
        />
      </TouchableOpacity>
    </View>
  );


  const handleRemoveCustomCard = async (index) => {
    const data = {
      _id: index._id
    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.SPARE_LIST + props.route?.params?.booking?._id + '/spareParts/remove',
      token,
      data
    );
    setLoading(false)
    if (response?.status) {
      show(response?.message, "success");
      fetchBookingsDetails();
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };


  const handleCardPress = async (_id) => {
    const data = {
      _id: _id
    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.ADD_ONS_LIST + props.route?.params?.booking?._id + '/addons/remove',
      token,
      data
    );
    setLoading(false)
    if (response?.status) {
      show(response?.message, "success");
      fetchBookingsDetails();
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };


  const handleServiceCardPress = async (_id) => {
    if (selectedServiceCards.includes(_id)) {
      setSelectedServiceCards([]);
    } else {
      setSelectedServiceCards([_id]);
    }
    const data = {
      _id: _id
    };

    setLoading(true)
    let response = await Apis.HttpPutRequest(
      Constant.BASE_URL + Constant.GARAGE_BOOKING_API + props.route?.params?.booking?._id + '/service/update',
      token,
      data
    );
    setLoading(false)
    if (response?.status) {
      show(response?.message, "success");
      fetchServiceList();
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };

  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

  return (

    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Edit/Add Services & Spares" />

      {isLoading ? <LoadingSpinner /> : <>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          <View style={{ marginBottom: 0 }}>
            <Text style={styles.customTitle}>Services</Text>
          </View>

          {filterServices.map((item) => (
            <ServiceCard
              key={item._id}
              _id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              // gstRate={item.gstRate}
              onPress={handleServiceCardPress}
              selected={selectedServiceCards.includes(item._id)}
            />
          ))}

          <View style={{ backgroundColor: '#f0f0f0', padding: 5, borderRadius: 10, marginTop: 10, }}>
            <View style={styles.buttonContainer2}>
              <TouchableOpacity
                style={[
                  styles.button2,
                  selectedButton === 'Additional Service' && styles.selectedButton2
                ]}
                onPress={() => handleButtonPress('Additional Service')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === 'Additional Service' ? styles.selectedButtonText : styles.unselectedButtonText
                  ]}
                >Additional Service</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button2,
                  selectedButton === 'Spare Parts' && styles.selectedButton2
                ]}
                onPress={() => handleButtonPress('Spare Parts')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === 'Spare Parts' ? styles.selectedButtonText : styles.unselectedButtonText
                  ]}
                >Spare Parts</Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            onPress={() => {
              if (selectedButton === 'Spare Parts') {
                navigation.navigate("AddSparePartsPage", { booking: props.route?.params?.booking });
              } else {
                navigation.navigate("AddAdditionalServicePage", { booking: props.route?.params?.booking });
              }
            }}
            btnStyle={{
              alignItems: 'right',
              marginTop: 10,
              backgroundColor: '#5349f8',
              borderColor: '#5349f8',
              borderWidth: 1,
            }}
            textStyle={{
              color: '#fff'
            }}>
            + {selectedButton}
          </CustomButton>

          {
            selectedButton === 'Additional Service' &&
            <>
              <View style={{ marginBottom: 10 }}>
              </View>
              {data.map((item) => (
                <Card
                  key={item._id}
                  _id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  // gstRate={item.gstRate}
                  onPress={handleCardPress}
                // selected={selectedCards.includes(item._id)}
                />
              ))}
            </>
          }


          {
            selectedButton === 'Spare Parts' &&
            <>
              {customCards.length > 0 && (
                <View>
                  <View style={{ marginBottom: 10 }}>
                    {/* <Text style={styles.customTitle}>Spares</Text> */}
                  </View>
                  {customCards.map((customCard, index) => (
                    <CustomCard
                      key={index}
                      name={customCard.name}
                      quantity={customCard.quantity}
                      price={customCard.price}
                      gstRate={customCard.gstRate}
                      onPressRemove={() => handleRemoveCustomCard(customCard)}
                    />
                  ))}
                </View>
              )}
            </>
          }

        </ScrollView>

        <CustomButton onPress={() => navigation.navigate("ImagesUploadScreen", { booking : props.route?.params?.booking })} btnStyle={{ margin: 10 }}>
          Upload Images
        </CustomButton> 

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
    bottom: 0,
    position: 'absolute',
    // margin: 20,
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
    height: 600,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    width: '43%',
    // marginTop: 40
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





export default AddOnScreen;