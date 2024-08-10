import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/UI/button'
import { useAuth } from '../../context/loginContext';
import { useNavigation } from '@react-navigation/native';
import Constant from '../../common/constant';
import Apis from '../../utils/api'
import { imageConstant } from '../../utils/constant';
import { checkVersion } from "react-native-check-version";
import Modal from "react-native-modal";
import DeviceInfo from 'react-native-device-info';


import Header from '../../components/header';

const ProfilePage = (props) => {
  const { token, userData } = useAuth();
  const navigation = useNavigation();

  const [appData, setAppData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [UpdateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [GarageData, setGarageData] = useState(false);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchProfileData();
    checkAppVersion();
  }, []);



  const checkAppVersion = async () => {
    try {
      const bundleId = DeviceInfo.getBundleId();
      const version = await checkVersion();
      // console.log("Got version info:", version);
      setAppData(version);
      if (version.needsUpdate) {
        // console.log(`App has a ${version.updateType} update pending.`);
        setUpdateButtonVisible(true);
      }
    } catch (e) {
      console.log("Some error has occured!", e);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_PROFILE, token)
      // console.log('123============>',response?.data)
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

  const { garage } = GarageData;

  const handleMenuItemPress = (item) => {
    if (item.label === 'Update Available') {
      setModalVisible(true);
    } else if (item.isRoute) {
      navigation.navigate(item.route);
    } else {
      Linking.openURL(item.route);
    }
  };

  let menuItems = [
    { label: 'About Us           ', icon: imageConstant.info, route: Constant.ABOUT_US_URL, isRoute: false },
    { label: 'Terms & Conditions ', icon: imageConstant.terms, route: Constant.TERMS_CONDITION_URL, isRoute: false },
    { label: 'Privacy Policy     ', icon: imageConstant.insurance, route: Constant.PRIVACY_POLICY_URL, isRoute: false },
    { label: 'Help & Support     ', icon: imageConstant.helpSupport, route: `https://wa.me/916207627817?text=Hello BikedooT! My name is : ${garage?.name} and Registered Mobile No. is : ${garage?.mobile}. I need an assistance.`, isRoute: false }
  ];

  if (UpdateButtonVisible) {
    menuItems = [
      ...menuItems,
      { label: 'Update Available ', icon: imageConstant.update, route: '', isRoute: false }
    ];
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header title="Profile" />

      <ScrollView style={styles.container}>

      {isModalVisible && (
        <Modal isVisible={isModalVisible}>
          <View style={{ height: 200 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10 }}>
            <Text style={{fontWeight:500, fontSize:18, textAlign:"center", mb:2, color:'black'}}>Update Available.</Text>
            <Text style={{fontWeight:400, fontSize:15, textAlign:"center", mb:5, color:'black'}}>There is an updated version available on the Play Store.Would you like to upgrade?</Text>
              <View flexDirection={'row'}
                justifyContent={'space-evenly'}
                p={3}
                marginTop={20}
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
        <View style={styles.header}>
          <Image source={{ uri: garage?.icon }} style={styles.logo} />
          <Text style={styles.title}>{garage?.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.text}>Contact Person: {garage?.contactPerson}</Text>
          <Text style={styles.text}>Email: {garage?.email}</Text>
          <Text style={styles.text}>Mobile: {garage?.mobile}</Text>
          <Text style={styles.text}>Address: {garage?.address}, {garage?.city.name}</Text>
          <Text style={styles.text}>Aadhar No: {garage?.aadharNo}</Text>
          <Text style={styles.text}>PAN No: {garage?.panNo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.text}>{garage?.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <Text style={styles.text}>{garage?.specialization}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          {garage?.serviceCategory.map(category => (
            <View key={category._id} style={styles.category}>
              <Image source={{ uri: category?.icon }} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{category?.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          {menuItems.reduce((rows, item, index) => {
            if (index % 2 === 0) {
              rows.push(
                <View key={index} style={styles.menuRow}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(item)}>
                    <Image source={item.icon} style={styles.menuItemIcon} />
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </TouchableOpacity>
                  {menuItems[index + 1] && (
                    <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(menuItems[index + 1])}>
                      <Image source={menuItems[index + 1].icon} style={styles.menuItemIcon} />
                      <Text style={styles.menuItemText}>{menuItems[index + 1].label}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }
            return rows;
          }, [])}
        </View>

        <View p={4} mt="auto" pt={0}>
          <View space={0} alignItems="center">
            <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
              v{appData?.version} | Made in India with ❤️
            </Text>
          </View>
        </View>


        <CustomButton
        btnStyle={{ borderRadius: 5, marginBottom: 10, marginTop: 0, marginLeft: 10, marginRight: 10 }}
        onPress={props.logout}
        // onPress={() => props.navigation.navigate('Mechanic')}
        isLoading={false}
        isLoadingText="Signing out...">
        Logout
      </CustomButton>

      </ScrollView>
      
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    marginTop: 0
    // justifyContent: 'center', // Center content vertically
    // alignItems: 'center', // Center content horizontally
  },
  header: {
    // alignItems: 'center',
    marginBottom: 20,
    // justifyContent:'space-between',
    flexDirection: 'row',
    gap: 50
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginLeft: 15,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    lineHeight: 15
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    fontWeight: '400'
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#007bff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: 'lightgrey'
  },
  menuItemIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: '#007bff',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 30
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
});

export default ProfilePage;