// MechanicList.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button, TouchableOpacity, ImageBackground } from 'react-native';
import Apis from '../../utils/api';
import FlatListContainer from '../../components/flatlist';
import Constant from '../../common/constant';
import { useAuth } from '../../context/loginContext';
import Header from '../../components/header';
import { useIsFocused } from '@react-navigation/native';

import { imageConstant } from '../../utils/constant';
import ImagePreviewModal  from '../../components/UI/image_view';
import CustomButton from '../../components/UI/button'


const MechanicList = (props) => {
  const {navigation,route} = props;

  const isFocused = useIsFocused();
  const { token } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [mechanic, setMechanic] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    if (isFocused) {
      fetchMechanicData();
    }
  }, [isFocused]);

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setPreviewVisible(true);
  };

  const fetchMechanicData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.GET_MECHANICS,
        token
      );

      if (response?.status) {
        let fullData = response?.data;
        const mechanicData = fullData.map((item) => ({
          _id: item?._id,
          name: item?.name,
          mobileNumber: item?.mobile,
          experience: item?.experience,
          specialistBike: Array.isArray(item?.specialistBike)
            ? item.specialistBike.map(bike => bike.name).join(', ')
            : '',
          profile: item?.profile ||
            'https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg',
        }));
        setMechanic(mechanicData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row' }}>

      <TouchableOpacity onPress={() => handleImageClick(item.profile)}>
        <Image source={{ uri: item.profile}} style={styles.profileImage} />
      </TouchableOpacity>
      <ImagePreviewModal
        visible={previewVisible}
        imageUrl={selectedImageUrl}
        onClose={handleClosePreview}
      />

        {/* <Image style={styles.profileImage} source={{ uri: item.profile }} /> */}
  
        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.info}>Mobile Number: {item.mobileNumber}</Text>
          <Text style={styles.info}>Experience: {item.experience}</Text>
          <Text style={styles.info}>Specialist Bike: {item.specialistBike.length > 0 ? item.specialistBike : 'No bike selected'}</Text>
        </View>
      </View>
  
      <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row' }}>
      <TouchableOpacity onPress={() =>  props.navigation.navigate('MechanicDetails',{id : item._id})}>
        <Image source={imageConstant.view} style={{ width: 20, height: 20, marginRight: 10 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() =>  props.navigation.navigate('MechanicEdit',{id : item._id})}>
        <Image source={imageConstant.edit} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>
    </View>

    </View>
  );
  

  return (
    <View style={{ flex: 1, backgroundColor: '#edeeec' }}>
    <Header title="Mechanic List" />

    {/* FlatListContainer */}
    <View style={{ flex: 1 }}>
      <FlatListContainer
        horizontal={false}
        containerStyle={{ margin: 10, marginBottom: 0 }}
        data={mechanic}
        emptyMessage="No data found"
        isLoading={isLoading}
        renderItem={renderItem}
      />
    </View>

    {/* Floating Add Button */}
    <View style={styles.addButton}>
      {/* <Button
        title="Add New"
        color = 'blue'
        onPress={() => props.navigation.navigate('MechanicAdd')}
      /> */}
      <TouchableOpacity  onPress={() => props.navigation.navigate('MechanicAdd')}>
        <Image
          source={imageConstant.add}
          style={styles.circularImage}
        />
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  info: {
    fontSize: 12,
    marginBottom: 4,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 100,  
    height: 50, 
    // borderRadius: 25,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, 
    width: 50, 
    height: 50, 
    marginLeft : 10
  },
  circularImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 50, 
  },
});


export default MechanicList;