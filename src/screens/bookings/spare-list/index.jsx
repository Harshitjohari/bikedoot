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
import ImagePreviewModal  from '../../../components/UI/image_view'; 
import { handleToast } from '../../../utils/toast';



const SpareList = (props) => {

  const navigation = useNavigation()
  const { show, close, closeAll } = handleToast();


  const isFocused = useIsFocused();

  const [addonData, setAddonData] = useState([]);
  const [spareData, setSpareData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isOther, setIsOther] = useState(false);
  const { token } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [customCards, setCustomCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [customData, setCustomData] = useState({
    name: '',
    quantity: '',
    price: '',
    gstRate:''
  });

  let bookId = props.route?.params



  useEffect(() => {
    if (isFocused)
      fetchSpareListDropdown();
    fetchSpareList();
  }, [isFocused]);

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setPreviewVisible(true);
  };

  // console.log('addonData==============+>',addonData)



  const fetchSpareListDropdown = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_MECHANIC_BOOKINGS_DETAILS + props.route?.params + '/spareParts',
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


  const fetchSpareList = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.SPARE_LIST + props.route?.params + '/spareParts/get',
        token
      );

      // console.log('123============>',response?.data)
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

  const handleDelete = async (id) => {
    try {
      const data = {
        _id: id
      };

      setLoading(true);
      let response = await Apis.HttpPostRequest(
        Constant.BASE_URL + Constant.SPARE_LIST + props.route?.params + '/spareParts/remove',
        token,
        data
      );

      if (response?.status) {
        show(response?.message, "success");

        fetchSpareList();

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleCancel = (_id) => {
    Alert.alert(
      'Delete Spare',
      'Are you sure you want to delete?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => handleDelete(_id) },
      ],
      { cancelable: false }
    );
  };

  let gstData = [
    {
      "_id" : '1',
      "name" : '0%'
    },
    {
      "_id" : '2',
      "name" : '5%'
    },
    {
      "_id" : '3',
      "name" : '12%'
    },
    {
      "_id" : '4',
      "name" : '18%'
    },
    {
      "_id" : '5',
      "name" : '28%'
    }
  ]

  const data = addonData

  let sparesData = spareData

  const otherObject = [{
    "_id": "4637826478326dsad",
    "name": "Other"
  }]

  sparesData = [...sparesData, ...otherObject]


  const Card = ({
    _id,
    name,
    quantity,
    price,
    gstRate,
    beforeImage,
    afterImage,
    onPress,
    selected,
  }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.quantity}>Quantity: {quantity}</Text>
        <Text style={styles.quantity}>Price: {`₹${price}`}</Text>
        <Text style={styles.quantity}>Gst: {`${gstRate}`}%</Text>

        <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row' }}>

          <TouchableOpacity onPress={() => props.navigation.navigate('SpareEdit',{bookId,_id,name,quantity,price,gstRate,beforeImage,afterImage})}>
          {/* <TouchableOpacity onPress={() => console.log('id=============>SpareEdit', { id: _id })}> */}
            <Image source={imageConstant.edit} style={{ width: 20, height: 20, marginRight: 10 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCancel(_id)}>
            <Image source={imageConstant.deletee} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>

        </View>


        <View style={styles.imageContainer}>
          <View style={styles.imageTextContainer}>
            <Text style={styles.imageText}>Before Image</Text>
            <TouchableOpacity onPress={() => handleImageClick( beforeImage)}>
              <Image source={{ uri:  beforeImage}} style={styles.image} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />
          </View>

          <View style={styles.imageTextContainer}>
            <Text style={styles.imageText}>After Image</Text>
            <TouchableOpacity onPress={() => handleImageClick( afterImage)}>
              <Image source={{ uri:  afterImage}} style={styles.image} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />
          </View>
        </View>
      </View>
    </View>
  );

  // const CustomCard = ({ name, quantity, price, onPressRemove }) => (
  //   <View style={styles.card}>
  //     <View style={styles.cardContent}>
  //       <Text style={styles.name}>{name}</Text>
  //       <Text style={styles.quantity}>{quantity}</Text>
  //       <Text style={styles.price}>{`₹${price}`}</Text>
  //     </View>
  //     <TouchableOpacity style={styles.removeButton} onPress={onPressRemove}>
  //       <Image
  //         style={styles.imageButton}
  //         source={imageConstant.remove}
  //       />
  //     </TouchableOpacity>
  //   </View>
  // );



  const handleCustomInputChange = (key, value) => {
    setCustomData({ ...customData, [key]: value });
  };

  const handleCustomInputChange1 = (key, value) => {
    setCustomData({ ...customData, [key]: value });
  };

  const handleSubmitCustomData = async () => {
    if (!customData.name || !customData.quantity || !customData.price) {
      Alert.alert('All fields are required');
      return;
    }

    const saveData = {
      name: customData.name,
      quantity: customData.quantity,
      price: customData.price,
      gstRate: customData.gstRate.replace("%", "")
    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.ADD_SPARE + props.route?.params + '/spareParts/add',
      token,
      saveData
    );
    // console.log('res============++>',response)

    if (response?.status) {
      // show(response ?.message, "success");
      fetchSpareList()
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }


    // Clear input fields
    setCustomData({ name: '', quantity: '', price: '', gstRate: '' });

    // Close the modal
    setModalVisible(false);
  };

  // const handleCardPress = (_id) => {
  //   if (selectedCards.includes(_id)) {
  //     setSelectedCards(selectedCards.filter((id) => id !== _id));
  //   } else {
  //     setSelectedCards([...selectedCards, _id]);
  //   }
  // };

  const selectedItemFn = (selectedItem, index) => {
    // console.log('Selected item received:', selectedItem.name);
    handleCustomInputChange('name', selectedItem.name)
    selectedItem.name == 'Other' ? setIsOther(true) : setIsOther(false)

  };

  const selectedItemFn1 = (selectedItem, index) => {
    // console.log('Selected item received:', selectedItem.name);
    handleCustomInputChange1('gstRate', selectedItem.name)
  };



  return (

    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Spares List" />

      <ScrollView contentContainerStyle={styles.container}>
        {data.map((item) => (
          <Card
            key={item._id}
            _id={item._id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            gstRate={item.gstRate}
            beforeImage={item.beforeImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcGt3t_ZkYA3MLelnrlxTyP6NhYuFcPkYZnOVy1-abzDnDGDLxEMPqoh5oIp_DA7TJZUU&usqp=CAU'}
            afterImage={item.afterImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcGt3t_ZkYA3MLelnrlxTyP6NhYuFcPkYZnOVy1-abzDnDGDLxEMPqoh5oIp_DA7TJZUU&usqp=CAU'}
            // onPress={handleCardPress}
            selected={selectedCards.includes(item._id)}
          />
        ))}


        

      </ScrollView>

      <View style={styles.addButton}>
          <TouchableOpacity  onPress={() =>setModalVisible(!modalVisible)}>
        <Image
          source={imageConstant.add}
          style={styles.circularImage}
        />
      </TouchableOpacity>
        </View>

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
                buttonTextStyle={{ color: 'black', textAlign:'left', fontSize: 16 }}
                defaultButtonText="Select Spare"
                dropdownStyle={{ borderColor: '#E6E8EC'}}
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
              marginTop: 50,
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
              marginTop: 50,
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
                onSelect={(selectedItem, index) => {selectedItemFn1(selectedItem, index)  

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
                buttonStyle={{fontSize: 16,
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
                width:'90%'
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
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 100,
    height: 50,
    // borderRadius: 25,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    fontSize: 14,
    marginTop: 5,
    color: 'grey',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    color: 'black',
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
    fontSize: 20,
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
    borderColor:'#5349f8',
    borderWidth:1
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
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    // marginLeft: 15,
    borderRadius: 10,
  },
  imageTextContainer: {
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 15,
  },
  imageText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    color: 'black'
  },
  circularImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 50, 
  },
});





export default SpareList;