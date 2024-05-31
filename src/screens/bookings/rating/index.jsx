import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Header from '../../../components/header';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { useAuth } from '../../../context/loginContext';
import TextHeader from '../../../components/UI/text-header'
import { useIsFocused } from '@react-navigation/native';
import { imageConstant } from '../../../utils/constant';
import CustomButton from '../../../components/UI/button'
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { handleToast } from '../../../utils/toast';



let Height = Dimensions.get("window").height;
let Width = Dimensions.get("window").width;



const RatingScreen = (props) => {
  // console.log('iddd===============>', props?.route?.params)

  const { token } = useAuth();
  const { show, close, closeAll } = handleToast();

  const navigation = useNavigation()
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setLoading] = useState(true);


  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = async () => {
    try {
      setLoading(true);

      let data = {
        userRating: rating,
        userReview: comment
      }

      // console.log('dataaaaa===============+>',data)
      // return

      let response = await Apis.HttpPostRequest(
        Constant.BASE_URL + Constant.RATING + props?.route?.params + '/rating/add',
        token,
        data
      );
      // console.log('response?.status===============+>', props?.route?.params)

      if (response?.status) {
        show(response?.message, "success");
        navigation.navigate("MechanicBookingsDetails", { id: props?.route?.params })
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header title="RATING" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={Height / 2}
        extraScrollHeight={Height / 2}
        contentContainerStyle={{
          height: Height - 20,
        }}>
        <View style={{ flex: 1, alignItems: 'center', }}>

          <Image
            source={imageConstant.rating}
            style={{ width: 70, height: 70, marginBottom: 10, marginTop: 30 }}
            resizeMode="contain"
          />
          {/* <Text style={{ fontSize: 24, fontWeight: 'bold' }}>How would you rate the quality</Text>
<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>of this Services</Text> */}
          <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 40, marginBottom: -20, color: 'black' }}>How would you rate the customer</Text>
          <View
            style={{ marginTop: 0 }}>
            <AirbnbRating
              count={5}
              reviews={[]}
              defaultRating={rating}
              size={45}
              onFinishRating={handleRating}
              selectedColor={'#ffc008'}
            />
          </View>

          <Text style={{ marginTop: 20, color: 'black', fontSize: 15, fontWeight: '500' }}>Leave a your valuable comment</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, width: Width - 30, marginTop: 10 }}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={(text) => setComment(text)}
            placeholder={'Comment here.....'}
            placeholderTextColor={'grey'}
            color={'black'}
          />

          <View flexDirection={'row'}
            justifyContent={'space-evenly'}
            p={3}
            marginTop={30}
            width={'100%'}>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmitRating}
              style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>

          </View>

        </View>
      </KeyboardAwareScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#5349f8',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '43%',
    // marginTop: 40
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    // marginTop: 10,
    width: '43%',
    borderColor: '#5349f8',
    borderWidth: 1
  },
  cancelText: {
    color: '#5349f8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButton: {
    width: 25,
    height: 25,
  },
});

export default RatingScreen;