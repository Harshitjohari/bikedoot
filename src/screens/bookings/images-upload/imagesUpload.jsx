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
  Dimensions
} from 'react-native';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import CustomButton from '../../../components/UI/button'
import { imageConstant } from '../../../utils/constant';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { handleToast } from '../../../utils/toast';
import LoadingSpinner from '../../../components/UI/loading';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;

const ImagesUploadScreen = (props) => {
  // console.log('imagesUpload==============+>', props.route?.params?.booking._id)

  const navigation = useNavigation()

  const isFocused = useIsFocused();
  const { show, close, closeAll } = handleToast();
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();
  const [BeforeImages, setBeforeImages] = useState([]);
  const [AfterImages, setAfterImages] = useState([]);
  const [selectedButton, setSelectedButton] = useState('Before Image');
  const [modalVisible, setModalVisible] = useState(false);




  useEffect(() => {
    // if (isFocused)
      fetchImages();
  }, []);


  const fetchImages = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GARAGE_BOOKING_API + props.route?.params?.booking?._id + '/images/get',
        token
      );
      if (response?.status) {
        setBeforeImages(response?.data?.beforeImages);
        setAfterImages(response?.data?.afterImages);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleButtonPress = (button) => {
    setSelectedButton(button);
  };

  const handleCardPress = async (type, index, item) => {

    console.log('========+>', { type, index, item })
    const data = {
      type: type,
      index: index
    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.GARAGE_BOOKING_API + props.route?.params?.booking?._id + '/images/remove',
      token,
      data
    );
    setLoading(false)
    if (response?.status) {
      show(response?.message, "success");
      fetchImages();
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };

  const openCamera = () => {
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
        console.log(
          'response from gallery------------------->',
          JSON.stringify(response)
        );
        updateImage(response);
      }
    });
  };

  const openGallery = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      selectionLimit: 10
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
        console.log(
          'response from gallery------------------->',
          response
        );
        updateImage(response);
      }
    });
  };


  const updateImage = async (reqData) => {
    try {
      setModalVisible(false);
      
      let type = selectedButton === 'Before Image' ? 'beforeImages' : 'afterImages';
      setLoading(true);
  
      for (const asset of reqData.assets) {
        let formDataReq = new FormData();
        let data = {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        };
  
        formDataReq.append('image', data);
        formDataReq.append('type', type);
  
        let response = await fetch(Constant.BASE_URL + Constant.GARAGE_BOOKING_API + props.route?.params?.booking?._id + '/images/add', {
          method: "POST",
          headers: {
            "token": token,
            'Content-Type': 'multipart/form-data'
          },
          body: formDataReq
        });
  
        let result = await response.json();
  
        if (result?.status) {
          fetchImages();
        } else {
          setModalVisible(false);
          show(result?.message || "Failed to update, please try again later", "error");
          break;
        }
      }
  
      setLoading(false);
      setModalVisible(false);
      show("Images uploaded successfully", "success");
  
    } catch (error) {
      setLoading(false);
      console.log(error);
      show("An error occurred, please try again later", "error");
    }
  };
  


  const Card = ({ image, onPress }) => (
    <View style={{ marginTop: 10, borderWidth: 1, borderRadius: 10, borderColor: 'grey' }}>
      <View>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={styles.removeButton}
      >
        <Image
          style={styles.removeButtonText}
          source={imageConstant.remove}
        />
      </TouchableOpacity>
    </View>
  );

  return (

    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Upload Images" />

      {isLoading ? <LoadingSpinner /> : <>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          <View style={{ backgroundColor: '#f0f0f0', padding: 5, borderRadius: 10, marginTop: 5, }}>
            <View style={styles.buttonContainer2}>
              <TouchableOpacity
                style={[
                  styles.button2,
                  selectedButton === 'Before Image' && styles.selectedButton2
                ]}
                onPress={() => handleButtonPress('Before Image')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === 'Before Image' ? styles.selectedButtonText : styles.unselectedButtonText
                  ]}
                >Before Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button2,
                  selectedButton === 'After Image' && styles.selectedButton2
                ]}
                onPress={() => handleButtonPress('After Image')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === 'After Image' ? styles.selectedButtonText : styles.unselectedButtonText
                  ]}
                >After Image</Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            onPress={() => {
              if (selectedButton === 'Spare Parts') {
                setModalVisible(!modalVisible);
              } else {
                setModalVisible(!modalVisible);
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
            Upload {selectedButton}
          </CustomButton>

          {
            selectedButton === 'Before Image' && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent:'space-around' }}>
                {BeforeImages.map((item, index) => (
                  <Card
                    key={index}
                    image={item}
                    onPress={() => handleCardPress('beforeImages', index, item)}
                  />
                ))}
              </View>
            )
          }


          {
            selectedButton === 'After Image' &&
            <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {AfterImages.map((item, index) => (
                  <Card
                    key={index}
                    image={item}
                    onPress={() => handleCardPress('afterImages', index, item)}
                  />
                ))}
              </View>
            </>
          }

        </ScrollView>

        <CustomButton onPress={() => navigation.navigate("BookingsDetails", { id: props.route?.params?.booking?._id })} btnStyle={{ margin: 10 }}>
          Done
        </CustomButton>
      </>
      }


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(!modalVisible)}
          style={styles.centeredView}>
          <TouchableOpacity activeOpacity={1} style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 40,
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity onPress={() => openCamera('beforeImage')}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                  source={imageConstant.camera}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openGallery('beforeImage')}>
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
    height: 200,
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
  },
  imageTextContainer: {
    alignItems: 'center',
    marginTop: 5,
    // marginLeft: 15,
    flexDirection: 'column'
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    // marginLeft: 15,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: -2,
    right: -3
  },
  removeButtonText: {
    height: 25,
    width: 25,
    resizeMode: 'contain'
  },

});





export default ImagesUploadScreen;