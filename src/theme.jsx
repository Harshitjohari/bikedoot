// theme.js

import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    // Define your text colors here
    bd_primary_c: '#898993',
    bd_secondary_c: '#7F7F7F',
    bd_sec_text : "#7F7F7F",
    bb_dark:"#000",
    bd_dark_text : "#000"
    // Add more colors as needed
  },
  backgroundColors: {
    // Define your background colors here
    bd_primary_bg: '#5349f8',
    bd_secondary_bg: 'lightgray',
    input_bg:"#f4f5f7",
    screen_bg:"#faf9ff",
    bg_white:"#FFF"
    // Add more background colors as needed
  },
  fontSizes: {
    // Define your text sizes here
    bd_xsm: '12px',
    bd_sm: '14px',
    bd_md: '16px',
    bd_lg: '18px',
    bd_xlg: '24px',
    // Add more text sizes as needed
  },
});

export default theme;
