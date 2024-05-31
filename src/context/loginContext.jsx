import React, { createContext, useContext, useEffect, useState } from 'react';
import Storage from '../utils/async-storage'; // Import your Storage utility
import Constant from "../common/constant";
import Apis from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cities, setCities] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(null);


    const fetchCities = async (token) => {
        try {
            let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.GET_ALL_CITIES, token)
            if (response ?.status) {
                setCities(response ?.data);
                if (selectedCity === null) {
                    selectedCity(response.data[0]);
                }
                if (selectedCity === undefined) {
                    selectedCity(response.data[0]);
                }
                saveCityArrayInStorage(response ?.data)
            } else {
                // show(response ?.message || "Failed to send OTP, try again later");
            }
        } catch (e) {
            // show("Some error has occured!");
        }
    };

    useEffect(() => {
        // Load token and user data from storage on component mount
        loadUserDataFromStorage();
        loadCityDataFromStorage();

    }, []);

    const loadUserDataFromStorage = async () => {
        try {
            const storedToken = JSON.parse(await Storage.getDataFromStorage('userToken'));
            const storedUserData = JSON.parse(await Storage.getDataFromStorage('userData'));
            const selectedCity = JSON.parse(await Storage.getDataFromStorage('city'));
            const cityArray = JSON.parse(await Storage.getDataFromStorage('cityArray'));

            if (selectedCity) {
                setSelectedCity(selectedCity);
            }

            if (cityArray) {
                setCities(cityArray);
            }

            if (storedToken) {
                setToken(storedToken);
                fetchCities(storedToken);
            }
            if (storedUserData) {
                setUserData(storedUserData);
            }
        } catch (error) {
            console.error('Error loading user data from storage:', error);
        }
    };

    const loadCityDataFromStorage = async () => {
        try {
            const storedCity = JSON.parse(await Storage.getDataFromStorage('city'));
            const storedCityArray = JSON.parse(await Storage.getDataFromStorage('cityArray'));
            if (storedCity) {
                setSelectedCity(storedCity);
            }
            if (storedCity === null || storedCity === undefined) {
                setSelectedCity(storedCityArray[0])
            }

            if (storedCityArray) {
                setCities(storedCityArray);
            }
        } catch (error) {
            console.error('Error loading user data from storage:', error);
        }
    };

    const setAuthData = async (newToken, newUserData) => {
        try {
            setToken(newToken);
            setUserData(newUserData);
            await Storage.setDataInStorage('userToken', newToken);
            await Storage.setDataInStorage('userData', newUserData);

            let newUserDataTemp = JSON.parse(newUserData);
            let cityData = newUserDataTemp ?.city;
            setSelectedCity(cityData)
            setCityData(cityData)
            fetchCities(newToken)
            loadUserDataFromStorage()
        } catch (error) {
            console.error('Error setting user data to storage:', error);
        }
    };

    const saveCityArrayInStorage = async (cityArray) => {
        try {
            await Storage.setDataInStorage('cityArray', JSON.stringify(cityArray));
        } catch (error) {
            console.error('Error setting city data to storage:', error);
        }
    };

    const setCityData = async (selectedCityData) => {
        try {
            await Storage.setDataInStorage('city', JSON.stringify(selectedCityData));
            setSelectedCity(selectedCityData)
        } catch (error) {
            console.error('Error setting city data to storage:', error);
        }
    };

    const clearAuthData = async () => {
        try {
            // Clear token and user data from state and storage
            setToken(null);
            setUserData(null);
            await Storage.removeDataFromStorage('userToken');
            await Storage.removeDataFromStorage('userData');
            await Storage.removeDataFromStorage('city');
            await Storage.removeDataFromStorage('cityArray');
            await Storage.removeDataFromStorage('fcmToken');
            // setLoggedIn(false);
        } catch (error) {
            console.error('Error clearing user data from storage:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, userData, setAuthData, clearAuthData, selectedCity, setCityData, loadUserDataFromStorage, loadCityDataFromStorage, cities, fetchCities }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
