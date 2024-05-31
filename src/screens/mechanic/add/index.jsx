import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Modal, Alert, StyleSheet, TouchableOpacity, Permissions, KeyboardAvoidingView, Platform, Text, Dimensions } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CustomButton from '../../../components/UI/button'

import { ScrollView } from 'native-base';
import CustomDropdown from '../../../components/UI/customDroopdown';
import { handleToast } from '../../../utils/toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { imageConstant } from '../../../utils/constant';





let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;




const MechanicAdd = (props) => {
  let bookingId = props?.route?.params?.id

  const { token } = useAuth();

  const { show, close, closeAll } = handleToast();
  const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [experience, setExperience] = useState('');
  const [specialistBike, setSpecialistBike] = useState([]);
  const [bikeOptions, setBikeOptions] = useState([]);
  const [modalVisibleProfile, setModalVisibleProfile] = useState(false);
  const [modalVisiblePan, setModalVisiblePan] = useState(false);
  const [modalVisibleAadharF, setModalVisibleAadharF] = useState(false);
  const [modalVisibleAadharB, setModalVisibleAadharB] = useState(false);
  const [selectedBikes, setSelectedBikes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);



  useEffect(() => {
    requestPermissions();
    fetchBikeDropDownData();
  }, []);


  const requestPermissions = async () => {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // if (status !== 'granted') {
    //   Alert.alert('Permission Denied', 'Please allow access to your photos in device settings.');
    // }
  };
  const fetchBikeDropDownData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_BIKE,
        token
      );

      if (response?.status) {
        let fullData = response?.data;

        const dataWithKeys = fullData.map((bike, index) => ({
          key: bike._id,
          value: bike.name
        }));
        setBikeOptions(dataWithKeys);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form fields
    if (!name || !mobile || !aadharNo || !panNo || !experience || !specialistBike) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Prepare data to send to API
    const data = {
      name,
      mobile,
      aadharNo,
      panNo,
      experience,
      specialistBike: selectedItems.map(d => d.key)
    };

    setLoading(true)
    let response = await Apis.HttpPostRequest(
      Constant.BASE_URL + Constant.ADD_MECHANICS,
      token,
      data
    );
    // setLoading(false)
    if (response?.status) {
      show(response ?.message, "success");
      if(props?.route?.params?.from == "booking"){
        props.navigation.navigate("BookingsDetails", { id : bookingId })
      }else{
      props.navigation.navigate('Mechanic');
      }
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }
  };

  const updateImage = async (reqData, key) => {
    try {

      let formDataReq = new FormData();
      let data = {
        uri: reqData?.assets?.[0]?.uri,
        type: reqData?.assets?.[0]?.type,
        name: reqData?.assets?.[0]?.fileName,
      };
      formDataReq.append(key, data);
      // formDataReq.append('_id', updatedMechanicData._id);

      setLoading(true)
      let response = await fetch(Constant.BASE_URL + Constant.UPDATE_MECHANIC, {
        method: "PUT",
        headers: {
          "token": token,
          'Content-Type': 'multipart/form-data'
        },
        body: formDataReq
      })

      let result = await response.json()
      // { loading = <LoadingSpinner /> }
      if (result?.status) {
        setLoading(false)

        show(result ?.message, "success");
        props.navigation.goBack();
        props.navigation.navigate('MechanicEdit', { id: updatedMechanicData._id })
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
        console.log(
          'response from gallery------------------->',
          JSON.stringify(response)
        );
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
        console.log(
          'response from gallery------------------->',
          response
        );
        updateImage(response, key);
      }
    });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectedItems = (items) => {
    setSelectedItems(items);
    // console.log('Selected items:', items);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      <Header title="Add Mechanic" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={Height / 2}
        extraScrollHeight={Height / 2}
        contentContainerStyle={{ flexGrow: 1 }}>


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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={styles.textStyle}> Name</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="grey"
            value={name}
            onChangeText={setName}
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={styles.textStyle}> Mobile</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Mobile"
            placeholderTextColor="grey"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
            maxLength={10}
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={styles.textStyle}> Aadhar No.</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Aadhar No."
            placeholderTextColor="grey"
            value={aadharNo}
            onChangeText={setAadharNo}
            keyboardType="numeric"
            maxLength={12}
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={styles.textStyle}> Pan No.</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Pan No."
            placeholderTextColor="grey"
            value={panNo}
            onChangeText={setPanNo}
            maxLength={10}
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

          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={styles.textStyle}> Experience</Text>
          </View>



          <TextInput
            style={styles.input}
            placeholder="Experience"
            placeholderTextColor="grey"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            maxLength={2}
          />

        </View>

        <View style={{
          // height:100,
          width: "90%",
          // minHeight: 40,
          // maxHeight: 40,
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 30,
          // marginBottom: 30,
          // borderBottomWidth: 1,
          // borderColor: '#E6E8EC',
          // backgroundColor:'pink',
        }}>

          {/* <CustomButton onPress={() => setModalVisible(!modalVisible)} btnStyle={{ marginTop: 10 }}>
            Select Specialist Bikes
          </CustomButton> */}



          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{ color: 'red' }}>*</Text>
            <Text style={{
              color: 'black',
              marginBottom: 10
            }}> Select Specialist Bikes</Text>
          </View>

          <TouchableOpacity onPress={toggleDropdown} style={styles.input}>

            {
              selectedItems.length == 0 &&
              <Text style={{
                color: 'black',
                marginTop: 10,
                fontSize: 16,
                textAlign: 'center'
              }}>Selected bikes</Text>
            }

            {selectedItems.length > 0 && (
              <Text style={{
                color: 'black',
                marginTop: 10,
                fontSize: 16,
                textAlign: 'center'
              }}>
                {selectedItems.length <= 3
                  ? selectedItems.map(d => d.value).join(', ')
                  : `${selectedItems.slice(0, 3).map(d => d.value).join(', ')}, + ${selectedItems.length - 3} more`}
              </Text>
            )}


          </TouchableOpacity>

          <CustomDropdown
            data={bikeOptions}
            visible={dropdownVisible}
            onClose={toggleDropdown}
            onSelect={handleSelectedItems}
          />
        </View>


        {/* <View style={styles.rowContainer}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <View style={styles.profileContainer}>
                <Text style={styles.profileText}>Profile</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={imageConstant.profile1}
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setModalVisibleProfile(!modalVisibleProfile)}
                >
                  <Image
                    style={styles.imageStyle}
                    source={imageConstant.editt}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.profileContainer}>
                <Text style={styles.profileText}>Aadhar Front</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png' }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setModalVisibleAadharF(!modalVisibleAadharF)}
                >
                  <Image
                    style={styles.imageStyle}
                    source={imageConstant.editt}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <View style={styles.profileContainer}>
                <Text style={styles.profileText}>Aadhar Back</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png' }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setModalVisibleAadharB(!modalVisibleAadharB)}
                >
                  <Image
                    style={styles.imageStyle}
                    source={imageConstant.editt}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.profileContainer}>
                <Text style={styles.profileText}>PAN</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: 'https://cdn.pixabay.com/photo/2022/11/09/00/45/pan-card-7579594_1280.png' }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setModalVisiblePan(!modalVisiblePan)}
                >
                  <Image
                    style={styles.imageStyle}
                    source={imageConstant.editt}
                  />
                </TouchableOpacity>
              </View>
            </View>

        </View> */}



      </KeyboardAwareScrollView>
      <View style={{
          marginLeft: 20,
          marginRight: 20,
          marginBottom:10
        }}>
          <CustomButton onPress={handleSubmit} btnStyle={{ marginTop: 0 }}>
            Submit
          </CustomButton>
        </View>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleAadharF}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisibleAadharF(!modalVisibleAadharF);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisibleAadharF(!modalVisibleAadharF)}
          style={styles.centeredView}>
          <TouchableOpacity activeOpacity={1} style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 40,
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity onPress={() => openCamera('aadharFrontImage')}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                  source={imageConstant.camera}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openGallery('aadharFrontImage')}>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleAadharB}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisibleAadharB(!modalVisibleAadharB);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisibleAadharB(!modalVisibleAadharB)}
          style={styles.centeredView}>
          <TouchableOpacity activeOpacity={1} style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 40,
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity onPress={() => openCamera('aadharBackImage')}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                  source={imageConstant.camera}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openGallery('aadharBackImage')}>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisiblePan}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisiblePan(!modalVisiblePan);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisiblePan(!modalVisiblePan)}
          style={styles.centeredView}>
          <TouchableOpacity activeOpacity={1} style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 40,
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity onPress={() => openCamera('panImage')}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                  source={imageConstant.camera}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openGallery('panImage')}>
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
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    borderColor: '#5349f8',
    borderWidth: 1
  },
  cancelText: {
    color: '#5349f8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    // marginTop: 22,
    // bottom:0,
    // position:'absolute',
    // width:'100%',
    // height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    overflow: 'hidden'
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
    overflow: 'hidden'
  },
  profileText: {
    marginBottom: 8,
    fontWeight: '400',
    color: 'black',
    fontSize: 15
  },
  iconContainer: {
    position: 'absolute',
    width: 42,
    height: 42,
    bottom: 0,
    right: 0,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderWidth: 0.5,
    resizeMode: 'contain'
  },
});


export default MechanicAdd;