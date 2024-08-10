import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, IconButton, Divider, Button, Avatar } from 'native-base';
import { Pressable, Linking, Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Assuming you're using Expo
import CustomButton from '../../components/UI/button'
import Constant from '../../common/constant';
import { useAuth } from '../../context/loginContext';
import { checkVersion } from "react-native-check-version";
import Modal from "react-native-modal";

const ProfilePage = (props) => {
  const { userData } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [UpdateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [appData, setAppData] = useState({});


  useEffect(() => {
    checkAppVersion();
  }, []);

  const checkAppVersion = async () => {
    try {
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

  let menuItems = [
    { label: 'My Vehicles', icon: 'motorcycle', route: "MyVehicles", isRoute: true },
    { label: 'Saved Address', icon: 'bookmark', route: "SavedAddress", isRoute: true },
    { label: 'About Us', icon: 'info', route: Constant.ABOUT_US_URL, isRoute: false },
    { label: 'Terms & Conditions', icon: 'file-contract', route: Constant.TERMS_CONDITION_URL, isRoute: false },
    { label: 'Privacy Policy', icon: 'lock', route: Constant.PRIVACY_POLICY_URL, isRoute: false },
    { label: 'Help & Support', icon: 'whatsapp', route: `https://wa.me/916207627817?text=Hello BikedooT! My name is : ${userData?.name} and Registered Mobile No. is : ${userData?.mobile}. I need an assistance.`, isRoute: false }
  ];

  if (UpdateButtonVisible) {
    menuItems = [
      ...menuItems,
      { label: 'Update Available', icon: 'download', route: Constant.PRIVACY_POLICY_URL, isRoute: false }
    ];
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handlePress = () => {
    // Replace 'YOUR_TERMS_AND_CONDITIONS_URL' with the actual URL of your terms and conditions
    Linking.openURL('https://bikedoot.com/terms-of-use.php');
  };

  return (
    <ScrollView>
      {isModalVisible && (
        <Modal isVisible={isModalVisible}>
          <View style={{ height: 200 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10 }}>
              <Text fontWeight={500} fontSize={18} textAlign="center" mb={2} color={'black'}>Update Available.</Text>
              <Text fontWeight={400} fontSize={15} textAlign="center" mb={5} color={'black'}>There is an updated version available on the Play Store.Would you like to upgrade?</Text>
              <View flexDirection={'row'}
                justifyContent={'space-evenly'}
                p={3}
                marginTop={10}
                width={'100%'}>
                <TouchableOpacity
                  onPress={() => toggleModal()}
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

      <Box flex={1} p={0}>
        {/* Profile Card */}
        <Box height={180} bg="#5349f8" p={4} mb={4} borderBottomRadius="15px" shadow={0} style={{ position: "relative" }}>
          <Text fontSize="28px" fontWeight="700" color="#FFF">Settings</Text>
          <HStack space={2} style={{ position: "absolute", bottom: 15, left: 15 }}>
            <Box>
              <Image
                style={{
                  borderRadius: 50,
                  height: 60,
                  width: 60,
                  marginTop: 5,
                  resizeMode: 'contain'
                }}
                alt=""
                source={{
                  uri: userData?.profile ? userData?.profile : 'https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png',
                }}
              />
            </Box>
            <VStack space={0} justifyContent="center">
              <Text fontWeight="bold" fontSize={20} color="#FFF">
                {userData?.name}
              </Text>
              <Text color="#FFF" fontWeight={500} fontSize={13}>{userData?.email}</Text>
              <Text color="#FFF" fontWeight={500} fontSize={13}>{userData?.mobile}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Edit Profile Card */}
        <Box bg="#d6d8d9" p={4} ml={2} mr={2} borderRadius="md" borderWidth={1} borderColor="#c6c8ca">
          <Pressable onPress={() => props.navigation.navigate("Profile")}>
            <HStack space={4} alignItems="center">
              <Text flex={1} fontWeight="500" fontSize="bd_md" color="#1b1e21">
                Edit your Profile
              </Text>
              <FontAwesome5 name="chevron-right" size={20} color="#1b1e21" />
            </HStack>
          </Pressable>
        </Box>

        {/* Menu Card */}
        <Box bg="white" m={2} mt={4} mb={4} p={2} borderRadius="10px" shadow={0}>
          <VStack space={2}>
            {menuItems.map((menuItem, index) => (
              <Pressable
                onPress={() => {
                  if (menuItem.label === 'Update Available') {
                    setModalVisible(true);
                  } else if (menuItem.isRoute) {
                    props.navigation.navigate(menuItem.route);
                  } else {
                    Linking.openURL(menuItem.route);
                  }
                }}>
                <Box>
                  <HStack key={index} justifyContent="space-between" pt={2} pb={4}>
                    <HStack space={4} alignItems="center">
                      <FontAwesome5 name={menuItem.icon} size={20} color="black" />
                      <Text>{menuItem.label}</Text>
                    </HStack>
                    <FontAwesome5 name="chevron-right" size={20} color="#CCC" />
                  </HStack>
                  {(index + 1) === menuItems.length ? null : <Divider />}
                </Box>
              </Pressable>

            ))}
          </VStack>
        </Box>

        <Box m={2} mt={0} mb={3} p={2}>
          <CustomButton
            btnStyle={{ borderRadius: 5 }}
            onPress={props.logout}
            isLoading={false}
            isLoadingText="Signing out...">
            Logout
          </CustomButton>
        </Box>
        {/* App Version and Credits */}
        <Box p={4} mt="auto" pt={0}>
          <VStack space={0} alignItems="center">
            <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
              v{appData?.version} | Made in India with ❤️
            </Text>
          </VStack>
        </Box>
        <Box p={4} mt="auto" pt={0} >
          <VStack space={0} alignItems="center">
            <Text fontWeight="400" fontSize={10} lineHeight="16px" color="bd_sec_text">
              Copyrights ©2021-2024 BikedooT Service Private Limited. All rights reserved.
            </Text>
          </VStack>
        </Box>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 0,
    width: "100%"
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
    height: 600,
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

