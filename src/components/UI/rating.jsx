import { Rating } from 'react-native-ratings';

import React from 'react';
import { HStack, Text } from 'native-base';

const Ratings = ({ rating, count, isDarkMode }) => {
  return (
    <HStack space={2} alignItems="center">
      <Rating
        type='custom'
        imageSize={14}
        readonly
        startingValue={rating}
        ratingColor='#F17339'
        tintColor={'#FFF'}
        style={{ paddingTop: 0, alignSelf: 'center' }}
      />
      <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                            {count} (200+ Ratings)
                        </Text>
    </HStack>
  );
};

export default Ratings;
