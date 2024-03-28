import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { View } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { Iconify } from 'react-native-iconify';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import useStore from '@/store/store';

/**
 * Each icon must be defined as its own component since
 * Ionify library does not allow us to pass variables as
 * icon names but only supports string literals for performance reasons.
 * This is a limitation for what concearn reusability but improves
 * the app performance.
 * The solution we designed is divided in 2 parts: a basic component "SelectableIcon"
 * with the necessary logic and then a serie of components that "extend" it
 * and apply the correct icon, value and color.
 */
interface SpecificIconProps {
  // size of the icon
  size: number;
  //function triggered on press (value is passed to parent component when icon press)
  func: (value: string) => void;
}

export function FoodIcon({ size, func }: SpecificIconProps) {
  const value = 'food';
  return (
    <SelectableIcon value={value} bgColor={'#EAB308'} func={() => func(value)}>
      <Iconify icon='pajamas:food' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function SportIcon({ size, func }: SpecificIconProps) {
  const value = 'sport';
  return (
    <SelectableIcon value={value} bgColor={'#EC4899'} func={() => func(value)}>
      <Iconify icon='fluent:sport-16-regular' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function NatureIcon({ size, func }: SpecificIconProps) {
  const value = 'nature';
  return (
    <SelectableIcon value={value} bgColor={'#10B981'} func={() => func(value)}>
      <Iconify icon='pajamas:nature' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function AdventureIcon({ size, func }: SpecificIconProps) {
  const value = 'adventure';
  return (
    <SelectableIcon value={value} bgColor={'#14B8A6'} func={() => func(value)}>
      <Iconify icon='fluent-mdl2:world' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function LuxoryIcon({ size, func }: SpecificIconProps) {
  const value = 'luxury';
  return (
    <SelectableIcon value={value} bgColor={'#A855F7'} func={() => func(value)}>
      <Iconify icon='ion:diamond' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function RoadTripIcon({ size, func }: SpecificIconProps) {
  const value = 'roadTrip';
  return (
    <SelectableIcon value={value} bgColor={'#EF4444'} func={() => func(value)}>
      <Iconify icon='mdi:car-outline' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function CultureIcon({ size, func }: SpecificIconProps) {
  const value = 'culture';
  return (
    <SelectableIcon value={value} bgColor={'#F43F5E'} func={() => func(value)}>
      <Iconify icon='solar:masks-linear' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function MuseumIcon({ size, func }: SpecificIconProps) {
  const value = 'museum';
  return (
    <SelectableIcon value={value} bgColor={'#06B6D4'} func={() => func(value)}>
      <Iconify icon='icon-park-outline:museum-one' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function MonumentIcon({ size, func }: SpecificIconProps) {
  const value = 'monument';
  return (
    <SelectableIcon value={value} bgColor={'#3B82F6'} func={() => func(value)}>
      <Iconify icon='icon-park-outline:monument-one' size={size} color={'white'} />
    </SelectableIcon>
  );
}

export function WildlifeIcon({ size, func }: SpecificIconProps) {
  const value = 'wildlife';
  return (
    <SelectableIcon value={value} bgColor={'#F97316'} func={() => func(value)}>
      <Iconify icon='cil:animal' size={size} color={'white'} />
    </SelectableIcon>
  );
}

// Generic component props
interface Props {
  value: string;
  bgColor: string;
  func: (value: string) => void;
  children: ReactNode;
}

// basic component that each Iconify icon "EXTENDS"
function SelectableIcon({ value, bgColor, func, children }: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const isLightTheme = useColorScheme() === 'light';

  const { categoriesList } = useStore();

  // to handle when applying the border we useuseEffect and
  // re-render only when the array of categories changes
  useEffect(() => {
    if (categoriesList.includes(value)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [categoriesList]);

  const habdlePress = () => {
    func(value);
  };

  const computeSelectedStyle = (): ViewStyle => {
    if (!isSelected) return { borderColor: 'transparent' };
    return { borderColor: isLightTheme ? Colors.light.text : Colors.dark.text };
  };

  return (
    <Pressable onPress={habdlePress}>
      <View style={[styles.container, computeSelectedStyle(), { backgroundColor: bgColor, borderWidth: 2 }]}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
