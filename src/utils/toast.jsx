// utils/toastUtil.js
import React from 'react';
import { useToast, Box, Text } from 'native-base';

// Function to handle toast operations
export const handleToast = () => {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const show = (msg, type = "default") => {
    switch (type) {
      case "default":
        toastIdRef.current = toast.show({
          title: msg
        });
        break;
      case "error":
        toastIdRef.current = toast.show({
          render: () => {
            return <Box bg="#a30621" px="2" py="1" rounded="sm" mb={5}>
              <Text fontSize="bd_sm" color="#FFF">{msg}</Text>
            </Box>;
          }
        })
        break;
      // case "success":
      //   console.log('jiiiiii')
      //   toastIdRef.current = toast.show({
      //     render: () => {
      //       return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
      //         <Text fontSize="bd_sm" color="#FFF">{msg}</Text>
      //       </Box>;
      //     }
      //   })
      //   break;
      case "success":
        toastIdRef.current = toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                <Text fontSize="bd_sm" color="#FFF">{msg}</Text>
              </Box>
            );
          }
        });
        setTimeout(() => {
          if (toastIdRef.current) {
            toast.close(toastIdRef.current);
          }
        }, 3000);
        break;
    }
  };

  const close = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  };

  const closeAll = () => {
    toast.closeAll();
  };

  return {
    show,
    close,
    closeAll,
  };
};
