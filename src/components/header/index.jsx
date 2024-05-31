import React from 'react';
import { Box,Button, Heading, IconButton, HStack, Pressable, Text, VStack } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../UI/button';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = (props) => {
  const { title, onLeftIconPress, showRightBtn = false, btnText = "Add", onBtnPressed,showLeftArrow=true } = props;
  const navigation = useNavigation();

  return (
    <Box safeAreaTop bg="white" px={4} py={4} mb={0}>

      {showLeftArrow && <Pressable onPress={() => navigation.goBack()}>
        <HStack  space={1} alignItems="center">
          <FontAwesome name="angle-left" color="#000" size={26} />
        </HStack>
  </Pressable> }
  <Pressable  onPress={() => navigation.goBack()}>
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

      </HStack>
      </Pressable>
    </Box>
  );
};

export default React.memo(Header);
