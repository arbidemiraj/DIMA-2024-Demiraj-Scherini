import { Text, View } from '@/components/Themed';
import React from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface Props {
  text: string;
  altStyle: boolean;
  func: () => void;
}

export default function CustomButton({ text, altStyle, func }: Props) {
  const isLightTheme = useColorScheme() === 'light';

  const computeBackground = (): ViewStyle => {
    let style;
    if (altStyle) return { backgroundColor: 'transparent' };
    isLightTheme ? (style = { backgroundColor: Colors.dark.background }) : (style = { backgroundColor: Colors.light.background });
    return style;
  };

  const computeTextColor = (): TextStyle => {
    let style = { color: Colors.light.text };
    if (altStyle && !isLightTheme) return { color: Colors.dark.text };
    if (!altStyle && isLightTheme) return { color: Colors.dark.text };
    if (!altStyle && !isLightTheme) return { color: Colors.light.text };
    return style;
  };

  return (
    <View style={[styles.container, computeBackground()]}>
      <Pressable onPress={func} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <Text style={[styles.text, computeTextColor()]}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 150,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
