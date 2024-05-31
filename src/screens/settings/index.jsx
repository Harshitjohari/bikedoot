import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, VStack, IconButton, Divider, Button, Avatar } from 'native-base';
import { Pressable, Linking ,Image} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Assuming you're using Expo
import CustomButton from '../../components/UI/button'
import Constant from '../../common/constant';
import { useAuth } from '../../context/loginContext';
import Apis from '../../utils/api'


const ProfilePage = (props) => {
  const { token, userData } = useAuth();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const [details, setDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_PROFILE, token)
      // console.log('123============>',response?.data)
      setLoading(false);
      if (response ?.status) {
        setDetails(response?.data);
      } else {
        // show(response ?.message || "Failed to send OTP, try again later");
      }
    } catch (e) {
      setLoading(false);
      // show("Some error has occured!");
    }
  };


  const menuItems = [
    { label: 'About Us', icon: 'info', route: Constant.ABOUT_US_URL, isRoute: false },
    { label: 'Terms & Conditions', icon: 'file-contract', route: Constant.TERMS_CONDITION_URL, isRoute: false },
    { label: 'Privacy Policy', icon: 'lock', route: Constant.PRIVACY_POLICY_URL, isRoute: false },
    { label: 'Help & Support', icon: 'whatsapp', route: `https://wa.me/916207627817?text=Hello BikedooT! My name is : ${userData?.name} and Registered Mobile No. is : ${userData?.mobile}. I need an assistance.`, isRoute: false }
  ];

  const handlePress = () => {
    // Replace 'YOUR_TERMS_AND_CONDITIONS_URL' with the actual URL of your terms and conditions
    Linking.openURL('https://bikedoot.com/terms-of-use.php');
  };

  return (
    <Box flex={1} p={0}>
      {/* Profile Card */}
      <Box height={180} bg="#5349f8" p={4} mb={4} borderBottomRadius="15px" shadow={0} style={{ position: "relative" }}>
        <Text fontSize="28px" fontWeight="700" color="#FFF">Settings</Text>
        <HStack space={2} style={{ position: "absolute", bottom: 15, left: 15 }}>
          <Box>
            <Image
             style={{
                borderRadius: 50,
                height:60,
                width:60,
                marginTop:5,
                resizeMode:'contain'
              }}
              alt="" 
              source={{
                uri: details?.garage?.icon ? details?.garage?.icon :'https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png',
              }}
            />
          </Box>
          <VStack space={0} justifyContent="center">
            <Text fontWeight="bold" fontSize={20} color="#FFF">
              {details?.name}
            </Text>
            <Text color="#FFF" fontWeight={500} fontSize={13}>{details?.email}</Text>
            <Text color="#FFF" fontWeight={500} fontSize={13}>{details?.mobile}</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Edit Profile Card */}
      {/* <Box bg="#d6d8d9" p={4} ml={2} mr={2} borderRadius="md" borderWidth={1} borderColor="#c6c8ca">
        <Pressable onPress={() => props.navigation.navigate("Profile")}>
          <HStack space={4} alignItems="center">
            <Text flex={1} fontWeight="500" fontSize="bd_md" color="#1b1e21">
              Edit your Profile
            </Text>
            <FontAwesome5 name="chevron-right" size={20} color="#1b1e21" />
          </HStack>
        </Pressable>
      </Box> */}

      {/* Menu Card */}
      <Box bg="white" m={2} mt={4} mb={4} p={2} borderRadius="10px" shadow={0}>
        <VStack space={2}>
          {menuItems.map((menuItem, index) => (
            <Pressable onPress={() => { menuItem.isRoute ? props.navigation.navigate(menuItem.route) : Linking.openURL(menuItem.route) }}>
              <Box>
                <HStack key={index} justifyContent="space-between" pt={2} pb={4}>
                  <HStack space={4} alignItems="center">
                    <FontAwesome5 name={menuItem.icon} size={20} color="black" />
                    <Text>{menuItem.label}</Text>
                  </HStack>
                  {/* <FontAwesome5 name="chevron-right" size={20} color="#CCC" /> */}
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
            v1.0.1 | Made in India with ❤️
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
  );
};

export default ProfilePage;

