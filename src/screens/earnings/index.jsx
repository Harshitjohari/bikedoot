import React, { useState, useEffect } from 'react';
import { View, Text, Image,Alert, StyleSheet,TextInput, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/UI/button'
import { useAuth } from '../../context/loginContext';
import { useNavigation } from '@react-navigation/native';
import Constant from '../../common/constant';
import Apis from '../../utils/api'
import FlatListContainer from '../../components/flatlist';
import RevenueCard from '../../components/revenue/revenue';
import { handleToast } from '../../utils/toast';
import Header from '../../components/header';

const Earnings = (props) => {
  const { token, userData } = useAuth();


  useEffect(() => {
    fetchRevenueData();
    fetchHomeData();
  }, []);

  const navigation = useNavigation();
  const { show } = handleToast();
  const [RevenueData, setRevenueData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [withdrawPending, setWithdrawPending] = useState(false);
  const [Earnings, setEarnings] = useState([]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      let data = {
        from : 'revenue'
      }
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.HOME_DATA, token,data)
      // console.log('================>',response.data)
      setLoading(false);
      if (response?.status) {
        setEarnings(response?.data?.earnings);
        if(response?.data?.withdraw.length > 0){
          setWithdrawPending(true)
        }
        else{
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

  const handleWithdrawAmountChange = (amount) => {
    if (!isNaN(amount) && Number(amount) <= Earnings) {
      setWithdrawAmount(amount);
    } else if (Number(amount) > Earnings) {
      alert('Amount cannot exceed your earnings.');
    }
  };

  const handleWithdrawPress = () => {
    if (withdrawPending) {
      Alert.alert(
        'Withdrawal pending!!',
        'Your recent withdrawal is already in queue.',
        [
          {
            text: 'Ok',
            style: 'cancel',
          }
        ],
        { cancelable: false }
      );
    } else {
      setModalVisible(!modalVisible);
    }
  };

  const handleWithdraw =  async () => {
    if (!withdrawAmount) {
      Alert.alert('Error', 'Please fill valid amount');
      return;
    }
    try {
      setLoading(true);
      let data = {
        amount : withdrawAmount
      }
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.REQUEST_WITHDRAW, token,data)
      setLoading(false);
      if (response?.status) {
    console.log('=========>')

        show(response?.message, 'success');
        setModalVisible(false);
        setWithdrawAmount(null);
        fetchHomeData();
      } else {
        show(response?.message, 'error');
        setModalVisible(false);
      }
    } catch (e) {
      setLoading(false);
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

      {
        Earnings > 0 &&
        <CustomButton onPress={() => handleWithdrawPress()} btnStyle={{ margin: 5 }}>
          Withdraw
        </CustomButton>
      }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Withdraw Earnings</Text>

            <View style={{
              width: "90%",
              minHeight: 40,
              maxHeight: 40,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
              borderBottomWidth: 1,
              borderColor: '#E6E8EC',
            }}>
              <Text style={styles.textStyle}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="black"
                keyboardType='numeric'
                value={withdrawAmount}
                onChangeText={handleWithdrawAmountChange}
              />
            </View>



            <View flexDirection={'row'}
              justifyContent={'space-evenly'}
              p={3}
              marginTop={50}
              width={'100%'}>
              <TouchableOpacity
                onPress={() => {setModalVisible(false); setWithdrawAmount(null);}}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleWithdraw}
                style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
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
    height: 300,
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
});

export default Earnings;