import React from 'react';
import { Box, HStack, Text, Pressable } from 'native-base';

const TextHeader = (props) => {
  const { title, onPressSeeAll, showSeeAll = true, text = "" } = props;

  return (
    <Box p={0} mb={1} mt={4} ml={1} {...props}>
      <HStack space={4} alignItems="center">
        {/* Title on the Left */}
        <Text fontWeight="700" fontSize="bd_md">
          {title}
        </Text>

        {/* "See All" Clickable Link on the Right */}
        {showSeeAll && <Pressable onPress={onPressSeeAll} style={{ position: 'absolute', right: 0 }}>
          <Text color="blue.500" fontWeight="700">{text}</Text>
        </Pressable>}
      </HStack>
    </Box>
  );
};

export default TextHeader;
