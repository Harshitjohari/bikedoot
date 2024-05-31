import React from 'react';
import { Badge, Text } from 'native-base';

const BadgeComponent = ({ text, colorScheme = "default" }) => {
  return (
    <Badge colorScheme={colorScheme} bg="#5349f8" alignSelf="center" borderRadius={5}>
      <Text fontSize="bd_xsm" color={'white'}>{text}</Text>
    </Badge>
  );
};

export default BadgeComponent;
