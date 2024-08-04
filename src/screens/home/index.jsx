import React, { useState, useEffect } from 'react';
import { FlatList, Center, Box, Button, Text, ScrollView, Platform } from 'native-base';
import { Alert, PermissionsAndroid, View, TouchableOpacity, StyleSheet, Linking } from 'react-native';

import RoundBoxCard from '../../components/UI/services-cards';
import TextHeader from '../../components/UI/text-header'
import MyCarousel from '../../components/UI/image-carosel'
import Icon from 'react-native-vector-icons/FontAwesome';
import BookingList from '../bookings/my-bookings'
import MainHeader from '../../components/header/home-header'
import Apis from '../../utils/api'
import Constant from '../../common/constant';
import LoadingSpinner from '../../components/UI/loading'
import { useAuth } from '../../context/loginContext';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { imageConstant } from '../../utils/constant';
import FastImage from 'react-native-fast-image';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import Geolocation from 'react-native-geolocation-service';

import Storage from '../../utils/async-storage';
import { getToken } from '../../utils/NotificationController';
import crashlytics from '@react-native-firebase/crashlytics';
import { checkVersion } from "react-native-check-version";
import Modal from "react-native-modal";



const HorizontalFlatList = (props) => {
  const navigation = useNavigation()
  const { token, userData, setLatLong, selectedCity, location } = useAuth();
  let cityID = "";
  const [banners, setBanners] = useState([]);
  const [serviceCategory, setServiceCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState({});
  const [loadingServices, setLoadingServices] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  // useEffect(() => {
  //   crashlytics().crash();
  // }, []);

  useEffect(() => {
    fetchHomeData(cityID);
  }, [cityID]);

  useEffect(() => {
    updateFcmToken();
    checkAppVersion();
  }, []);


  const checkAppVersion = async () => {
    try {
      const version = await checkVersion();
      console.log("Got version info:", version);
      setAppData(version);
      if (version.needsUpdate) {
        console.log(`App has a ${version.updateType} update pending.`);
        setModalVisible(true);
      }
    } catch (e) {
      console.log("Some error has occured!", e);
    }
  };

  const updateFcmToken = async () => {
    try {
      let fcmToken = await getToken();
      // console.log('FCM=============>',fcmToken)
      if (fcmToken !== "") {
        let data = {
          "fcmToken": fcmToken
        }
        let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.UPDATE_FCM, token, data)
        if (response?.status) {
          console.log('FCM UPDATED')
        }
      }
    } catch (e) {
      console.log("Some error has occured!", e);
    }
  };


  const requestLOcationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const checkGPSOnStart = () => {
    console.log('====checkGPSOnStart===')
    Geolocation.getCurrentPosition(
      (position) => {
        if (position.coords) {
          console.log('==================================================>', position)
          setLatLong(position.coords)
        }
      },
      (error) => {
        console.log('error=================================================>', error)
        // Alert.alert(           
        //   'Location Error',
        //   error.code == 2 ? 'Please enable GPS to use this app.' : error.message,
        //   [
        //     { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        //   ],
        //   { cancelable: false }
        // );
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };



  const checkGPS = async (item) => {
    if (location && location.latitude) {
      console.log('main=================================================>', location)
      navigation.navigate('ServicesList', { garageID: item._id, title: item.name, loc: location });
    } else {
      setLoadingServices(true)
      Geolocation.getCurrentPosition(
        (position) => {
          setLoadingServices(false)
          // console.log('==============>', position.coords);
          if (position.coords) {
            console.log('=======navigation.navigateServicesList=======>');
            navigation.navigate('ServicesList', { garageID: item._id, title: item.name, loc: position.coords });
            setLatLong(position.coords)
          }
        },
        (error) => {
          setLoadingServices(false)
          // console.log('===================++>', error)       
          Alert.alert(
            'Location Error',
            error.code == 2 ? 'Please enable GPS to use this app.' : error.message,
            [
              { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
          );
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
      );
    }
  };



  if (selectedCity) {
    if (selectedCity._id !== null) {
      cityID = selectedCity._id;
    }
  }

  // const cityID = "";

  const data = [
    { id: '1', iconSource: { uri: 'https://freepngimg.com/thumb/bike/23104-9-hero-bike-transparent-background.png' }, title: 'Hero Bike' },
    { id: '3', iconSource: { uri: 'https://freepngimg.com/thumb/bike/23462-4-biker-transparent-background.png' }, title: 'yamaha Bike' },
    { id: '2', iconSource: { uri: 'https://freepngimg.com/thumb/bike/23104-9-hero-bike-transparent-background.png' }, title: 'Honda Bike' },
    // Add more data as needed
  ];

  const renderItem = ({ item }) => (
    <RoundBoxCard iconSource={item.iconSource} title={item.title} />
  );

  // const renderServicesItem = ({ item }) => (
  //   <RoundBoxCard onPress={() => props.navigation.navigate('ServicesList', { garageID: item._id, title: item.name })} iconSource={item.icon ? { uri: item?.icon } : require('../../assets/images/doorstep-services.png')} title={item.name} />
  // );

  const renderServicesItem = ({ item }) => (
    <RoundBoxCard onPress={() => checkGPS(item)} iconSource={item.icon ? { uri: item?.icon } : require('../../assets/images/doorstep-services.png')} title={item.name} />
  );


  const fetchHomeData = async (cityID) => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.HOME_DATA + cityID + "/homeData", token)
      setLoading(false);
      if (response?.status) {
        setBanners(response?.data?.banner);
        setServiceCategory(response?.data?.serviceCategory);
      } else {
        // show(response ?.message || "Failed to send OTP, try again later");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  return (
    <Box p={0} mb={15} >
      <MainHeader title="Home" showLanguageIcon={true} onCityChange={(cityID) => fetchHomeData(cityID)} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>

        {isModalVisible && (
          <Modal isVisible={isModalVisible}>
            <View style={{ height: 200 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10 }}>
                <Text fontWeight={500} fontSize={20} textAlign="center" mb={10} >Hello! a new update is available.</Text>
                <View flexDirection={'row'}
                  justifyContent={'space-evenly'}
                  p={3}
                  marginTop={10}
                  width={'100%'}>
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Linking.openURL(appData.url)}
                    style={styles.submitButton}>
                    <Text style={styles.submitText}>Update</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>
        )}

        {loading ? <LoadingSpinner /> : <Box p={2}>
          <>
            {
              banners.length > 0 &&
              <MyCarousel entries={banners} />
            }
          </>
          <BookingList horizontal={true} isHomePageComponent={true} navigation={props.navigation} />
          <TextHeader title="Book Your Service" showSeeAll={false} />

          {loadingServices ? <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8 }}> <FastImage
            source={imageConstant.map}
            style={{ width: 100, height: 100, marginBottom: 5 }}
            resizeMode="contain"
          /> </Box > : (
            <FlatList
              data={serviceCategory}
              renderItem={renderServicesItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
            // numColumns={2}
            />
          )}

          {/* <TextHeader title="Services By Brand" onPressSeeAll={() => console.log("Under construction")} />

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          /> */}
        </Box>}

      </ScrollView>
    </Box>
  );
};


const styles = StyleSheet.create({
  scrollView: {
      flex: 1,
      marginBottom: 0,
      width: "100%"
  },
  modalView: {
      position: 'absolute',
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
      bottom: 0
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
  submitButton: {
      backgroundColor: '#5349f8',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      width: '40%',
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
      width: '40%',
      borderColor: '#5349f8',
      borderWidth: 1
  },
  cancelText: {
      color: '#5349f8',
      fontSize: 16,
      fontWeight: 'bold',
  }
});


export default HorizontalFlatList;
