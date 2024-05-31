import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Dimensions, Image,Alert, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Constant from '../../../../common/constant';
import Apis from '../../../../utils/api';
import Header from '../../../../components/header';
import { useAuth } from '../../../../context/loginContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';



import CustomButton from '../../../../components/UI/button'

import { imageConstant } from '../../../../utils/constant';



let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;


const EditScreen = (props) => {
  let spareData = props?.route?.params
  // console.log('spareData=====>',spareData)

  

  const navigation = useNavigation()


  const { token } = useAuth();
  const [isLoading, setLoading] = useState(true);

  const [modalVisibleProfile, setModalVisibleProfile] = useState(false);
  const [modalVisibleAadharF, setModalVisibleAadharF] = useState(false);
  
  const [customData, setCustomData] = useState({
    name: spareData?.name,
    quantity: spareData?.quantity,
    price: spareData?.price,
    gstRate: spareData?.gstRate,
    beforeImage: spareData?.beforeImage,
    afterImage: spareData?.afterImage,
  });


  const updateImage = async(reqData,key)=>{
    try{
      // console.log('key====================>',key)
      let formDataReq = new FormData();
      let data = {
        uri: reqData?.assets?.[0]?.uri,
        type: reqData?.assets?.[0]?.type,
        name: reqData?.assets?.[0]?.fileName,
      };

      formDataReq.append(key,data);
      formDataReq.append('_id',spareData?._id);

      // console.log('formDataReq=================+>',formDataReq)



      setLoading(true)
        let response = await fetch(Constant.BASE_URL + Constant.UPDATE_SPARE + spareData?.bookId + '/spareParts/update',{
            method: "PUT",
            headers: {
                "token": token,
                'Content-Type': 'multipart/form-data'
            },
            body : formDataReq
        })
        let result = await response.json()
      
      setLoading(false)

      if (result?.status) {
        // show(response ?.message, "success");
        props.navigation.goBack();
        // props.navigation.navigate('SpareEdit',{id : spareData._id})
      }
      else {
        // show(response?.message || "Failed to update, please try again later", "error");
      }

    }
    catch(error)
    {
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
        updateImage(response,key);
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
    launchImageLibrary(options,  async (response) => {
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
        updateImage(response,key);
      }
    });
  };


  const handleCustomInputChange = (key, value) => {
    setCustomData({ ...customData, [key]: value });
  };


  // console.log('===========+?',customData)

  const handleUpdate = async () => {
    // if (!customData.name || !customData.quantity || !customData.price) {
    //   Alert.alert('All fields are required');
    //   return;
    // }

    const saveData = {
      _id:spareData?._id,
      name: customData.name,
      quantity: customData.quantity,
      price: customData.price,
      gstRate:customData.gstRate
    };

    // console.log('send=========>',saveData)

    setLoading(true)
    let response = await Apis.HttpPutRequest(Constant.BASE_URL + Constant.UPDATE_SPARE + spareData?.bookId + '/spareParts/update', token, saveData);
    // console.log('res============++>',response)

    if (response?.status) {
      // show(response ?.message, "success");
      // navigation.navigate("SpareListScreen", spareData?.bookId)
      props.navigation.goBack();
      // props.navigation.navigate('SpareEdit',{spareData?.bookId})
    } else {
      show(response?.message || "Failed to send data, try again later", "error");
    }


    // Clear input fields
    // setCustomData({ name: '', quantity: '', price: '' });

    // Close the modal
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      <Header title="Edit Spare" />

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
              value={customData?.name}
              onChangeText={(text) => handleCustomInputChange('name', text)}
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
            <Text style={styles.textStyle}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
              value={customData?.quantity.toString()}
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
              placeholder=""
              keyboardType="numeric"
              value={customData?.price.toString()}
              onChangeText={(text) => handleCustomInputChange('price', text)}
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
            <Text style={styles.textStyle}>Gst Rate</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
              value={customData?.gstRate.toString()}
              onChangeText={(text) => handleCustomInputChange('gstRate', text)}
            />
          </View>


          <View style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 90,
            // marginBottom : 100
          }}>
            <CustomButton onPress={handleUpdate} btnStyle={{}}>
              Update
            </CustomButton>
          </View>



          <View style={styles.rowContainer}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <View style={styles.profileContainer}>
                <Text style={styles.profileText}>Before image</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: customData?.beforeImage }}
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
                <Text style={styles.profileText}>After image</Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.imageStyle}
                    source={{ uri: customData?.afterImage }}
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
              <TouchableOpacity onPress={() => openCamera('afterImage')}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                  source={imageConstant.camera}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openGallery('afterImage')}>
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
    // flex: 0,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    paddingBottom: 100
  },
  rowContainer: {
    justifyContent: 'center',
    marginLeft: 50,
    marginRight: 50,
    marginTop: 70
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  imageContainer: {
    borderRadius: 10,
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
    resizeMode: 'cover'
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