// BookingList.js
import React, { useState, useEffect } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import { View, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import FlatListContainer from '../../../components/flatlist';
import BookingCard from '../../../components/bookings/my-bookings/single-booking';
import Header from '../../../components/header';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { useAuth } from '../../../context/loginContext';
import TextHeader from '../../../components/UI/text-header'
import { useIsFocused } from '@react-navigation/native';

const width = Dimensions.get('window').width;


const BookingList = (props) => {

  const isFocused = useIsFocused();

  const { token } = useAuth();
  const [Tabs, setTabs] = useState([]);
  const [bookingFullData, setBookingFullData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [selectedButton, setSelectedButton] = useState(props.route.params?.index !== undefined ? props.route.params.index : 0);

  // console.log('props.route.params================>',props.route.params)

  



  useEffect(() => {
    if (isFocused) {
      const initialStatus = props.route.params?.id || 'ASSIGNED';
      fetchTabsData();
      fetchBookingsData(initialStatus);
    }
  }, [isFocused, props.route.params?.id]);


  const handleButtonPress = (button, index) => {
    setSelectedButton(index,button.status);
    fetchBookingsData(button.status)
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchBookingsData = async (status) => {
    try {
      setLoading(true);
      let data = {
        "status": status
      }
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.GET_USER_BOOKINGS, token, data)
      if (response?.status) {
       
        let fullData = response?.data;

        let bookingData = []

        for (let index = 0; index < fullData.length; index++) {
          bookingData.push({
            "_id": fullData[index]?._id,
            "name": fullData[index]?.user?.name,
            "mobile": fullData[index]?.user?.mobile,
            "address": fullData[index]?.address?.address,
            "addOn": fullData[index]?.services.length > 1 ? 'Yes' : 'No',
            "addOnLength": fullData[index]?.services.length,
            "addOnData": fullData[index]?.services[1]?.service?.service?.name,
            "accessories": fullData[index]?.accessories.length > 0 ? 'Yes' : 'No',
            "accLength": fullData[index]?.accessories.length,
            "accData": fullData[index]?.accessories[0]?.accessories?.accessories?.name,
            "bookingId": fullData[index]?.bookingId,
            "bikeImage": fullData[index]?.bike?.icon,
            "bikeName": fullData[index]?.bike?.name,
            // "bikeName": fullData[index] ?.bike ?.brand ?.name || "N/A",
            "status": fullData[index]?.status || "Confirmed",
            "colorScheme": fullData[index]?.status_color || "confirmed",
            "date": formatDate(fullData[index]?.date),
            "time": fullData[index]?.time,
            "bookingAmount": fullData[index]?.amount || 0,
            "serviceType": fullData[index]?.services[0]?.service?.service?.name,
            "mechanic": fullData[index]?.mechanics?.name || "Not Yet Assigned",
          })
        }

        setBookings(bookingData);
        setLoading(false);
      } else {
        setLoading(false);
        // show(response ?.message || "Failed to send OTP, try again later");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  const fetchTabsData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.HOME_DATA, token)
      setLoading(false);
      if (response?.status) {
        setTabs(response?.data?.booking);
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
    // props.navigate(page,data)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
      <Header title="Bookings" />

      <View>
        {/* Dynamic Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', padding: 5 }}>
            {Tabs.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleButtonPress(button, index)}
                style={{
                  backgroundColor: 'white',
                  borderColor: selectedButton === index ? '#534AF9' : 'white',
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  minWidth: width / Tabs.length,
                  height: 40,
                  marginHorizontal: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#534AF9', fontWeight: '500' }}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>



      {/* FlatListContainer */}
      <View style={{ flex: 1, backgroundColor: "#edeeec" }}>

        <FlatListContainer
          horizontal={false}
          containerStyle={{ margin: 10, marginBottom: 0 }}
          data={bookings}
          emptyMessage="No bookings found"
          isLoading={isLoading}
          renderItem={renderItem}
        />
      </View>

    </View>
  );

};

export default BookingList;
