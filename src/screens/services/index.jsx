import React, { useState, useEffect } from 'react';
import { View,Alert} from 'react-native';
import FlatListContainer from '../../components/flatlist';
import ServiceCard from '../../components/services/single-service';
import Header from '../../components/header';
import Apis from '../../utils/api'
import Constant from '../../common/constant';
import { useAuth } from '../../context/loginContext';
import Geolocation from '@react-native-community/geolocation';


const ServiesList = ({ navigation, route }) => {
    const {garageID, title, loc} = route.params;
    const { token,selectedCity,userData, location } = useAuth();
    const {_id} = selectedCity;
    const cityID = _id;
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [latitude, setlatitude] = useState(null);
    const [longitude, setlongitude] = useState(null);
    const [radius, setRadius] = useState(0);


    useEffect(() => {
            fetchGarageData();
    }, [radius]);

    const fetchGarageData = async () => {
        try {
            setLoading(true);
            let data = {
                "latitude":loc.latitude,
                "longitude":loc.longitude,
                "radius": radius === 'All' ? 0 : parseInt(radius)
            }
            // console.log('=======>',data)
            let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.GARAGE_DATA + cityID + "/garage/" + garageID, token, data)

            setLoading(false);
            if (response ?.status) {
                setServices(response ?.data);
            } else {
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            setLoading(false);
            console.log('error=========>',e)
            // show("Some error has occured!");
        }
    };
    const renderItem = ({ item }) => <ServiceCard navigation={navigation} serviceObj={item} serviceType={garageID} title={title} />;

    return (
        <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
            <Header title="Garage List" navigation={navigation} showRadiusBtn={true} onRadiusChange={(radius) => {setRadius(radius); }} />
            <FlatListContainer
                containerStyle={{ margin: 10 ,marginBottom:60}}
                data={services}
                isLoading={loading}
                renderItem={renderItem}
            />
        </View>
    );
};

export default ServiesList;
