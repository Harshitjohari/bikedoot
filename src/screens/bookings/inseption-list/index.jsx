import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Button } from 'react-native';

import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';


const CheckListScreen = (props) => {

  let booking = props.route?.params?.booking

  // console.log('bookingqwerty==============+>',booking)


  const navigation = useNavigation()

  const isFocused = useIsFocused();

  const [inceptionData, setInceptionData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();




  useEffect(() => {
    if (isFocused)
      fetchInceptionList();
  }, [isFocused]);


  const fetchInceptionList = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.INCEPTION_LIST + props.route?.params?.booking?._id + '/inception',
        token
      );

      // console.log('response==============+>', response?.data)
      if (response?.status) {

        const dataa = await response?.data;
        setInceptionData(dataa);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };


  const [checkedItems, setCheckedItems] = useState(Array(inceptionData.length).fill(false));




  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !checkedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const isAllChecked = () => {
    let checkAll = checkedItems.filter(item => item).length === inceptionData.length
    if (!checkAll) {
      Alert.alert('Please complete all checks..')
    }
    return checkAll
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header title="Pre Inspection Checklist" />

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.container}>
          <View style={styles.checkboxContainer}>
            {inceptionData.map((item, index) => (
              <View key={index} style={styles.checkboxRow}>
                <TouchableOpacity
                  onPress={() => handleCheckboxChange(index)}
                  style={styles.checkboxItem}
                >
                  <View style={[styles.checkbox, { backgroundColor: checkedItems[index] ? 'transparent' : 'transparent' }]}>
                    {checkedItems[index] && <Text style={styles.checkmark}>&#x2713;</Text>}
                  </View>
                  <Text style={styles.checkboxText}>{item.title}</Text>
                </TouchableOpacity>
                {index % 2 === 0 && index !== inceptionData.length - 1 && <View style={{ width: 20 }} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          if (isAllChecked()) {
            navigation.navigate("AddOnScreen", { booking })
          }

        }}
        style={styles.buttonNext}
      // disabled={!isAllChecked()}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({

  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    // marginBottom:10
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 8
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '60%',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'pink',
    width: '100%'
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5349f8'
  },
  checkmark: {
    fontSize: 20,
    color: 'green',
  },
  checkboxText: {
    fontSize: 15,
    color: 'black'
  },
  buttonNext: {
    height: 50,
    width: '90%',
    borderRadius: 8,
    backgroundColor: "#5349f8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal:20
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});




export default CheckListScreen;