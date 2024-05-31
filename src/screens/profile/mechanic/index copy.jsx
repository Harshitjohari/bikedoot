import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Constant from '../../../common/constant';
import Apis from '../../../utils/api';
import Header from '../../../components/header';
import { useAuth } from '../../../context/loginContext';
import CustomButton from '../../../components/UI/button'
import { useNavigation } from '@react-navigation/native';
import ImagePreviewModal from '../../../components/UI/image_view';


const MechanicProfile = (props) => {

  const [mechanicData, setMechanicData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);


  useEffect(() => {
    fetchMechanicDetails();
  }, []);
  const navigation = useNavigation();

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setPreviewVisible(true);
  };


  const { loadUserDataFromStorage, clearAuthData } = useAuth();


  const fetchMechanicDetails = async () => {
    try {
      setLoading(true);

      let response = await Apis.HttpGetRequest(
        Constant.BASE_URL + Constant.MECHANIC_PROFILE,
        token
      );

      if (response?.status) {

        const data = await response?.data;
        setMechanicData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };


  if (!mechanicData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri:
                  mechanicData?.profile ||
                  'https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{mechanicData?.name}</Text>
            <Text style={styles.text}>Mobile: {mechanicData?.mobile}</Text>
            <Text style={styles.text}>Aadhar No: {mechanicData?.aadharNo}</Text>
            <Text style={styles.text}>Pan No: {mechanicData?.panNo}</Text>
            <Text style={styles.text}>Experience: {mechanicData?.experience} years</Text>
          </View>

          <View style={styles.imagesContainer}>
            <TouchableOpacity onPress={() => handleImageClick(mechanicData?.aadharFrontImage ||
              'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',)}>
              <Image source={{
                uri:
                  mechanicData?.aadharFrontImage ||
                  'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',
              }} style={styles.docsImage} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />

            <TouchableOpacity onPress={() => handleImageClick(mechanicData?.aadharBackImage ||
              'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',)}>
              <Image source={{
                uri:
                  mechanicData?.aadharBackImage ||
                  'https://etvbharatimages.akamaized.net/etvbharat/prod-images/22-07-2023/640-480-19065540-thumbnail-16x9-aadhar-aspera.jpg',
              }} style={styles.docsImage} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />

            <TouchableOpacity onPress={() => handleImageClick(mechanicData?.panImage ||
              'https://cdn.pixabay.com/photo/2022/11/09/00/45/pan-card-7579594_1280.png',)}>
              <Image source={{
                uri:
                  mechanicData?.panImage ||
                  'https://cdn.pixabay.com/photo/2022/11/09/00/45/pan-card-7579594_1280.png',
              }} style={styles.docsImage} />
            </TouchableOpacity>
            <ImagePreviewModal
              visible={previewVisible}
              imageUrl={selectedImageUrl}
              onClose={handleClosePreview}
            />
          </View>

          <Text style={styles.header}>Specialist in Bikes:</Text>
          {mechanicData?.specialistBike.map(bike => (
            <View key={bike?._id} style={styles.bikeContainer}>
              <Image source={{ uri: bike?.icon }} style={styles.bikeIcon} />
              <Text style={styles.text}>
                {bike?.brand?.name} - {bike?.name}
              </Text>
              <Text style={styles.text}>CC: {bike?.cc?.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomButton
        btnStyle={{ borderRadius: 5, marginBottom: 10, marginLeft: 10, marginRight: 10, }}
        onPress={props.logout}
        isLoading={false}
        isLoadingText="Signing out...">
        Logout
      </CustomButton>


    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
    backgroundColor: '#edeeec'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  docsImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginTop: 10,
    marginBottom: 15,
    color: 'black'
  },
  bikeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bikeIcon: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Set your background color
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  // profileImage: {
  //   width: 150,
  //   height: 150,
  //   borderRadius: 75,
  //   marginBottom: 10,
  // },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  // docsImage: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 10,
  // },
});




export default MechanicProfile;