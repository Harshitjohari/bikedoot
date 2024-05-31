import React, { useState } from 'react';
import { View, Box, Text, Button, VStack, HStack, Pressable, ScrollView, Divider } from 'native-base';
import Header from '../../../components/header';

const DateTimePicker = ({ dateArray ,timeArray}) => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const startingDate = 15; // Starting date for display
  const numberOfDays = 11; // Number of days to display
  const timeSlots = ['10:00-11:00 AM', '11:00-12:00 PM', '12:00-1:00 PM', '1:00-2:00 PM', '2:00-3:00 PM'];

  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    // Get day of the month (e.g., '15')
    const day = dateObject.getDate();
    // Get month name in short format (e.g., 'JAN')
    const monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthIndex = dateObject.getMonth();
    const monthShort = monthNamesShort[monthIndex];
    return { day, monthShort };
  }

  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  const renderDateItem = (day) => (
    <Pressable
      key={day}
      onPress={() => handleDateSelection(day)}
      p={2}
      bg={selectedDate === day ? 'blue.500' : 'white'}
      borderRadius={8}
      mr={2}
    >
      <Text color={selectedDate === day ? 'white' : 'black'}>{day}</Text>
    </Pressable>
  );

  const renderTimeItem = (time, index) => (
    <Pressable
      key={index}
      onPress={() => handleTimeSelection(time)}
      p={3}
      bg={selectedTime === time ? '#ff5c39' : '#ffeeec'}
      borderRadius={8}
      mr={1}
      mt={3}
    >
      <Text fontWeight="500" fontSize="bd_sm" lineHeight="20px" color={selectedTime === time ? 'white' : '#ce8b7b'}>{time}</Text>
    </Pressable>
  );

  const handleContinue = () => {
    // Handle continue button click
    console.log('Continue button clicked');
  };

  const isDateSelected = true;
  const isTimeSelected = true;

  return (
    <Box p={0} flex={1}>
      <VStack space={2} mb={4}>
        <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
          Select date
        </Text>
        <Divider />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={3}>
          {dateArray && dateArray.map((data, index) => {
            let formattedDate = formatDate(data);
            return (
              <Pressable onPress={(data, index)}>
                <VStack mr={2} space={2} bg={isDateSelected && index === 3 ? "#5349f8" : "transparent"} p={2} borderRadius={50} pt={4} pb={4}>
                  <Text fontWeight="700" fontSize="bd_md" mb={0} lineHeight="20px" color={isDateSelected && index === 3 ? "#FFF" : "bd_sec_text"} textAlign="center">{formattedDate.monthShort}</Text>
                  <Text fontWeight="500" fontSize="bd_md" mb={0} lineHeight="20px" color={isDateSelected  && index === 3 ? "#FFF" : "bd_dark_text"} textAlign="center">{formattedDate.day}</Text>
                </VStack>
              </Pressable>
            )
          })}
        </ScrollView>
      </VStack>

      <VStack space={2} mb={4} mt={5}>
        <Text fontWeight="600" fontSize="bd_md" mb={0} lineHeight="20px" color="bd_dark_text">
          Select time Slot
        </Text>
        <Divider />
        <HStack space={2} flexWrap="wrap">
          {timeArray && timeArray.map(renderTimeItem)}
        </HStack>
      </VStack>
    </Box>
  );
};

export default DateTimePicker;
