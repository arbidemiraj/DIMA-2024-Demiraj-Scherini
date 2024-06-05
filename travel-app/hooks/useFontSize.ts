import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useFontSize = (): number => {
  const [fontSize, setFontSize] = useState(16); // Default font size

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const referenceWidth = 450;
    const baseFontSize = 16;

    // Calculate scaling factor based on reference width
    let scaleFactor = screenWidth / referenceWidth;

    // Limit the maximum scaling factor to avoid excessive font sizes on very wide screens
    const maxScaleFactor = 1.2; // You can adjust this value as needed
    scaleFactor = Math.min(scaleFactor, maxScaleFactor);

    // Calculate scaled font size
    let scaledFontSize = baseFontSize * scaleFactor;

    // Ensure minimum font size of 16
    scaledFontSize = Math.max(scaledFontSize, 16);
    setFontSize(Math.round(scaledFontSize));
  }, []);

  return fontSize;
};

const useFontSizeTitle = (): number => {
  const baseFontSize = useFontSize(); // Get the base font size using useFontSize

  const [fontSize, setFontSize] = useState(baseFontSize * 1.1); // Default font size 10% larger

  useEffect(() => {
    setFontSize(baseFontSize * 1.3); // Update font size if baseFontSize changes
  }, [baseFontSize]);

  return fontSize;
};

export { useFontSize, useFontSizeTitle };
