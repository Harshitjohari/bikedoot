import React, { useContext, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import Constants from "../../common/constant";
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/loginContext';
import { Box, Pressable, Menu, HStack } from 'native-base';

let openLanguageModal = null;

const MainHeader = ({ onCityChange, onPress, showLanguageIcon = false, title, searchKeyword, props, navigation, showLikhiyeBtn = true, context }) => {

    const { selectedCity, setCityData, cities,token } = useAuth();
    const isDarkMode = false;
    const changeLangRef = useRef();
    // let { cart } = useContext(CartContext);

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName)
    };

    const [isLoading, setLanguageChangeLoader] = useState(false);
    const [selectedCityName, setSelectedCityName] = useState(selectedCity ?.name);
    const [logo, setLogo] = useState({ logo: { data: require("../../assets/images/bikedoot.png") } });

    const [changeLanguageLoader, setChangeLanguageLoader] = useState(false);

    return (
        <View style={{ height: 60, width: '100%' }}>
            {/* {changeLanguageModal()} */}
            <View style={{
                backgroundColor: '#534AF9',
                elevation: 0,
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: 0,
                paddingRight: 0,
                height: 60
            }}>
                <View>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', marginLeft: 0 }}>
                        <Image source={require("../../assets/images/bikedoot.png")} style={{ height: 40, width: 120, resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>

                <Box w="90%" alignItems="center">
                    <Menu w="190" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <HStack>
                                <Text>{selectedCityName}</Text>
                                <Icon type="FontAwesome5" name="angle-down"
                                    style={{ color: '#5349f8', fontSize: 20, paddingLeft: 5 }} />
                            </HStack>
                        </Pressable>
                    }}>
                        {cities.map((data, index) => {
                            return (<Menu.Item onPress={()=> {setCityData(data);onCityChange(data._id)}}>{data.name}</Menu.Item>)
                        })
                        }
                    </Menu>
                </Box>
            </View>
        </View >
    );
}

export default React.memo(MainHeader);