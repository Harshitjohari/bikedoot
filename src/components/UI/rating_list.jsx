import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import Ratings from './rating'


const RatingList = ({ userName, value,userImage, review }) => {
  return (
    <View style={styles.ratingContainer}>
      <View style={styles.userContainer}>
      <Image source={{ uri: userImage }} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <Ratings rating={value ? value : 1} from={'tab'} />
        </View>
      </View>
      <Text style={styles.reviewText}>{review}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    width: width * 0.9, 
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  ratingNumber: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 16,
    marginLeft: 5, 
    width: '100%',
    alignSelf:'center',
    marginTop:5
  },
});

export default RatingList;