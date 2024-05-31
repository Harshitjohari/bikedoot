import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MultiSelect from 'react-native-multiple-select';

import { handleToast } from '../../../utils/toast';


import CustomButton from '../../../components/UI/button'
import RNMultiSelect, {
  IMultiSelectDataTypes,
} from "@freakycoder/react-native-multiple-select";
import { imageConstant } from '../../../utils/constant';
import LoadingSpinner from '../../../components/UI/loading'
import CustomDropdown from '../../../components/UI/customDroopdown';




let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;


const EditScreen = (props) => {

  const { token } = useAuth();
  const { show, close, closeAll } = handleToast();
  const [mechanicData, setMechanicData] = useState(null);
  const [updatedMechanicData, setUpdatedMechanicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bikeOptions, setBikeOptions] = useState([]);

  const [modalVisibleProfile, setModalVisibleProfile] = useState(false);
  const [modalVisiblePan, setModalVisiblePan] = useState(false);
  const [modalVisibleAadharF, setModalVisibleAadharF] = useState(false);
  const [modalVisibleAadharB, setModalVisibleAadharB] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [preSelected, setPreSelected] = useState();



  useEffect(() => {
    fetchMechanicDetails();
    fetchBikeDropDownData();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectedItems = (items) => {
    setSelectedItems(items);
    // console.log('Selected items:', items);
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
          value: bike.name,
          key: bike._id,
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

  const fetchMechanicDetails = async () => {
    try {
      setLoading(true);

      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_MECHANICS_DETAILS + props.route?.params?.id,
        token
      );


      if (response?.status) {
        let data = await response?.data;

        // console.log('=============>',data)
        const dataWithKeyss = data.specialistBike.map((bike, index) => ({
          value: bike.name,
          key: bike._id,
        }));
        setPreSelected(dataWithKeyss);
        setSelectedItems(dataWithKeyss);
        setMechanicData(data);
        setUpdatedMechanicData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      // Handle error appropriately
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
      formDataReq.append('_id', updatedMechanicData._id);

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

  const handleUpdate = async () => {
    try {
      setLoading(true)
      let data = {
        _id: updatedMechanicData._id,
        name: updatedMechanicData.name,
        mobile: updatedMechanicData.mobile,
        aadharNo: updatedMechanicData.aadharNo,
        panNo: updatedMechanicData.panNo,
        experience: updatedMechanicData.experience,
        specialistBike: selectedItems.map(d => d.key)
      }
      let response = await Apis.HttpPutRequest(Constant.BASE_URL + Constant.UPDATE_MECHANIC, token, data)
      setLoading(false)
      // console.log('response=================+>',response)
      if (response?.status) {
        show(response ?.message, "success");
        props.navigation.navigate('Mechanic');
      }
      else {
        show(response ?.message, "error");
      }
    } catch (error) {
      console.error('Error updating mechanic:', error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      <Header title="Edit Mechanic Details" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={Height / 2}
        extraScrollHeight={Height / 2}
        contentContainerStyle={{ flexGrow: 1 }}>

        <ScrollView contentContainerStyle={styles.container}>

          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Image source={require('./back_arrow.png')} style={styles.backArrow} />
    </TouchableOpacity> */}

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
              placeholder=""
              value={updatedMechanicData?.name}
              onChangeText={(value) => setUpdatedMechanicData({ ...updatedMechanicData, name: value })}
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
            <Text style={styles.textStyle}>Mobile</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
              value={updatedMechanicData?.mobile.toString()}
              onChangeText={(value) => setUpdatedMechanicData({ ...updatedMechanicData, mobile: value })}
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
            <Text style={styles.textStyle}>Aadhar No</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
              value={updatedMechanicData?.aadharNo}
              onChangeText={(value) => setUpdatedMechanicData({ ...updatedMechanicData, aadharNo: value })}
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
            <Text style={styles.textStyle}>Pan No</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="black"
              value={updatedMechanicData?.panNo}
              onChangeText={(value) => setUpdatedMechanicData({ ...updatedMechanicData, panNo: value })}
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
            <Text style={styles.textStyle}>Experience</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder=""
              placeholderTextColor="black"
              value={updatedMechanicData?.experience.toString()}
              onChangeText={(value) => setUpdatedMechanicData({ ...updatedMechanicData, experience: value })}
            />
          </View>

          <View style={{
            width: "90%",
            minHeight: 40,
            maxHeight: 50,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 50,
            borderBottomWidth: 1,
            borderColor: '#E6E8EC',
          }}>
            <Text style={styles.textStyle}>Specialist Bike</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="black"
              multiline={true}
              value={updatedMechanicData?.specialistBike.map(bike => bike.name).join(', ')}
              onChangeText={(value) => setUpdatedMechanicData({ ...updatedMechanicData, data: value })}
              editable={false}
            />
          </View>

          <View style={{
            width: "90%",
            // minHeight: 40,
            // maxHeight: 40,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 30,
            // borderBottomWidth: 1,
            // borderColor: '#E6E8EC',
          }}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.input}>

              {
                selectedItems.length == 0 &&
                <Text style={{
                  color: 'black',
                  marginTop: 10,
                  fontSize: 16,
                  textAlign: 'center'
                }}>Select bikes to update</Text>
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
              preSelectedItems={preSelected}
            />
          </View>

          <View style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            // marginBottom : 100
          }}>
            <CustomButton onPress={handleUpdate} btnStyle={{}}>
              Update
            </CustomButton>
          </View>

          <View style={styles.rowContainer}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <View style={styles.profileContainer}>
                <Text style={styles.profileText}>Profile</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={updatedMechanicData?.profile ? { uri: updatedMechanicData?.profile } : imageConstant.profile1}
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
                    source={updatedMechanicData?.aadharFrontImage ? { uri: updatedMechanicData?.aadharFrontImage } : { uri: 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png' }}
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
                    source={updatedMechanicData?.aadharBackImage ? { uri: updatedMechanicData?.aadharBackImage } : { uri: 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png' }}
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
                    source={updatedMechanicData?.panImage ? { uri: updatedMechanicData?.panImage } : { uri: 'https://cdn.pixabay.com/photo/2022/11/09/00/45/pan-card-7579594_1280.png' }}
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

          </View>

        </ScrollView>
      </KeyboardAwareScrollView>

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
    overflow: 'hidden'
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
  profileText: {
    marginBottom: 8,
    fontWeight: '400',
    color: 'black',
    fontSize: 15
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
});

export default EditScreen;