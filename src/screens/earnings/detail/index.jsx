import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/UI/button'
import { useAuth } from '../../../context/loginContext';
import { useNavigation } from '@react-navigation/native';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api'
import FlatListContainer from '../../../components/flatlist';
import RevenueCardDetail from '../../../components/revenue/revenue-details/revenue-detail';
import LoadingSpinner from '../../../components/UI/loading';


import Header from '../../../components/header';

const EarningDetail = (props) => {

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const navigation = useNavigation();
  const { token, userData } = useAuth();
  const [RevenueData, setRevenueData] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.REVENUE_DETAIL + props.route.params.id, token)
      // console.log('============>', token)
      setLoading(false);
      if (response?.status) {
        setRevenueData(response?.data);
      } else {
        // show(response ?.message;
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };



  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title="Earning Details" />
      {loading ? <LoadingSpinner /> : <View p={2}></View>}

      {
        RevenueData && <RevenueCardDetail revenue={RevenueData} />
      }

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});

export default EarningDetail;