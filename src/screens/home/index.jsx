import React, { useState, useEffect } from 'react';
import { FlatList, Center, Box, Button, ScrollView } from 'native-base';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, navigation, Switch, SafeAreaView, Alert, TextInput, Linking } from 'react-native';
import RoundBoxCard from '../../components/UI/services-cards';
import RoundBoxCardNumber from '../../components/UI/card_number';
import TextHeader from '../../components/UI/text-header'
import MyCarousel from '../../components/UI/image-carosel'
import Icon from 'react-native-vector-icons/FontAwesome';
// import BookingList from '../bookings/my-bookings'
import MainHeader from '../../components/header/home-header'
import Apis from '../../utils/api'
import Constant from '../../common/constant';
import LoadingSpinner from '../../components/UI/loading'
import { useAuth } from '../../context/loginContext';
import { imageConstant } from '../../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Logout } from '../../utils/logout'
import { useNavigation } from '@react-navigation/native';

import { getToken } from '../../utils/NotificationController';
import Storage from '../../utils/async-storage';
import CustomButton from '../../components/UI/button'
import { handleToast } from '../../utils/toast';
import crashlytics from '@react-native-firebase/crashlytics';


const width = Dimensions.get('window').width;



const HorizontalFlatList = (props) => {
  const { token, userData, clearAuthData } = useAuth();
  const navigation = useNavigation()

  useEffect(() => {
    fetchHomeData();
    fetchProfileData();
    updateFcmToken();
  }, []);

  //   useEffect(() => {
  //     crashlytics().crash();
  // }, []);

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


  const renderItem = ({ item, index }) => (
    <RoundBoxCardNumber value={item.value} title={item.title} onPress={() => props.navigation.navigate('Bookings', { id: item.status, value: item.value, index: index })} />
  );

  const renderServicesItem = ({ item }) => (
    <RoundBoxCard onPress={() => props.navigation.navigate('ServicesList', { garageID: item._id })} iconSource={item.icon ? { uri: item?.icon } : require('../../assets/images/doorstep-services.png')} title={item.name} />
  );

  const { show } = handleToast();
  const [banners, setBanners] = useState([]);
  const [serviceCategory, setServiceCategory] = useState([]);
  const [Bookigs, setBookigs] = useState([]);
  const [Earnings, setEarnings] = useState([]);
  const [Mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [GarageData, setGarageData] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [toggleValue, setToggleValue] = useState();


  const fetchHomeData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.HOME_DATA, token)

      let getGarageData = JSON.parse(await AsyncStorage.getItem('userData'));

      // console.log('================>',response.data)
      setLoading(false);
      if (response?.status) {
        setGarageData(getGarageData);
        setBanners(response?.data?.banner);
        setServiceCategory(response?.data?.serviceCategory);
        setBookigs(response?.data?.booking);
        setEarnings(response?.data?.earnings);
        setMechanics(response?.data?.mechanics);
        if (response?.data?.withdraw.length > 0) {
          setWithdrawPending(true)
        }
        else {
          setWithdrawPending(false)
        }
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
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_PROFILE, token)
      // console.log('response123==========================>',response?.data)
      setToggleValue(response?.data?.garage?.live)

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

  const handleToggle = async () => {
    try {
      let liveStatus
      if (toggleValue == true) {
        liveStatus = false
        setToggleValue(false);
      }
      if (toggleValue == false) {
        liveStatus = true
        setToggleValue(true);
      }
      setLoading(true);
      let data = {
        live: liveStatus
      }
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.UPDATE_LIVE_STATUS, token, data)
      // console.log('responseLIVE123==========================>',response)
      setLoading(false);
      if (response?.status) {
        fetchProfileData();
      } else {
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView p={0} mb={20}>

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
                source={{ uri: GarageData?.garage?.icon }}
                style={styles.circularImage}
              />
            </TouchableOpacity>
          </View>

          <View style={{
            marginLeft: 20,
            width: '40%',
            height: 40,
            padding: 0
          }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.cardDataAddress, fontWeight: '600' }}>
              {GarageData?.garage?.address}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.cardDataAddress, fontWeight: '600' }}>
              {GarageData?.garage?.city?.name}
            </Text>
          </View>

          <View style={styles.toggleContainer}>
            <Switch
              value={toggleValue}
              onValueChange={handleToggle}
              trackColor={{ false: "#c9c5c5", true: "green" }}
              thumbColor={toggleValue ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>

          <View>
            <Text style={{ color: '#ffffff', fontWeight: 600, fontSize: 14, marginLeft: 5, alignSelf: 'center', letterSpacing: 1 }}>{toggleValue == true ? 'Online' : 'Offline'}</Text>
          </View>

          {/* <View>
            <TouchableOpacity 
              // onPress={() => {
              //   navigation.navigate("EventDetails", { id: item.id });
              // }}
              style={{
                // padding: 5,
                marginLeft: 5
              }}>
            <Image source={imageConstant.bell} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
            </View> */}

          {/* <View>
            <TouchableOpacity 
              // onPress={() => {
              //   navigation.navigate("EventDetails", { id: item.id });
              // }}
              style={{
                // padding: 5,
                marginLeft: 5
              }}>
            <Image source={imageConstant.question} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
            </View> */}

        </View>
      </View >


      <ScrollView showsVerticalScrollIndicator={false}>

        {loading ? <LoadingSpinner /> : <Box p={2}>
          <>
            {
              banners.length > 0 &&
              <MyCarousel entries={banners} />
            }
          </>
          {/* <BookingList horizontal={true} isHomePageComponent={true} navigation={props.navigation}/> */}

          <FlatList
            data={serviceCategory}
            renderItem={renderServicesItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <TextHeader title="BOOKINGS" />

          <View style={{
            marginTop: 10
          }}>

            <FlatList
              data={Bookigs}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
            />

          </View>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            justifyContent: "space-around"
          }}>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Earnings')}
                style={{
                  padding: 5,
                  marginLeft: 5
                }}>

                <View>
                  <Image
                    resizeMode='contain'
                    source={imageConstant.earnings}
                    style={styles.cardImage} />
                </View>

                <View>
                  <Text style={styles.cardData}
                  >Earnings</Text>
                </View>

                <View>
                  <Text style={styles.cardData}>₹ {Earnings} </Text>
                </View>


              </TouchableOpacity>


            </View>

            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Mechanic')}
                style={{
                  padding: 5,
                  marginLeft: 5
                }}>

                <View>
                  <Image
                    resizeMode='contain'
                    source={imageConstant.mechanic}
                    style={styles.cardImage} />
                </View>

                <View>
                  <Text style={styles.cardData}
                  >Mechanics</Text>
                </View>

                <View>
                  <Text style={styles.cardData}>{Mechanics || 0}</Text>
                </View>

              </TouchableOpacity>
            </View>

            {/* <View style={styles.card}>
              <TouchableOpacity
                // onPress={() => {
                //   navigation.navigate("EventDetails", { id: item.id });
                // }}
                style={{
                  padding: 5,
                  marginLeft: 5
                }}>

                <View>
                  <Image
                    resizeMode='contain'
                    source={imageConstant.refer}
                    style={styles.cardImage} />
                </View>

                <View>
                  <Text style={styles.cardData}
                  // style={{...styles.cardImage, width: 100}}
                  >REFER & EARN</Text>
                </View>

                <View>
                  <Text style={styles.cardData}>₹ 2000</Text>
                </View>

              </TouchableOpacity>
            </View> */}

          </View>
        </Box>
        }
      </ScrollView>

    </SafeAreaView>
  );
};

export default HorizontalFlatList;

const styles = StyleSheet.create({
  textStyle: {
    color: 'black'
  },
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
    fontSize: 13,
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
    marginLeft: 10,
    // backgroundColor: 'pink',
    width: 60,
    height: 30,
    alignContent: 'center'
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
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '35%',
    // marginTop: 40
  },
  submitText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    // marginTop: 10,
    width: '35%',
    borderColor: '#5349f8',
    borderWidth: 1
  },
  cancelText: {
    color: '#5349f8',
    fontSize: 15,
    fontWeight: 'bold',
  }

})
