import React, { useState, useEffect } from 'react';
import { Box, Text, ScrollView } from 'native-base';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import Header from '../../../components/header';
import MyCarousel from '../../../components/UI/image-carosel'
import ServiceCard from '../../../components/services/single-service';
import LoadingSpinner from '../../../components/UI/loading'
import { useAuth } from '../../../context/loginContext';
import TabsScreen from './tabs';
import CustomButton from './../../../components/UI/button'


const ServiceDetailPage = ({ navigation, route }) => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const { garageID, name, serviceType, title,distance } = route.params;

    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const [garageData, setGarageData] = useState([]);
    const [services, setServices] = useState([]);
    const [banners, setBanners] = useState([]);
    const [serviceCategory, setServiceCategory] = useState([]);
    const [allServices, setAllServices] = useState([])
    const [ratingData, setRatingData] = useState([]);


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGarageData();
        fetchGarageRatingData();
    }, []);

    const fetchGarageData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GURAGE_DEATIL_API + garageID, token)
            setLoading(false);
            // console.log('===============>',response?.data)

            if (response?.status) {
                setGarageData(response.data.garage)
                setBanners(response.data.banners);
                setServiceCategory(response.data.garage.serviceCategory)

                let services = response.data.services;
                setAllServices(services)
                for (let index = 0; index < services.length; index++) {
                    if (services[index].type === "Service") {
                        setServices(services[index].data)
                    }
                }
            } else {
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            setLoading(false);
            // show("Some error has occured!");
        }
    };
    const fetchGarageRatingData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GARAGE_RATING_LIST + garageID + '/rating', token)
            setLoading(false);
            // console.log('===============>',response?.data)
            if (response?.status) {
                setRatingData(response?.data)
            } else {
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            setLoading(false);
            // show("Some error has occured!");
        }
    };
    return (
        <Box p={0} mb={0} flex={1}>
            <Header title={name} navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? <LoadingSpinner /> : <Box p={2}>
                    <MyCarousel entries={banners} />
                    <Box p={0} mb={0} mt={5}>
                        <ServiceCard 
                        fromDetailPage={true} 
                        navigation={navigation}
                        serviceObj={{
                            name: garageData.name,
                            _id: garageData?._id,
                            specialization: garageData?.specialization,
                            serviceCategory: serviceCategory,
                            icon: garageData.icon,
                            avgRating: garageData?.avgRating,
                            distance:distance,
                            address:garageData?.address
                        }}
                        serviceType={serviceType} />
                    </Box>
                    <Box>
                        <TabsScreen about={garageData.about} services={allServices} rating={ratingData} direction={garageData} />
                    </Box>
                </Box>}
            </ScrollView>
            <CustomButton
            onPress={() => navigation.navigate('DateTimeSelectStep1', { garageID: garageData?._id, name: garageData.name, serviceType: serviceType, title:title })}
            btnStyle={{ margin: 5, borderRadius: 10 }}>
                    Book Now
            </CustomButton>
        </Box>
    );
};

export default ServiceDetailPage;
