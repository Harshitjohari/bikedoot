import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image, Alert} from 'react-native';
import { Footer, FooterTab, Box, Text, VStack, HStack } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Header from '../../../components/header';
import Apis from '../../../utils/api'
import Constant from '../../../common/constant';
import { useAuth } from '../../../context/loginContext';
import { handleToast } from '../../../utils/toast';
import LoadingSpinner from '../../../components/UI/loading'
import EmptyState from '../../../components/empty-screen';

import { imageConstant } from '../../../utils/constant';
import Geolocation from '@react-native-community/geolocation';




const Stepper = (props) => {
  const { garageID, serviceType, title } = props.route.params;

  const { token, location } = useAuth();
  const { show, close, closeAll } = handleToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [garageData, setGarageData] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesData, setServicesData] = useState([]);


  const [addOns, setAddOns] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createBookingLoader, setCreateBookingLoader] = useState(false);

  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [isStep3Valid, setIsStep3Valid] = useState(false);
  const [isStep4Valid, setIsStep4Valid] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedBike, setSelectedBike] = useState({})

  // step2
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [addOnData, setAddOnData] = useState(addOns);

  // step3
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [otherSuggestionText, setOtherSuggestionText] = useState("");
  const [takePermissionBeforeReplacing, setTakePermissionBeforeReplacing] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
  const [isNotServicable, setIsNotServicable] = useState(false)



  const [totalAmount, setTotalAmount] = useState(0);
  const calculateTotalAmount = () => {

    // Calculate total from selectedAccessories
    const accessoriesTotal = selectedAccessories.reduce((total, accessory) => total + accessory.price, 0);
    // Calculate total from selectedAddOns
    const addOnsTotal = selectedAddOns.reduce((total, addOn) => total + addOn.price, 0);
    // Calculate total from selectedServices
    const servicesTotal = selectedServices.price || 0;
    // Sum up all totals
    const totalAmount = accessoriesTotal + addOnsTotal + servicesTotal;
    setTotalAmount(totalAmount);

  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === 2) {
        // setSelectedBike({})
      }
      return Math.max(prevStep - 1, 1)
    });
  };

  const handleNext = () => {

    if (currentStep === 4)
      addBooking()
    else
      setCurrentStep((prevStep) => {
        if (prevStep === 1) {
          if (Object.keys(selectedBike).length === 0) {
            show("Please select bike", "error");
            return Math.min(1, 4)
          }
        }
        else if (prevStep === 2) {
          if (Object.keys(selectedServices).length > 0 || selectedAddOns.length > 0) {
            return Math.min(prevStep + 1, 4)
          } else {
            show("Please select service or addons", "error");
            return Math.min(2, 4)
          }
        }
        else if (prevStep === 3) {
          if (selectedDate === null) {
            show("Please select date", "error");
            return Math.min(3, 4)
          }
          if (selectedTime === null) {
            show("Please select time slot", "error");
            return Math.min(3, 4)
          }
          if (selectedAddress.length === 0) {
            show("Please select address or add a new one", "error");
            return Math.min(3, 4)
          }
        }
        return Math.min(prevStep + 1, 4)
      });
  };

  useEffect(() => {
    calculateTotalAmount();
    
  }, [selectedAccessories, selectedAddOns, selectedServices]);

  useEffect(() => {
    fetchGarageData();
    // getLocation();
    // checkGPS();
  }, []);

//   const checkGPS = () => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         // console.log('1234============================>>>>>>',position.coords);
//         const { latitude, longitude } = position.coords;
//         setLocation({latitude, longitude})
//         console.log('=======>',{latitude, longitude})
//       },
//       (error) => {
//         Alert.alert(
//           'GPS not enabled',
//           'Please enable GPS to use this app.',
//           [
//             { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
//           ],
//           { cancelable: false }
//         );
//       },
//       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//     );
// };


  // const getLocation = async () => {
  //   // Geolocation.getCurrentPosition(info => console.log('=======>',info));
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const { latitude, longitude } = position.coords;
  //       setLocation({latitude, longitude})
  //       console.log('=======>',{latitude, longitude})
  // });

  // }

  const fetchGarageData = async () => {
    try {
      setLoading(true);
      let response = await Apis.HttpGetRequest(Constant.BASE_URL + Constant.AUTH.GURAGE_DEATIL_API +  garageID , token)
      setLoading(false);
      if (response ?.status) {
        // console.log('============>',response.data)
        setGarageData(response.data)
        let services = response ?.data ?.services;
        setAccessories(response ?.data ?.accessories);

        if (response.data.garage.serviceCategory.length === 0) {
          setIsNotServicable(true)
        }
        for (let index = 0; index < services.length; index++) {
          if (services[index] ?.type === "Service") {
            setServices(services[index] ?.data)
            setServicesData(services[index] ?.data)
          } else if (services[index] ?.type === "Add-On") {
            setAddOns(services[index] ?.data)
            setAddOnData(services[index] ?.data)
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

  const addBooking = async () => {
    let services = [selectedServices._id]


    for (let index = 0; index < selectedAddOns.length; index++) {
      services.push(selectedAddOns[index]._id)
    }

    let accessories = [];

    for (let index = 0; index < selectedAccessories.length; index++) {
      accessories.push(selectedAccessories[index]._id)
    }

    if (!isAgreed) {
      show("Please accept terms & conditions", "error");
      return;
    }

    try {
      let data = {
        "garage": garageID,
        "serviceCategory" : serviceType,
        "bike": selectedBike.id,
        "address": {
          "city": selectedAddress[0].id,
          "pincode": selectedAddress[0].pincode,
          "address": selectedAddress[0].address1,
          "latitude":JSON.parse(location).latitude,
          "longitude":JSON.parse(location).longitude,
        },
        "date": selectedDate,
        "time": selectedTime,
        "slot":selectedTimeSlot,
        "services": services,
        "accessories": accessories,
        "sparePartPermission": takePermissionBeforeReplacing,
        "other": otherSuggestionText
      }

      // console.log('==============>',data)
      // return

      
      setCreateBookingLoader(true)
      let response = await Apis.HttpPostRequest(Constant.BASE_URL + Constant.CREATE_BOOKING, token, data)
      setCreateBookingLoader(false)
      if (response ?.status) {
        show(response ?.message, "success");
        props.navigation.navigate("BookingConfirmation", { bookingID: response ?.data ?.bookingId});
      } else {
        show(response ?.message || "Failed to create booking, try again later", "error");
      }
    } catch (e) {
      setCreateBookingLoader(false)
      show("Some error has occured!,try again later", "error");
    }
  }

  const renderNoServiceAvailable = () => {
    return <EmptyState message="No Services available, try another garage" showBtn={true} onPress={() => props.navigation.navigate("Home")} />
  }

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1
          setAddOnData={setAddOnData}
          addOnData={addOnData}
          setSelectedAccessories={setSelectedAccessories}
          setSelectedAddOns={setSelectedAddOns}
          setSelectedServices={setSelectedServices}
          servicesData={services}
          setServicesData={setServicesData}
          validateStep1={(isValid) => { setIsStep1Valid(isValid) }} selectedBike={selectedBike} setSelectedBike={setSelectedBike} {...props} />;
      case 2:
        return <Step2
          addOnData={addOnData}
          setAddOnData={setAddOnData}
          servicesData={servicesData}
          setServicesData={setServicesData}
          calculateTotalAmount={() => calculateTotalAmount()} services={services} addOns={addOns} accessories={accessories}
          setSelectedAccessories={setSelectedAccessories}
          selectedAccessories={selectedAccessories}
          selectedAddOns={selectedAddOns}
          setSelectedAddOns={setSelectedAddOns}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          selectedBike={selectedBike}
          {...props}

        />;
      case 3:
        return <Step3
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          dateArray={garageData ?.availableDates}
          dateArrayNew={garageData ?.availableSlots}
          selectedDateIndex={selectedDateIndex}
          setSelectedDateIndex={setSelectedDateIndex}
          otherSuggestionText={otherSuggestionText}
          setOtherSuggestionText={setOtherSuggestionText}
          takePermissionBeforeReplacing={takePermissionBeforeReplacing}
          setTakePermissionBeforeReplacing={setTakePermissionBeforeReplacing}
          timeArray={garageData ?.availableTimes} {...props} />;
      case 4:
        return <Step4
          selectedBike={selectedBike}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedAddress={selectedAddress}
          selectedAccessories={selectedAccessories}
          selectedAddOns={selectedAddOns}
          selectedServices={selectedServices}
          otherSuggestionText={otherSuggestionText}
          setOtherSuggestionText={setOtherSuggestionText}
          takePermissionBeforeReplacing={takePermissionBeforeReplacing}
          setTakePermissionBeforeReplacing={setTakePermissionBeforeReplacing}
          setIsAgreed={setIsAgreed}
          isAgreed={isAgreed}
          setCurrentStep={setCurrentStep}
          setSelectedBike={setSelectedBike}
          garageData= {garageData.garage}
          title={title}
          {...props} />;
      default:
        return null;
    }
  };
  return (
    <Box p={0} flex={1} bg="#fff">
      <Header title="Booking"  {...props} />

      <Box m={3}>
        <View style={styles.stepsContainer}>
          {["Select Bike", "Service", "Slot & Address", "Summary"].map((data, step) => (
            <React.Fragment key={step}>
              <View style={styles.stepContainer}>
                <TouchableOpacity
                  style={[
                    styles.stepButton,
                    currentStep >= (step + 1) ? styles.activeStep : styles.inactiveStep,
                  ]}
                >
                  {(currentStep >= (step + 1)) ? (
                    <FontAwesome5 name="check" color="#FFF" size={14} />
                  ) : null}
                </TouchableOpacity>
                {(
                  <Text style={currentStep > step ? styles.stepText : styles.stepInActiveText}>{data}</Text>
                )}
              </View>

              {(step + 1) < 4 && (
                <View
                  style={[
                    styles.line,
                    currentStep > (step + 1) ? styles.activeLine : styles.inactiveLine,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </Box>

      <ScrollView style={{ marginBottom: 30 }}>
        <Box m={3}>
          {loading ? <LoadingSpinner /> : isNotServicable ? renderNoServiceAvailable() : renderContent()}
        </Box>
      </ScrollView>

      {!isNotServicable && <View style={styles.controlsContainer}>
        {currentStep > 1 && <TouchableOpacity
          style={styles.controlButtonLeft}
          onPress={handlePrev}
          disabled={currentStep === 1}
        >
          {/* <FontAwesome5 name="chevron-left" color="#5349f8" size={18} /> */}
          <Text fontWeight="700" fontSize="bd_sm" color="#5349f8">Back</Text>
        </TouchableOpacity>}

        <VStack style={{ position: "absolute", left: 70, alignSelf: "center" }} space={0} mb={0}>
            <HStack space={3} alignItems="center" mt={0} mb={0}>
                
                {currentStep > 1 &&
                <>
                <Image source={imageConstant.cart} alt="" style={{ width: 30, height: 30 }} />
                <VStack space={0} alignItems="flex-start">
                <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="20px" color="#FFF">
                    Expected Amount
                </Text>
                <HStack space={1} alignItems="center" mt={0} mb={0}>
                    <FontAwesome5 color="#FFF" name="rupee-sign" size={14} />
                    <Text color="#FFF" fontWeight="600" fontSize="bd_md">{totalAmount}</Text>
                </HStack>
            </VStack>
            </>
                }
            </HStack>
        </VStack>


        {isStep1Valid && <TouchableOpacity
          style={styles.controlButtonRight}
          onPress={handleNext}
          disabled={createBookingLoader}
        >
          {currentStep === 4 ? <Text fontWeight="700" fontSize="bd_sm" color="#5349f8">{createBookingLoader ? "Creating.." : "Create Booking"}</Text> : <Text fontWeight="700" fontSize="bd_sm" color="#5349f8">Next</Text>}
          {/* {currentStep === 4 ? <Text fontWeight="700" fontSize="bd_sm" color="#5349f8">{createBookingLoader ? "Creating.." : "Create Booking"}</Text> : <FontAwesome5 name="chevron-right" color="#5349f8" size={18} />} */}
        </TouchableOpacity>}
      </View>}

    </Box>);
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  stepsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    // flex: 1,
  },
  stepButton: {
    backgroundColor: 'grey',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    // marginTop:20,
    backgroundColor: '#5349f8',
    borderWidth: 5,
    borderColor: "#968ff9"
  },
  inactiveStep: {
    // marginTop:20,
    backgroundColor: '#FFF',
    borderWidth: 5,
    borderColor: "#e7e7e9"

  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#5349f8',
    marginTop: -15,
  },
  activeLine: {
    backgroundColor: '#5349f8',
  },
  inactiveLine: {
    backgroundColor: '#e3e3e3',
  },
  stepText: {
    color: '#5349f8',
    fontSize: 10,
    fontWeight: "600"
  },
  stepInActiveText: {
    color: '#000',
    fontSize: 10,
    fontWeight: "600"
  },
  contentContainer: {
    marginVertical: 20,
  },
  controlsContainer: {
    height: 60,
    position: "relative",
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: "#5349f8",
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  controlButtonRight: {
    backgroundColor: '#FFF',
    padding: 7,
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "flex-end",
    position: "absolute",
    right: 10,
    alignSelf: "center",
    // width:40,
    // height:40
  },

  controlButtonLeft: {
    backgroundColor: '#FFF',
    padding: 7,
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    left: 10,
    alignSelf: "center"

  },

  controlText: {
    color: '#fff',
  },
});

export default Stepper;
