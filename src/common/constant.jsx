const Constants = {
    BASE_URL: "http://bikedoot-backend-1645567596.eu-north-1.elb.amazonaws.com",
    // BASE_URL: "http://16.16.246.10",
    // BASE_URL: "http://10.0.2.2:3005",

    AUTH: {
        OTP_REQUEST: "/auth/sendOtpForMobileLogin",
        OTP_VERIFY: "/auth/mobileLogin",
        GURAGE_DEATIL_API: "/api/user/garage/",
        // GURAGE_DEATIL_API: "/api/user/garage/659eeae8998d7a8cbc8b4945",
    },

    HOME_DATA: "/api/user/",
    GARAGE_DATA: "/api/user/",
    GURAGE_DEATIL_API: "/api/user/garage/",
    UPDATE_USER_PROFILE: "/api/user/profile",
    GET_USER_BOOKINGS: "/api/user/booking",
    GET_USER_BOOKINGS_DETAILS: "/api/user/booking/",
    GET_USER_VEHICLES: "/api/user/bike",
    GET_USER_ADDRESS: "/api/user/address",
    DELETE_USER_ADDRESS : "/api/user/address/",
    GET_ALL_CITIES : "/api/user/city",
    CREATE_BOOKING : "/api/user/booking",
    VERIFY_MECHANIC : "/api/user/booking/verifyMechanics",
    APPROVED_PREINSPECTION : "/api/user/booking/approvedPreinception",
    RATING : "/api/user/booking/",
    GARAGE_RATING_LIST : "/api/user/garage/",
    RESCHEDULE_BOOKING : "/api/user/booking/reschedule",
    CANCEL_BOOKING : "/api/user/booking/cancel",

    UPDATE_FCM : "/auth/updateFcmToken",

    BIKE_BRAND : "/api/user/brand",
    ADD_BIKE : "/api/user/bike",

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