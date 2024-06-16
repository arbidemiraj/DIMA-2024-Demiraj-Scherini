import { Text, View } from '@/components/Themed';
import React from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

/**
 * Generic button component, Themed and comes with 2 diff. styles:
 * 1) altStyle = false -> coomponent has a padding and text color coherent with  Theme
 * 2) altStyle = true -> component has transparent padding and text coherent with Theme
 */

interface Props {
  testID?: string;
  text: string;
  altStyle: boolean;
  // accept a function that is triggered when pressed
  func: () => void;
}

export default function CustomButton({ testID, text, altStyle, func }: Props) {
  const isLightTheme = useColorScheme() === 'light';

  const computeBackground = (): ViewStyle => {
    let style;
    if (altStyle) return { backgroundColor: 'transparent' };
    isLightTheme ? (style = { backgroundColor: Colors.dark.background }) : (style = { backgroundColor: Colors.light.background });
    return style;
  };

  // helper function to apply correct style
  const computeTextColor = (): TextStyle => {
    let style = { color: Colors.light.text };
    if (altStyle && !isLightTheme) return { color: Colors.dark.text };
    if (!altStyle && isLightTheme) return { color: Colors.dark.text };
    if (!altStyle && !isLightTheme) return { color: Colors.light.text };
    return style;
  };

  return (
    <View style={[styles.container, computeBackground()]} testID='btn-wrapper'>
      <Pressable testID={testID} onPress={func} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', paddingHorizontal: 20, paddingVertical: 10 }}>
        {({ pressed }) => <Text style={[styles.text, computeTextColor(), { opacity: pressed ? 0.5 : 1 }]}>{text}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    minWidth: 150,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
