import { Pressable, StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import React, { ReactNode } from 'react';
import { Iconify } from 'react-native-iconify';

interface SpecificIconProps {
  size: number;
  func: (value: string) => void;
}

export function FoodIcon({ size, func }: SpecificIconProps) {
  const value = 'food';
  return (
    <PressableIcon value={value} bgColor={'#EAB308'} func={() => func(value)}>
      <Iconify icon='pajamas:food' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function SportIcon({ size, func }: SpecificIconProps) {
  const value = 'sport';
  return (
    <PressableIcon value={value} bgColor={'#EC4899'} func={() => func(value)}>
      <Iconify icon='fluent:sport-16-regular' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function NatureIcon({ size, func }: SpecificIconProps) {
  const value = 'nature';
  return (
    <PressableIcon value={value} bgColor={'#10B981'} func={() => func(value)}>
      <Iconify icon='pajamas:nature' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function AdventureIcon({ size, func }: SpecificIconProps) {
  const value = 'adventure';
  return (
    <PressableIcon value={value} bgColor={'#14B8A6'} func={() => func(value)}>
      <Iconify icon='fluent-mdl2:world' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function LuxoryIcon({ size, func }: SpecificIconProps) {
  const value = 'luxury';
  return (
    <PressableIcon value={value} bgColor={'#A855F7'} func={() => func(value)}>
      <Iconify icon='ion:diamond' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function RoadTripIcon({ size, func }: SpecificIconProps) {
  const value = 'roadTrip';
  return (
    <PressableIcon value={value} bgColor={'#EF4444'} func={() => func(value)}>
      <Iconify icon='mdi:car-outline' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function CultureIcon({ size, func }: SpecificIconProps) {
  const value = 'culture';
  return (
    <PressableIcon value={value} bgColor={'#F43F5E'} func={() => func(value)}>
      <Iconify icon='solar:masks-linear' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function MuseumIcon({ size, func }: SpecificIconProps) {
  const value = 'museum';
  return (
    <PressableIcon value={value} bgColor={'#06B6D4'} func={() => func(value)}>
      <Iconify icon='icon-park-outline:museum-one' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function MonumentIcon({ size, func }: SpecificIconProps) {
  const value = 'monument';
  return (
    <PressableIcon value={value} bgColor={'#3B82F6'} func={() => func(value)}>
      <Iconify icon='icon-park-outline:monument-one' size={size} color={'white'} />
    </PressableIcon>
  );
}

export function WildlifeIcon({ size, func }: SpecificIconProps) {
  const value = 'wildlife';
  return (
    <PressableIcon value={value} bgColor={'#F97316'} func={() => func(value)}>
      <Iconify icon='cil:animal' size={size} color={'white'} />
    </PressableIcon>
  );
}

interface Props {
  value: string;
  bgColor: string;
  func: (value: string) => void;
  children: ReactNode;
}

function PressableIcon({ value, bgColor, func, children }: Props) {
  const habdlePress = () => {
    func(value);
  };
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Pressable onPress={habdlePress}>{children}</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'black',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
