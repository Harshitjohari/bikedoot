import React, { useState, useEffect } from 'react';
import { FlatList, Center, Box, Button, ScrollView, } from 'native-base';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, navigation, Switch, SafeAreaView } from 'react-native';
import RoundBoxCard from '../../../components/UI/services-cards';
import RoundBoxCardNumber from '../../../components/UI/card_number';
import TextHeader from '../../../components/UI/text-header'
import MyCarousel from '../../../components/UI/image-carosel'
import Icon from 'react-native-vector-icons/FontAwesome';
// import BookingList from '../bookings/my-bookings'
import MainHeader from '../../../components/header/home-header'
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import LoadingSpinner from '../../../components/UI/loading'
import { useAuth } from '../../../context/loginContext';
import { imageConstant } from '../../../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BookingCard from '../../../components/bookings/my-bookings-mechanic/single-booking';
import FlatListContainer from '../../../components/flatlist';

import {getToken} from '../../../utils/NotificationController';




const width = Dimensions.get('window').width;



const HorizontalFlatList = (props) => {
  const { token, userData, clearAuthData } = useAuth();


  const data = [];

  const [banners, setBanners] = useState([]);
  const [serviceCategory, setServiceCategory] = useState([]);
  const [Bookigs, setBookigs] = useState([]);
  const [Earnings, setEarnings] = useState([]);
  const [GarageData, setGarageData] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    fetchHomeData();
    fetchProfileData();
    getFcmToken();    
  }, []);


  const getFcmToken = async () => {
    try {
      console.log('FCMFCMFCMFCMFCMFCMFCMFCMFCMFCMFCM=============>')
      // let fcmToken = await getToken();
      // console.log('FCM=============>',fcmToken)
      
    } catch (e) {
      console.log("Some error has occured!",e);
    }
  };


  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.MECHANIC_HOME_DATA, token)
      // console.log('home==========================>', response?.data?.bookings?.current)

      if(response?.code == 401){
        // clearAuthData()
      }

      setLoading(false);
      if (response?.status) {
        let fullData = response?.data?.bookings?.current
        let bookingData = []

        bookingData.push({
          "_id": fullData?._id,
          "name": fullData?.user?.name,
          "mobile": fullData?.user?.mobile,
          "address": fullData?.address?.address,
          "addOn": fullData?.services.length > 1 ? 'Yes' : 'No',
          "addOnLength": fullData?.services.length,
          "addOnData": fullData?.services[1]?.service?.service?.name,
          "accessories": fullData?.accessories.length > 0 ? 'Yes' : 'No',
          "accLength": fullData?.accessories.length,
          "accData": fullData?.accessories.length > 0 ? fullData?.accessories[0]?.accessories?.accessories?.name : '',
          "bookingId": fullData?.bookingId,
          "bikeImage": fullData?.bike?.icon,
          "bikeName": fullData?.bike?.name,
          // "bikeName": fullData ?.bike ?.brand ?.name || "N/A",
          "status": fullData?.status || "Confirmed",
          "colorScheme": fullData?.status_color || "confirmed",
          "date": formatDate(fullData?.date),
          "time": fullData?.time,
          "bookingAmount": fullData?.amount || 0,
          "serviceType": fullData?.services[0]?.service?.service?.name,
          "mechanic": fullData?.mechanics?.name || "N/A",
        })

        setBookigs(bookingData);



      } else {
        // show(response ?.message || "Failed to send OTP, try again later");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.MECHANIC_PROFILE, token)
      // console.log('response123==========================>',response?.data)

      setLoading(false);
      if (response?.status) {
        setGarageData(response?.data);
      } else {
        // show(response ?.message || "Failed to send OTP, try again later");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  const renderItem = ({ item }) => <BookingCard onCustomPress={(page, data) => {
    fromSingleBookingClick(page, data)
  }} booking={item} />;

  const fromSingleBookingClick = async (page, data) => {
    // console.log(page,data)
    // props.route.navigation.navigate(page,data)
    props.navigate(page, data)
  }


  return (
    <SafeAreaView p={0} mb={20}>
      {/* <MainHeader title="Home" showLanguageIcon={true}/> */}

      <View style={{ height: 60, width: width }}>
        <View style={{
          // backgroundColor: 'pink',
          backgroundColor: '#534AF9',
          elevation: 0,
          alignItems: 'center',
          flexDirection: 'row',
          // paddingLeft: 0,
          // paddingRight: 0,
          height: 60
        }}>

          <View>
            <TouchableOpacity style={styles.circularImageContainer}>
              <Image
                source={{ uri: GarageData?.profile }}
                style={styles.circularImage}
              />
            </TouchableOpacity>
          </View>

          <View style={{
            marginLeft: 10,
            width: '40%',
            height: 40,
            padding: 10
          }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.cardDataAddress, fontWeight: '700' }}>
              {GarageData?.name}
            </Text>
          </View>

        </View>
      </View >


      <ScrollView showsVerticalScrollIndicator={false}>

        {isLoading ? <LoadingSpinner /> : <Box p={2}>

          <TextHeader title="CURRENT BOOKING:" />

          <View style={{
            marginTop: 4
          }}>

            <FlatListContainer
              horizontal={false}
              containerStyle={{ margin: 5, marginBottom: 0 }}
              data={Bookigs}
              emptyMessage="No bookings found"
              isLoading={isLoading}
              renderItem={renderItem}
            />
          </View>

        </Box>}

      </ScrollView>
    </SafeAreaView>
  );
};

export default HorizontalFlatList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    // borderWidth: 1, 
    borderColor: '#808080',
    // padding: 10, 
    height: 120,
    width: width / 3 - 10,
    justifyContent: 'center',
    paddingBottom: 40,
    paddingTop: 40
  },
  cardData: {
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#1A1A1A"
  },
  cardDataAddress: {
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "left",
    overflow: 'hidden',
    color: 'white',
  },
  cardImage: {
    width: 30,
    height: 30,
    marginBottom: 10,
    alignSelf: 'center'
  },
  circularImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 50,
    height: 50,
    marginLeft: 10
  },
  circularImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  toggleContainer: {
    // marginTop: 20,
    marginLeft: 15,
    // backgroundColor: 'pink',
    width: 50,
    height: 30,
    alignContent: 'center'
  },
})
