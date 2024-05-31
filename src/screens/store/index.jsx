import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/UI/button'
import { useAuth } from '../../context/loginContext';
import { useNavigation } from '@react-navigation/native';
import Constant from '../../common/constant';
import Apis from '../../utils/api'


import Header from '../../components/header';

const Store = (props) => {
  const { token, userData } = useAuth();


  useEffect(() => {
    // fetchProfileData();
  }, []);

  const navigation = useNavigation();

  const [GarageData, setGarageData] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loadUserDataFromStorage, clearAuthData } = useAuth();


  // const fetchProfileData = async () => {
  //   try {
  //     setLoading(true);
  //     let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_PROFILE, token)
  //     // console.log('123============>',response?.data)
  //     setLoading(false);
  //     if (response ?.status) {
  //     setGarageData(response?.data);
  //     } else {
  //       // show(response ?.message || "Failed to send OTP, try again later");
  //     }
  //   } catch (e) {
  //     setLoading(false);
  //     // show("Some error has occured!");
  //   }
  // };

  const { garage } = GarageData;

  return (
     <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title="Store"/>

       <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coming Soon.....</Text>
      </View>
    </ScrollView>

    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    marginTop:10
    // justifyContent: 'center', // Center content vertically
    // alignItems: 'center', // Center content horizontally
  },
  header: {
    alignItems: 'center', // Center content horizontally
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default Store;