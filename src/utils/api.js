
const Apis = {

    async HttpGetRequestWithCancellation(link, controller = {}, contentLang = SELECTED_APP_LANGUAGE) {
        let fetchOptionalArgument = {
            method: 'GET',
            headers: {
                'device': 'android-mob',
                'contentLanguage': contentLang
            },
            signal: controller.signal
        };
        try {
            let response = await fetch(link, fetchOptionalArgument);
            return await response.json();
        } catch (error) {
            if (controller.signal.aborted)
                console.log('Request canceled:', error.message);
            return error;
        }
    },

    async HttpGetRequest(link, token, controller = {}) {
        let fetchOptionalArgument = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                // Accept: 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'token': token
            },
            // signal: controller.signal
        };
        try {
            let response = await fetch(link, fetchOptionalArgument);
            return await response.json();
        } catch (error) {
            // if (controller.signal.aborted)
            //     console.log('Request canceled:', error.message);
            return error;
        }
    },

    async HttpPostRequest(link,token, dataObj) {
        try {
            let response = await
                fetch(link, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      
                        'token': token
                    },
                    body: JSON.stringify(dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    },



    async HttpPutRequest(link, token, dataObj) {
        try {
            let response = await
                fetch(link, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify(dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    },


    async HttpDeleteRequest(link, token, dataObj = {}) {
        try {
            let response = await
                fetch(link, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify(dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    async HttpPostRequestImageUpload(link, dataObj) {
        try {
            let response = await
                fetch(link, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'device': 'android-mob',
                        'contentLanguage': SELECTED_APP_LANGUAGE
                    },
                    body: (dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    async HttpPostRequestForLogin(link, dataObj) {
        try {
            let response = await
                fetch(link, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    }

};

export default Apis;
