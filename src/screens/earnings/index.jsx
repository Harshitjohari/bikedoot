import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/UI/button'
import { useAuth } from '../../context/loginContext';
import { useNavigation } from '@react-navigation/native';
import Constant from '../../common/constant';
import Apis from '../../utils/api'
import FlatListContainer from '../../components/flatlist';
import RevenueCard from '../../components/revenue/revenue';


import Header from '../../components/header';

const Earnings = (props) => {
  const { token, userData } = useAuth();


  useEffect(() => {
    fetchRevenueData();
  }, []);

  const navigation = useNavigation();

  const [RevenueData, setRevenueData] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loadUserDataFromStorage, clearAuthData } = useAuth();


  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.REVENUE, token)
      // console.log('123============>',response?.data)
      setLoading(false);
      if (response?.status) {
        setRevenueData(response?.data);
      } else {
        // show(response ?.message || "Failed to send OTP, try again later");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };

  const renderItem = ({ item }) => <RevenueCard revenue={item} />;


  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title="Earnings" />
      <View style={{padding:5,flex: 1}}>
      <FlatList
        horizontal={false}
        containerStyle={{marginBottom: 10 }}
        data={RevenueData}
        emptyMessage="No data found"
        isLoading={loading}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});

export default Earnings;