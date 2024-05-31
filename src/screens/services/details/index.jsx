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

const ServiceDetailPage = ({ navigation, route }) => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const { garageID, name } = route.params;

    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const [garageData, setGarageData] = useState([]);
    const [services, setServices] = useState([]);
    const [banners, setBanners] = useState([]);
    const [serviceCategory, setServiceCategory] = useState([]);
    const [allServices,setAllServices] =  useState([])

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGarageData();
    }, []);

    const fetchGarageData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GURAGE_DEATIL_API + garageID, token)
            setLoading(false);
            if (response ?.status) {
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
    return (
        <Box p={0} mb={10}>
            <Header title={name} navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? <LoadingSpinner /> : <Box p={2}>
                    <MyCarousel entries={banners} />
                    <Box p={0} mb={0} mt={5}>
                        <ServiceCard fromDetailPage={true} navigation={navigation} serviceObj={{
                            name: garageData.name,
                            _id: garageData?._id,
                            specialization: garageData?.specialization,
                            serviceCategory: serviceCategory,
                            icon: garageData.icon
                        }} />
                    </Box>
                    <Box>
                        <TabsScreen about={garageData.about} services={allServices}/>
                    </Box>
                </Box>}
            </ScrollView>
        </Box>
    );
};

export default ServiceDetailPage;
