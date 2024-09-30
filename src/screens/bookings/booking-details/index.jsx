import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import FlatListContainer from '../../../components/flatlist';
import BookingCard from '../../../components/bookings/my-bookings-details/single-booking';
import CustomButton from '../../../components/UI/button';

import { imageConstant } from '../../../utils/constant';


import BookingCardDetail from '../../../components/bookings/my-bookings-details/single-booking';

import { useIsFocused } from '@react-navigation/native';



const DetailsScreen = (props) => {

  // console.log('1props===================>',props.route?.params?.id)
  const isFocused = useIsFocused();

  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();

  const [isData, setIsData] = useState()


  // console.log('bookingData===================>',bookingData)



  useEffect(() => {
    if (isFocused)
      fetchBookingsDetails();
  }, [isFocused]);

  const fetchBookingsDetails = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_USER_BOOKINGS_DETAILS + props.route?.params?.id,
        token
      );

      if (response?.status) {

        const data = await response?.data;
        setBookingData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  // if (!refresh) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <View style={{ flex: 1, backgroundColor: '#edeeec' }}>
      <Header title="Booking Details" />


      {bookingData?.status !== 'COMPLETED' && (
        <View style={{ position: 'absolute', top: 20, right: 20 }}>
          <TouchableOpacity onPress={() => fetchBookingsDetails()}>
            <Image source={imageConstant.refresh} alt="" style={{ width: 30, height: 30, resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      )}

      {/* <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={{ flex: 1, backgroundColor: "#edeeec" }}> */}
      {
        bookingData && <BookingCardDetail booking={bookingData} refresh={fetchBookingsDetails} />
      }

      {/* {bookingData?.status === 'APPROVED' && (
        <CustomButton
          onPress={() => fetchBookingsDetails()}
          btnStyle={{ margin: 10 }}>
          Share Auth Code with Mechanic...
        </CustomButton>
      )} */}

      {/* </View>
      </ScrollView> */}


    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // flexGrow: 1,
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
});




export default DetailsScreen;