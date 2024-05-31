import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'native-base';
const { height } = Dimensions.get('window')
import EmptyIcon from '../../assets/images/empty.png'
import CustomButton from '../UI/button';

const EmptyState = ({ message, showBtn = false, onPress, btnText = "Home" }) => {
    return (
        <View style={styles.container}>
            <Image source={EmptyIcon} style={styles.image} />
            <Text fontWeight="500" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
                {message}
            </Text>
            {showBtn && <CustomButton btnStyle={{ height: 40, marginTop: 10 }} textStyle={{ fontSize: 14 }} onPress={onPress}>{btnText}</CustomButton>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: height - 150
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});

export default EmptyState;
