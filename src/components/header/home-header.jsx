import React, { useContext, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import Constants from "../../common/constant";
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/loginContext';
import { Box, Pressable, Menu, HStack } from 'native-base';

import { imageConstant } from '../../utils/constant';


let openLanguageModal = null;

const MainHeader = ({ onCityChange, onPress, showLanguageIcon = false, title, searchKeyword, props, navigation, showLikhiyeBtn = true, context }) => {

    const { selectedCity, setCityData, cities, token } = useAuth();
    const isDarkMode = false;
    const changeLangRef = useRef();
    // let { cart } = useContext(CartContext);

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName)
    };

    const [isLoading, setLanguageChangeLoader] = useState(false);
    const [selectedCityName, setSelectedCityName] = useState(selectedCity?.name);
    const [logo, setLogo] = useState({ logo: { data: require("../../assets/images/bikedoot.png") } });

    const [changeLanguageLoader, setChangeLanguageLoader] = useState(false);

    return (
        <View style={{ height: 60, width: '100%', flexDirection: 'row',backgroundColor:'#e6e5e5', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginLeft: -30 }}>
            <Image source={require("../../assets/images/bikedoot.png")} style={{ height: 40, width: 120, resizeMode: "contain" }} />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginLeft: -30,marginTop:-5 }}>
            <Image source={require("../../assets/images/bikedooTName.png")} style={{ height: 60, width: 120, resizeMode: "contain" }} />
        </TouchableOpacity>

        {/* <Text style={{color:'black'}}>BikedooT</Text> */}
    
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', marginRight: 30 }}>
            <Image source={imageConstant.pin} alt="" style={{ width: 25, height: 25 }} />
    
            <Menu w="190" trigger={triggerProps => {
                return (
                    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <HStack>
                            <Text style={{color:'black'}}>{selectedCityName}</Text>
                            <Icon type="FontAwesome5" name="angle-down" style={{ color: '#5349f8', fontSize: 20, paddingLeft: 5 }} />
                        </HStack>
                    </Pressable>
                );
            }}>
                {cities.map((data, index) => {
                    return (
                        <Menu.Item key={index} onPress={() => { setCityData(data); onCityChange(data._id) }}>
                            {data.name}
                        </Menu.Item>
                    );
                })}
            </Menu>
        </View>
    </View>
    
    );
}

export default React.memo(MainHeader);