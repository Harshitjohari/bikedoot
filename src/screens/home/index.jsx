import React, { useState, useEffect } from 'react';
import { FlatList, Center, Box, Button, Text, ScrollView, Platform } from 'native-base';
import { Alert } from 'react-native';

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



const HorizontalFlatList = (props) => {
  const navigation = useNavigation()
  const { token, userData, setLatLong, selectedCity, location } = useAuth();
  let cityID = "";
  const [banners, setBanners] = useState([]);
  const [serviceCategory, setServiceCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  // useEffect(() => {
  //   checkGPS();
  // }, []);

  const checkGPS = (item) => {
    setLoadingServices(true)
    Geolocation.getCurrentPosition(
      (position) => {
        setLoadingServices(false)
        console.log('==============>', position.coords);
        if (position.coords) {
          navigation.navigate('ServicesList', { garageID: item._id, title: item.name, loc:position.coords });
          setLatLong(JSON.stringify(position.coords), JSON.stringify(position.coords))
        }
      },
      (error) => {
        setLoadingServices(false)
        console.log('===================++>', error)
        Alert.alert(
          'GPS not enabled',
          'Please enable GPS to use this app.',
          [
            { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
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




  useEffect(() => {
    fetchHomeData(cityID);
  }, [cityID]);

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
    <Box p={0} mb={15}>
      <MainHeader title="Home" showLanguageIcon={true} onCityChange={(cityID) => fetchHomeData(cityID)} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>

        {loading ? <LoadingSpinner /> : <Box p={2}>
          <>
            {
              banners.length > 0 &&
              <MyCarousel entries={banners} />
            }
          </>
          <BookingList horizontal={true} isHomePageComponent={true} navigation={props.navigation} />
          <TextHeader title="Book Your Service" showSeeAll={false} />

          {loadingServices ? <Box p={2}> <LoadingSpinner text={'Please wait fetching location...'} /> </Box > : (
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



export default HorizontalFlatList;
