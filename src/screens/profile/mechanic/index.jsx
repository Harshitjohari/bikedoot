import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import CustomButton from '../../../components/UI/button'
import { useNavigation } from '@react-navigation/native';
import ImagePreviewModal from '../../../components/UI/image_view';
import { imageConstant } from '../../../utils/constant';
import { checkVersion } from "react-native-check-version";
import Modal from "react-native-modal";
import DeviceInfo from 'react-native-device-info';

const MechanicProfile = (props) => {

  const [mechanicData, setMechanicData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [appData, setAppData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [UpdateButtonVisible, setUpdateButtonVisible] = useState(false);

  useEffect(() => {
    fetchMechanicDetails();
    checkAppVersion();
  }, []);
  const navigation = useNavigation();

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setPreviewVisible(true);
  };

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


  const fetchMechanicDetails = async () => {
    try {
      setLoading(true);

      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.MECHANIC_PROFILE,
        token
      );

      if (response?.status) {

        const data = await response?.data;
        setMechanicData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleMenuItemPress = (item) => {    
    if (item.label === 'Update Available ') {
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
    { label: 'Help & Support     ', icon: imageConstant.helpSupport, route: `https://wa.me/916207627817?text=Hello BikedooT! My name is : ${mechanicData?.name} and Registered Mobile No. is : ${mechanicData?.mobile}. I need an assistance.`, isRoute: false }
  ];

  if (UpdateButtonVisible) {
    menuItems = [
      ...menuItems,
      { label: 'Update Available ', icon: imageConstant.update, route: '', isRoute: false }
    ];
  }


  if (!mechanicData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        
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

        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri:
                  mechanicData?.profile ||
                  'https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{mechanicData?.name}</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.text}>Mobile: {mechanicData?.mobile}</Text>
            <Text style={styles.text}>Aadhar No: {mechanicData?.aadharNo}</Text>
            <Text style={styles.text}>Pan No: {mechanicData?.panNo}</Text>
            <Text style={styles.text}>Experience: {mechanicData?.experience} years</Text>
          </View>

          <Text style={{
            marginTop: 15,
            fontSize: 16,
            marginBottom: 5,
            color: 'black',
            fontWeight: '600'
          }}>Documents:</Text>
          <View style={styles.imagesContainer}>
            <TouchableOpacity onPress={() => handleImageClick(mechanicData?.aadharFrontImage ||
              'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',)}>
              <Image source={{
                uri:
                  mechanicData?.aadharFrontImage ||
                  'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',
              }} style={styles.docsImage} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />

            <TouchableOpacity onPress={() => handleImageClick(mechanicData?.aadharBackImage ||
              'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',)}>
              <Image source={{
                uri:
                  mechanicData?.aadharBackImage ||
                  'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',
              }} style={styles.docsImage} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />

            <TouchableOpacity onPress={() => handleImageClick(mechanicData?.panImage ||
              'https://cdn.pixabay.com/photo/2022/11/09/00/45/pan-card-7579594_1280.png',)}>
              <Image source={{
                uri:
                  mechanicData?.panImage ||
                  'https://cdn.pixabay.com/photo/2022/11/09/00/45/pan-card-7579594_1280.png',
              }} style={styles.docsImage} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />
          </View>

          <Text style={styles.header}>Specialist in Bikes:</Text>
          {mechanicData?.specialistBike.map(bike => (
            <View key={bike?._id} style={styles.bikeContainer}>
              <Image source={{ uri: bike?.icon }} style={styles.bikeIcon} />
              <Text style={styles.text}>
                {bike?.brand?.name} - {bike?.name}
              </Text>
              <Text style={styles.text}>CC: {bike?.cc?.name}</Text>
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
          btnStyle={{ borderRadius: 5, marginBottom: 10, marginLeft: 10, marginRight: 10, marginTop: 10 }}
          onPress={props.logout}
          isLoading={false}
          isLoadingText="Signing out...">
          Logout
        </CustomButton>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
    backgroundColor: '#edeeec'
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginLeft: 15,
    resizeMode: 'contain'
  },
  docsImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
    fontWeight: '400'
  },
  header: {
    fontSize: 16,
    fontWeight: '500',
    // marginTop: 10,
    marginBottom: 15,
    color: 'black'
  },
  bikeContainer: {
    alignItems: 'center',
    marginBottom: 5
  },
  bikeIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Set your background color
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    gap: 20
  },
  // profileImage: {
  //   width: 150,
  //   height: 150,
  //   borderRadius: 75,
  //   marginBottom: 10,
  // },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  // docsImage: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 10,
  // },
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




export default MechanicProfile;