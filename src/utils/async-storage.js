import AsyncStorage from '@react-native-async-storage/async-storage'

const Storage = {

    async setDataInStorage(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            return false;
        }
    },

    async getDataFromStorage(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    async removeDataFromStorage(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            return false;
        }
    },

    async removeAllDataFromStorage() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            return false;
        }
    }
};

export default Storage;