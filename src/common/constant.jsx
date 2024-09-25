const Constants = {
    BASE_URL: "http://bikedoot-backend-1645567596.eu-north-1.elb.amazonaws.com",
    // BASE_URL : "https://nodeapi.bikedoot.com",
    // BASE_URL: "http://16.16.246.10",
    // BASE_URL: "http://10.0.2.2:3005",

    AUTH: {
        OTP_REQUEST: "/auth/login/admin/otp/send",
        OTP_VERIFY: "/auth/login/admin/otp/verify",
        GURAGE_DEATIL_API: "/api/mechanics/garage/",
    },

    GARAGE_BOOKING_API: "/api/garage/booking/",
    UPDATE_LIVE_STATUS: "/api/garage/live/update",
    HOME_DATA: "/api/garage/home",
    REQUEST_WITHDRAW: "/api/garage/withdraw/request",
    GARAGE_DATA: "/api/user/",
    GARAGE_PROFILE: "/api/garage/profile",
    GURAGE_DEATIL_API: "/api/user/garage/",
    UPDATE_USER_PROFILE: "/api/user/profile",
    GET_USER_BOOKINGS: "/api/garage/booking/get",
    GET_USER_VEHICLES: "/api/user/bike",
    GET_USER_ADDRESS: "/api/user/address",
    DELETE_USER_ADDRESS : "/api/user/address/",
    GET_ALL_CITIES : "/api/user/city",
    CREATE_BOOKING : "/api/user/booking",
    ADD_MECHANICS : "/api/garage/mechanics",
    GET_MECHANICS : "/api/garage/mechanics",
    GET_MECHANICS_DETAILS : "/api/garage/mechanics/",
    GET_BOOKING_DETAILS : "/api/garage/booking/get/",
    GET_BIKE : "/api/garage/bike",
    UPDATE_MECHANIC : "/api/garage/mechanics",
    UPDATE_MECHANIC_IMAGE : "/api/garage/mechanics/update",
    ASSIGN_MECHANIC : "/api/garage/booking/assign",
    REVENUE : "/api/garage/revenue",
    REVENUE_DETAIL  : "/api/garage/revenue/",

    MECHANIC_HOME_DATA: "/api/mechanics/home",
    MECHANIC_PROFILE: "/api/mechanics/profile",
    GET_MECHANIC_BOOKINGS: "/api/mechanics/booking/get",
    GET_MECHANIC_BOOKINGS_DETAILS: "/api/mechanics/booking/",
    START_BOOKING: "/api/mechanics/booking/",
    INCEPTION_LIST: "/api/mechanics/booking/",
    PRE_INCEPTION: "/api/mechanics/booking/",
    ADD_ONS_LIST: "/api/garage/booking/",

    SPARE_LIST: "/api/garage/booking/",

    ADD_SPARE: "/api/mechanics/booking/",
    UPDATE_SPARE: "/api/mechanics/booking/",
    REMOVE_SPARE: "/api/mechanics/booking/",

    BIKE_BRAND : "/api/user/brand",
    ADD_BIKE : "/api/user/bike",

    COMPLETE_SERVICE : "/api/mechanics/booking/",
    RATING : "/api/mechanics/booking/",
    ADD_PAYMENT : "/api/mechanics/booking/",

    UPDATE_FCM : "/auth/updateFcmToken",

    ESTIMATED_TIME : "/api/garage/booking/updateEstimatedTime",



    ASYNC_STORAGE: {
        LOGGED_IN_USER_DATA: "loggedInUserData",
        USER_DATA: "user-data",
        USER_DOWNLOADED_AUDIO: "shabd-user-audio-list",
        FCM_TOKEN: "FCMTOKEN"
    },

    PRIVACY_POLICY_URL: "https://bikedoot.com/about.php",
    TERMS_CONDITION_URL: "https://bikedoot.com/terms-of-use.php",
    ABOUT_US_URL: "https://bikedoot.com/about.php",
}

export default Constants;