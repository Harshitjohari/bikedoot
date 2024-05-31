import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import FlatListContainer from '../../components/flatlist';
import ServiceCard from '../../components/services/single-service';
import Header from '../../components/header';
import Apis from '../../utils/api'
import Constant from '../../common/constant';
import { useAuth } from '../../context/loginContext';

const ServiesList = ({ navigation, route }) => {
    const {garageID} = route.params;
    const { token,selectedCity,userData } = useAuth();
    const {_id} = selectedCity;
    const cityID = _id;
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchGarageData();
    }, []);

    const fetchGarageData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_DATA + cityID + "/garage/" + garageID, token)
            setLoading(false);
            if (response ?.status) {
                setServices(response ?.data);
            } else {
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            setLoading(false);
            // show("Some error has occured!");
        }
    };

    const renderItem = ({ item }) => <ServiceCard navigation={navigation} serviceObj={item} />;

    return (
        <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
            <Header title="Garage List" navigation={navigation} />
            <FlatListContainer
                containerStyle={{ margin: 10 ,marginBottom:60}}
                data={services}
                isLoading={loading}
                renderItem={renderItem} // Pass the renderItem function as a prop
            />
        </View>
    );
};

export default ServiesList;
