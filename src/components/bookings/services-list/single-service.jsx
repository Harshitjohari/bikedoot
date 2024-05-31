// Updated AddServiceCard.js
import React, { useState } from 'react';
import { Box, Image, Text, HStack, IconButton, Divider, Pressable } from 'native-base';
import BadgeComponent from '../../UI/badges'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from '../../UI/button'

const AddServiceCard = ({ showAddRemoveButtonBox = true, booking, onPress, showRemoveBtn = false, itemRemovedBtnPressed }) => {

    const remove = () => {
       
        if (showRemoveBtn){
         console.log("fdgdfg")
            itemRemovedBtnPressed()
        }
    }

    const [isExpanded, setIsExpanded] = useState(false);
    const {
        name, description, price,
        is_selected
    } = booking;

    return (
        <Box
            width="100%"
            borderRadius="10px"
            mb={2}
            borderWidth={1}
            borderColor={"#e6e6e8"}
            shadow={0}>

            <Box
                width="100%"
                bg={is_selected ? "#cfdfcd" : "#FFF"}
                borderRadius="10px"
                borderBottomRadius="0px"
                p={3}

                pb={0}>

                {/* First Row */}
                <HStack space={4}>
                    <Box flex={2}>
                        <Text fontWeight="500" fontSize="bd_sm" mb={0} lineHeight="20px" color="bd_dark_text">
                            {name}
                        </Text>
                        <HStack space={1} alignItems="center" mt={1} mb={2}>
                            <FontAwesome5 color="#000" name="rupee-sign" size={14} />
                            <Text fontWeight="600" fontSize="bd_sm">{price}</Text>
                        </HStack>
                    </Box>

                    {showAddRemoveButtonBox ? !is_selected ? <Box flex={2} alignItems="flex-end">
                        <Button onPress={onPress} p={0} mt={0} textStyle={{ fontSize: 12, fontWeight: "500" }} btnStyle={{ height: 30, padding: 0, width: "40%" }}>Add</Button>
                    </Box> :
                        <Box flex={2} alignItems="flex-end">
                            <Button p={0} onPress={remove} mt={0} textStyle={{ fontSize: 12, fontWeight: "500" }} btnStyle={{ height: 30, padding: 0, borderRadius: 5, width: "40%", backgroundColor: showRemoveBtn ? "#C70000" : "#0da687" }}>{showRemoveBtn ? "Remove" : "Added"}</Button>
                        </Box>
                        : null}
                </HStack>
            </Box>

            <Pressable onPress={() => setIsExpanded((prevExpanded) => !prevExpanded)}>
                <Box
                    width="100%"
                    bg="#F1F0FE"
                    borderRadius="10px"
                    borderTopRadius="0px"
                    p={2}
                    pr={4}>

                    <HStack space={2}>
                        <Box flex={4} pr={1}>
                            <HStack space={1} mr={1}>
                                <Text numberOfLines={isExpanded ? undefined : 2} fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                                    {description}
                                </Text>
                                <FontAwesome5 name={isExpanded ? "chevron-up" : "chevron-down"} color="#000" size={14} style={{ alignItems: "flex-end", alignSelf: "center", paddingRight: 5 }} />
                            </HStack>
                        </Box>
                    </HStack>
                </Box>
            </Pressable>
        </Box>

    );
};

export default AddServiceCard;
