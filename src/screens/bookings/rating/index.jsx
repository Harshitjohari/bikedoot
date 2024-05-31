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
  // console.log('===============>', props?.route?.params?.booking?._id)

  const navigation = useNavigation()
  const { token } = useAuth();
  const { show, close, closeAll } = handleToast();
  const [ratingGarage, setRatingGarage] = useState(0);
  const [ratingMechanic, setRatingMechanic] = useState(0);
  const [ratingBikeDoot, setRatingBikeDoot] = useState(0);
  const [commentGarage, setCommentGarage] = useState('');
  const [commentMechanic, setCommentMechanic] = useState('');
  const [commentBikeDoot, setCommentBikeDoot] = useState('');
  const [isLoading, setLoading] = useState(true);

  const handleRatingGarage = (newRating) => {
    setRatingGarage(newRating);
  };
  const handleRatingMechanic = (newRating) => {
    setRatingMechanic(newRating);
  };
  const handleRatingBikedoot = (newRating) => {
    setRatingBikeDoot(newRating);
  };

  const handleSubmitRating = async () => {
    try {
      setLoading(true);

      let data = {
          garageRating: ratingGarage,
          garageReview: commentGarage,
          mechanicsRating: ratingMechanic,
          mechanicsReview: commentMechanic,
          bikedootRating: ratingBikeDoot,
          bikedootReview: commentBikeDoot
        }

      let response = await Apis.HttpPostRequest(
        Constant.BASE_URL + Constant.RATING + props?.route?.params?.booking?._id + '/rating/add',
        token,
        data
      );

      if (response?.status) {
        show(response ?.message, "success");
        navigation.navigate("BookingsScreenDetail", { id: props?.route?.params?.booking?._id })
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
        <View style={{ alignItems: 'center', }}>

          <Image
            source={imageConstant.rating}
            style={{ width: 70, height: 70, marginTop: 10 }}
            resizeMode="contain"
          />

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: 'black' }}>How would you rate the</Text>

          <Text style={{ marginTop: 10, marginBottom: -50, color: 'black', fontSize: 15, fontWeight: '500' }}>{props?.route?.params?.booking?.mechanics?.garage?.name}</Text>

          <AirbnbRating
            count={5}
            reviews={[]}
            defaultRating={ratingGarage}
            size={25}
            onFinishRating={handleRatingGarage}
            selectedColor={'#ffc008'}
          />
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, height: 90, width: Width - 30, marginTop: 10 }}
            multiline
            numberOfLines={4}
            value={commentGarage}
            onChangeText={(text) => setCommentGarage(text)}
            placeholder={'Comment here.....'}
            placeholderTextColor={'grey'}
            color={'black'}
          />

          <Text style={{ marginTop: 10, marginBottom: -50, color: 'black', fontSize: 15, fontWeight: '500' }}>Mechanic</Text>

          <AirbnbRating
            count={5}
            reviews={[]}
            defaultRating={ratingMechanic}
            size={25}
            onFinishRating={handleRatingMechanic}
            selectedColor={'#ffc008'}
          />
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, height: 90, width: Width - 30, marginTop: 10 }}
            multiline
            numberOfLines={4}
            value={commentMechanic}
            onChangeText={(text) => setCommentMechanic(text)}
            placeholder={'Comment here.....'}
            placeholderTextColor={'grey'}
            color={'black'}
          />

          <Text style={{ marginTop: 10, marginBottom: -50, color: 'black', fontSize: 15, fontWeight: '500' }}>BikedooT</Text>

          <AirbnbRating
            count={5}
            reviews={[]}
            defaultRating={ratingBikeDoot}
            size={25}
            onFinishRating={handleRatingBikedoot}
            selectedColor={'#ffc008'}
          />
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, height: 90, width: Width - 30, marginTop: 10 }}
            multiline
            numberOfLines={4}
            value={commentBikeDoot}
            onChangeText={(text) => setCommentBikeDoot(text)}
            placeholder={'Comment here.....'}
            placeholderTextColor={'grey'}
            color={'black'}
          />

          <View flexDirection={'row'}
            justifyContent={'space-evenly'}
            p={3}
            marginTop={40}
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