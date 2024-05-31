import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import FlatListContainer from '../../../components/flatlist';
import CustomButton from '../../../components/UI/button'




import BookingCardDetail from '../../../components/bookings/my-bookings-details-mechanic/single-booking';

import { useIsFocused } from '@react-navigation/native';



const PaymentPage = (props) => {

  // console.log('========>',props?.route?.params)

  const isFocused = useIsFocused();

  const [imageData, setImageData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();
  const [paymentType, setPaymentType] = useState(null);
  const [txnID, setTxnID] = useState('');
  const [image, setImage] = useState('https://yrf.com.au/wp-content/uploads/2021/09/placeholder-wire-image.jpg');


  useEffect(() => {
  }, []);

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
          'response from camera------------------->',
          JSON.stringify(response)
        );
        // let formDataReq = new FormData();
        // let data = {
        //   uri: response?.assets?.[0]?.uri,
        //   type: response?.assets?.[0]?.type,
        //   name: response?.assets?.[0]?.fileName,
        // };
        // formDataReq.append('file', data);
        setImage(response?.assets?.[0]?.uri)
        setImageData(response)
        // handleSubmit(response);
      }
    });
  };


  const handleSubmit = async () => {
    try {
      let formDataReq = new FormData();

      if(paymentType === 'QR Payment'){
        let data = {
          uri: imageData?.assets?.[0]?.uri,
          type: imageData?.assets?.[0]?.type,
          name: imageData?.assets?.[0]?.fileName,
        };
        formDataReq.append('image',data);
        
      }
      if(paymentType === 'Cash'){
        formDataReq.append('txnId',txnID);
        formDataReq.append('type', paymentType);
      }
          
      setLoading(true)
      let response = await fetch(Constant.BASE_URL + Constant.ADD_PAYMENT + props?.route?.params + '/addPayment', {
        method: "POST",
        headers: {
          "token": token,
          'Content-Type': 'multipart/form-data'
        },
        body: formDataReq
      })
      let result = await response.json()

      console.log('result==========++>',result)

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
    catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header title="Add Payment" />

      <View style={{ flex: 1, padding: 20, marginTop: 30 }}>

        <Text style={styles.text}>Select Payment Type</Text>

        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 40 }}>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              paymentType === 'Cash' && styles.selectedButton,
            ]}
            onPress={() => setPaymentType('Cash')}>
            <Text style={styles.text}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              paymentType === 'QR Payment' && styles.selectedButton,
            ]}
            onPress={() => setPaymentType('QR Payment')}>
            <Text style={styles.text}>QR Payment</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.text}>Transaction ID</Text>
        <TextInput
          style={{
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
          }}
          onChangeText={(text) => setTxnID(text)}
          value={txnID}
          placeholder="Transaction ID"
        />

        {image && paymentType === 'QR Payment' && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, marginTop: 30, borderRadius: 20, resizeMode: 'cover', alignSelf: 'center' }}
          />
        )}

        {paymentType === 'QR Payment' && (
          <CustomButton
            onPress={openCamera}
            btnStyle={styles.uploadButton}>
            Upload Image
          </CustomButton>
        )}

        <CustomButton
          onPress={handleSubmit}
          btnStyle={{ marginTop: 100 }}>
          Submit
        </CustomButton>

      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // flexGrow: 1,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
    backgroundColor: '#edeeec'
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  docsImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black'
  },
  bikeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bikeIcon: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Set your background color
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  docsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  paymentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  selectedButton: {
    backgroundColor: 'white',
    borderColor: '#5349f8',
  },
  uploadButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});




export default PaymentPage;