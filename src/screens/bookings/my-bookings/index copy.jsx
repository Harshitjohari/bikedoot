// BookingList.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import FlatListContainer from '../../../components/flatlist';
import BookingCard from '../../../components/bookings/my-bookings/single-booking';
import Header from '../../../components/header';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { useAuth } from '../../../context/loginContext';
import TextHeader from '../../../components/UI/text-header'
import { useIsFocused } from '@react-navigation/native';

const BookingList = ({ horizontal = false, navigation }) => {

    const isFocused = useIsFocused();

    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [bookingFullData, setBookingFullData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (isFocused)
            fetchBookingsData();
    }, [isFocused]);

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const fetchBookingsData = async () => {
        try {
            setLoading(true);
            let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.GET_USER_BOOKINGS, token)
            console.log('token=======================>',token)
            if (response ?.status) {
                let fullData = response ?.data;
                setBookingFullData(fullData);
                let bookingData = []

                if (isHomePageComponent && fullData.length > 0) {
                    let index = 0;

                    bookingData.push({
                        "bookingId": fullData[index] ?.bookingId,
                        "bikeImage": fullData[index] ?.bike ?.brand ?.icon,
                        "bikeName": fullData[index] ?.bike ?.brand ?.name || "N/A",
                        "status": fullData[index] ?.status || "Confirmed",
                        "colorScheme": fullData[index] ?.status_color || "confirmed",
                        "date": formatDate(fullData[index] ?.date),
                        "time": fullData[index] ?.time,
                        "bookingAmount": fullData[index] ?.amount || 0,
                        "serviceType": fullData[index] ?.services[0] ?.service ?.service ?.name
                })
                }
                else {
                    for (let index = 0; index < fullData.length; index++) {
                        bookingData.push({
                            "bookingId": fullData[index] ?.bookingId,
                            "bikeImage": fullData[index] ?.bike ?.brand ?.icon,
                            "bikeName": fullData[index] ?.bike ?.brand ?.name || "N/A",
                            "status": fullData[index] ?.status || "Confirmed",
                            "colorScheme": fullData[index] ?.status_color || "confirmed",
                            "date": formatDate(fullData[index] ?.date),
                            "time": fullData[index] ?.time,
                            "bookingAmount": fullData[index] ?.amount || 0,
                            "serviceType": fullData[index] ?.services[0] ?.service ?.service ?.name
                    })
                    }
                }
                setBookings(bookingData);
                setLoading(false);
            } else {
                setLoading(false);
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            setLoading(false);
            // show("Some error has occured!");
        }
    };

    // const renderItem = ({ item }) => < item/>;
    const renderItem = ({ item }) => <BookingCard isHomePageComponent={isHomePageComponent} booking={item} />;

//     if (isHomePageComponent)
//         return (
//             bookings.length > 0 && <>
//                 {/* <TextHeader title="Active Bookingsssss" onPressSeeAll={() => navigation.navigate('Bookings')} /> */}
//                 <FlatListContainer
//                     horizontal={false}
//                     containerStyle={{ margin: 0 }}
//                     data={bookings}
//                     emptyMessage="No bookings found"
//                     isLoading={isLoading}
//                     renderItem={renderItem} // Pass the renderItem function as a prop
//                 />
//             </>
//         )
//     else
//         return (
//             <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
//                 <Header title="My Bookingsssss" navigation={navigation}/>
//                 <FlatListContainer
//                     horizontal={horizontal}
//                     containerStyle={{ margin: 10, marginBottom: 60 }}
//                     data={bookings}
//                     emptyMessage="No bookings found"
//                     isLoading={isLoading}
//                     renderItem={renderItem} // Pass the renderItem function as a prop
//                 />
//             </View>
//         );
// };

return (
    <View style={{ flex: 1, backgroundColor: "#edeeec" }}>
        <Header title="Bookings"/>
        <FlatListContainer
            horizontal={horizontal}
            containerStyle={{ margin: 10, marginBottom: 60 }}
            data={bookings}
            emptyMessage="No bookings found"
            isLoading={isLoading}
            renderItem={renderItem} // Pass the renderItem function as a prop
        />
    </View>
);
};

export default BookingList;
