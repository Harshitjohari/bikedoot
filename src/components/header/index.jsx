import React, { useContext, useRef, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Box, Button, Heading, IconButton, HStack, Pressable, Text, VStack, Menu } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../UI/button';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = (props) => {
  const { title, onLeftIconPress, showRightBtn = false, btnText = "Add", onBtnPressed, showLeftArrow = true, showRadiusBtn,onRadiusChange } = props;
  const navigation = useNavigation();
  const [defaultValue, setDefaultValue] = useState('All');

  // useEffect(() => {
  //   if (showRadiusBtn) {
  //     // console.log('=======+HERE+=============',defaultValue)
  //     onRadiusChange('All');
  //   }
  // }, []);

  let kmData= [
    '5','10','25','50','All'
  ]


  return (
    <Box safeAreaTop bg="white" px={4} py={4} mb={0}>

      {showLeftArrow && <Pressable onPress={() => navigation.goBack()}>
        <HStack space={1} alignItems="center">
          <FontAwesome name="angle-left" color="#000" size={26} />
        </HStack>
      </Pressable>}
      <Pressable onPress={() => navigation.goBack()}>
        <HStack space={2} alignItems="center" mt={-5}>

          <Heading color="black" fontSize="lg" flex={1} textAlign="center">
            {title}
          </Heading>


          {/* Add button */}
          {showRightBtn && <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={onBtnPressed}>
            <Box
              px={2}
              py={1}
              bg="#5349f8"
              borderRadius={15}
              justifyContent="center"
              alignItems="center"
              pl={3}
              pr={3}
            >
              <Text color="#FFF" fontSize="bd_xsm" fontWeight="700">
                {btnText}
              </Text>
            </Box>
          </TouchableOpacity>}

          {showRadiusBtn && <TouchableOpacity style={{ position: 'absolute', right: 0 }} onPress={onBtnPressed}>
            <Box
              px={2}
              // py={1}
              // bg="#5349f8"
              // borderRadius={15}
              justifyContent="center"
              alignItems="center"
            // pl={3}
            // pr={3}
            >
              <Text color="#5349f8" fontSize="bd_sm" fontWeight="700">
                Radius(km)
              </Text>

              <Menu w="150" trigger={triggerProps => {
                return (
                  <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <HStack>
                      <Text style={{ color: 'black',  }}>{defaultValue}</Text>
                      <Icon type="FontAwesome5" name="angle-down" style={{ color: '#5349f8', fontSize: 20, paddingLeft: 5 }} />
                    </HStack>
                  </Pressable>
                );
              }}>
                {kmData.map((data, index) => {
                    return (
                        <Menu.Item  justifyContent={'center'} alignItems={'center'} key={index} onPress={() => { setDefaultValue(data); onRadiusChange(data) }}>
                           { data === 'All' ? data : `Within ${data} km`}
                        </Menu.Item>
                    );
                })}
              </Menu>
            </Box>
          </TouchableOpacity>}

        </HStack>
      </Pressable>
    </Box>
  );
};

export default React.memo(Header);
