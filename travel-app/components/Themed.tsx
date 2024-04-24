/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';
import { SafeAreaView as DefaultSafeAreaView, SafeAreaViewProps as DefaultSafeAreaProps } from 'react-native-safe-area-context';
import { BottomSheetViewProps as DefaultBottomSheetProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';
import { BottomSheetView as DefaultBottomSheetView, BottomSheetModal as DefaultBottomSheetModal } from '@gorhom/bottom-sheet';
import { ScrollView as DefaultScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type SafeAreaViewProps = ThemeProps & DefaultSafeAreaProps & { edges?: string[] };
export type BottomSheetViewProps = ThemeProps & DefaultBottomSheetProps;
export type ScrollViewProps = ThemeProps & DefaultScrollView['props'];

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderBottomColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');
  const borderTopColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');
  return <DefaultView style={[{ backgroundColor, borderBottomColor, borderTopColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderBottomColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');
  const borderTopColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');
  return <DefaultSafeAreaView style={[{ backgroundColor, borderBottomColor, borderTopColor }, style]} {...otherProps} />;
}

export function BottomSheetView(props: BottomSheetViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultBottomSheetView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const borderBottomColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');
  const borderTopColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultScrollView style={[{ backgroundColor, borderBottomColor, borderTopColor }, style]} {...otherProps} />;
}
