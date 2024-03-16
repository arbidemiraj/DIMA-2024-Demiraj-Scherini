/**
 * This file contains all the constant values related
 * to styles used in the application, from colors to 
 * standard sizes...
 */

// accent colors
const tintColorLight = '#3B82F6';
const tintColorDark = '#fff';

// whites
const white1 = '#FAFAFA';
const white2 = '#F5F5F5';

// blacks
const black1 = '#262626';
const black2 = "#171717";

// grays
const gray100 = '#CCCCCC';
const gray200 = '#737373';
const gray300 = '#777777';
const gray400 = '#333333';



export default {
  light: {
    text: black1,
    lightText: gray300,
    background: white1,
    tint: tintColorLight,
    tabIconDefault: gray200,
    tabIconSelected: tintColorLight,
    separator: gray100
  },
  dark: {
    text: white2,
    background: black2,
    tint: tintColorDark,
    tabIconDefault: gray200,
    tabIconSelected: tintColorDark,
    separator: gray400
  },
};
