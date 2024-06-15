import React, { useState, useEffect } from 'react';
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
  Picker
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




const AddOnScreen = (props) => {
  // console.log('props==============+>', props.route?.params?.booking)

  const navigation = useNavigation()

  const isFocused = useIsFocused();
  const { show, close, closeAll } = handleToast();


  const [addonData, setAddonData] = useState([]);
  const [spareData, setSpareData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isOther, setIsOther] = useState(false);
  const { token } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedServiceCards, setSelectedServiceCards] = useState([]);
  const [customCards, setCustomCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [customData, setCustomData] = useState({
    name: '',
    quantity: '',
    price: '',
    gstRate: ''
  });
  const [services, setServices] = useState([]);
  const [selectedAdd, setselectedAdd] = useState([]);


  let preSelectedServices = props.route?.params?.booking?.services.filter(
    service => service?.service?.service?.serviceType?.name === "Service"
  ).map(service => service.service._id);

  // let preSelectedAddService = props.route?.params?.booking?.services.filter(
  //   service => service?.service?.service?.serviceType?.name === "Add-On"
  // );
  // let serviceIds = preSelectedAddService.map(data => data.service._id);
  // let filteredServices = addonData.filter(service => serviceIds.includes(service._id)).map(service => service._id);



  useEffect(() => {
    if (isFocused)
      fetchAddonList();
    fetchSpareList();
    fetchGarageData();
    setSelectedServiceCards(preSelectedServices);
  }, [isFocused]);

  useEffect(() => {
    if (addonData.length > 0) {

    let preSelectedAddService = props.route?.params?.booking?.services.filter(
      service => service?.service?.service?.serviceType?.name === "Add-On"
    );
    let serviceIds = preSelectedAddService.map(data => data.service._id);
    let filteredServices = addonData.filter(service => serviceIds.includes(service._id)).map(service => service._id);

    // console.log('==========>',preSelectedAddService)

      setSelectedCards(filteredServices);
    }
  }, [addonData]);


  const fetchAddonList = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.ADD_ONS_LIST + props.route?.params?.booking?._id + '/addons',
        token
      );
      if (response?.status) {

        const data = await response?.data;
        setAddonData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedServiceCards.length === 0) {
      Alert.alert('Please select atleast one service...')
      return
    }
    const data = {
      additionalServices: selectedCards,
      spareParts: customCards,
      services: selectedServiceCards
    };
    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.PRE_INCEPTION + props.route?.params?.booking?._id + '/preInception',
      token,
      data
    );
    setLoading(false)
    if (response?.status) {

      show(response?.message, "success");
      navigation.navigate("MechanicBookingsDetails", { id: props.route?.params?.booking?._id })
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };

  const fetchSpareList = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_MECHANIC_BOOKINGS_DETAILS + props.route?.params?.booking?._id + '/spareParts',
        token
      );

      // console.log('sp============>',response?.data)
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
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.AUTH.GURAGE_DEATIL_API + props.route?.params?.booking?.garage?._id, token)
      setLoading(false);
      if (response?.status) {
        // console.log('============>',response.data)
        let services = response?.data?.services;

        // if (response.data.garage.serviceCategory.length === 0) {
        //   setIsNotServicable(true)
        // }
        for (let index = 0; index < services.length; index++) {
          if (services[index]?.type === "Service") {
            setServices(services[index]?.data)
          }
        }
      } else {
        show(response?.message || "Failed to fetch data");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  let filterServices = services.filter(data => data.cc._id === props.route?.params?.booking?.bike?.cc?._id)

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

  const data = addonData

  let sparesData = spareData

  const otherObject = [{
    "_id": "4637826478326dsad",
    "name": "Other"
  }]

  sparesData = [...sparesData, ...otherObject]



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
          source={selected ? imageConstant.remove : imageConstant.plus} />
      </TouchableOpacity>
    </View>
  );

  const ServiceCard = ({ _id, name, description, price, gstRate, onPress, selected }) => (
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
          source={selected ? imageConstant.remove : imageConstant.plus}
        />
      </TouchableOpacity>
    </View>
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



  const handleCustomInputChange = (key, value) => {
    setCustomData({ ...customData, [key]: value });
  };
  const handleCustomInputChange1 = (key, value) => {
    setCustomData({ ...customData, [key]: value });
  };

  const handleSubmitCustomData = () => {
    if (!customData.name || !customData.quantity || !customData.price || !customData.gstRate) {
      Alert.alert('All fields are required');
      return;
    }

    // Create a new custom card object
    const newCustomCard = {
      name: customData.name,
      quantity: customData.quantity,
      price: customData.price,
      gstRate: customData.gstRate.replace("%", "")
    };



    // Add the new custom card to the existing custom cards array
    setCustomCards([...customCards, newCustomCard]);

    // Clear input fields
    setCustomData({ name: '', quantity: '', price: '', gstRate: '' });

    // Close the modal
    setModalVisible(false);
  };

  const handleRemoveCustomCard = (index) => {
    const updatedCustomCards = [...customCards];

    updatedCustomCards.splice(index, 1);

    setCustomCards(updatedCustomCards);
  };


  const handleCardPress = (_id) => {
    // console.log('Selected item received:', _id);

    if (selectedCards.includes(_id)) {
      setSelectedCards(selectedCards.filter((id) => id !== _id));
    } else {
      setSelectedCards([...selectedCards, _id]);
    }
  };


  const handleServiceCardPress = (_id) => {
    if (selectedServiceCards.includes(_id)) {
      setSelectedServiceCards([]);
    } else {
      setSelectedServiceCards([_id]);
    }
  };

  const selectedItemFn = (selectedItem, index) => {
    console.log('Selected item received:', selectedItem.name);
    handleCustomInputChange('name', selectedItem.name)
    selectedItem.name == 'Other' ? setIsOther(true) : setIsOther(false)

  };

  const selectedItemFn1 = (selectedItem, index) => {
    // console.log('Selected item received:', selectedItem.name);
    handleCustomInputChange1('gstRate', selectedItem.name)
  };



  return (

    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Edit/Add Services & Spares" />

      {isLoading ? <LoadingSpinner /> : <>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 10 }}>
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

        <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 10 }}>
          <Text style={styles.customTitle}>Additional Service</Text>
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
            selected={selectedCards.includes(item._id)}
          />
        ))}

        {customCards.length > 0 && (
          <View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 10 }}>
              <Text style={styles.customTitle}>Spares</Text>
            </View>
            {customCards.map((customCard, index) => (
              <CustomCard
                key={index}
                name={customCard.name}
                quantity={customCard.quantity}
                price={customCard.price}
                gstRate={customCard.gstRate}
                onPressRemove={() => handleRemoveCustomCard(index)}
              />
            ))}
          </View>
        )}

        {/* <View style={styles.buttonContainer}>
          <Button
            title="Add custom"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View> */}

        {/* <CustomButton
          onPress={() => setModalVisible(!modalVisible)}
          btnStyle={{
            alignItems: 'right',
            marginTop: 10,
            // marginBottom: 20,
            backgroundColor: 'white',
            borderColor: '#5349f8',
            borderWidth: 1,
          }}
          textStyle={{
            color: '#5349f8'
          }}>
          Add Custom Additional Service
        </CustomButton> */}
      </ScrollView>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
        <CustomButton
          onPress={() => setModalVisible(!modalVisible)}
          btnStyle={{
            alignItems: 'center',
            backgroundColor: 'white',
            borderColor: '#5349f8',
            borderWidth: 1,
            padding: 10,
            width: '45%'
          }}
          textStyle={{
            color: '#5349f8',
          }}
        >
          Add Spares
        </CustomButton>

        <CustomButton
          onPress={handleSubmit}
          btnStyle={{
            alignItems: 'center',
            borderColor: '#5349f8',
            borderWidth: 1,
            padding: 10,
            width: '45%'
          }}
          textStyle={{
            color: 'white',
          }}
        >
          Submit
        </CustomButton>
      </View>
      </>
}

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Spare</Text>


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
              <Text style={styles.textStyle}>Name</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="black"
                value={customData.name}
                onChangeText={(text) => handleCustomInputChange('name', text)}
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
              <Text style={styles.textStyle}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="black"
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
                placeholderTextColor="black"
                value={customData.price}
                keyboardType="numeric"
                onChangeText={(text) => handleCustomInputChange('price', text)}
              />
            </View>


            <TouchableOpacity
              onPress={handleSubmitCustomData}
              style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>


          </View>
        </View>
      </Modal> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Spare</Text>


            <View style={{
              // width: "90%",
              minHeight: 40,
              maxHeight: 40,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 40,
              borderBottomWidth: 1,
              borderColor: '#E6E8EC',
              // backgroundColor:'pink',
              marginBottom: isOther ? 30 : 0
            }}>
              <Text style={styles.textStyle}>Name</Text>

              <SelectDropdown
                data={sparesData}
                onSelect={(selectedItem, index) => {
                  selectedItemFn(selectedItem, index)

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
                defaultButtonText="Select Spare"
                dropdownStyle={{ borderColor: '#E6E8EC' }}
              />

              {
                isOther ?
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="grey"
                    placeholder='Enter custom spare name'
                    // value={customData.name}
                    onChangeText={(text) => handleCustomInputChange('name', text)}
                  />
                  :
                  null
              }

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
              <Text style={styles.textStyle}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="black"
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
                placeholderTextColor="black"
                value={customData.price}
                keyboardType="numeric"
                onChangeText={(text) => handleCustomInputChange('price', text)}
              />
            </View>

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


            <View flexDirection={'row'}
              justifyContent={'space-evenly'}
              p={3}
              marginTop={40}
              width={'100%'}>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitCustomData}
                style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>

            </View>


          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
    // marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e7e7e7',
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  quantity: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    color: 'grey',
  },
  price: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    color: 'grey',
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 5,
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
});





export default AddOnScreen;