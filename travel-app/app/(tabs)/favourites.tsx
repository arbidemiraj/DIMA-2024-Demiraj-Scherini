import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import CategoriesBottomSheet from '@/components/CategoriesBottomSheet';
import React, { useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function Favourites() {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false);

  const toggleModal = () => {
    if (isBottomSheetVisible) {
      bottomSheetModalRef.current?.dismiss();
      setIsBottomSheetVisible(!isBottomSheetVisible);
    } else {
      bottomSheetModalRef.current?.present();
      setIsBottomSheetVisible(!isBottomSheetVisible);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleModal}>
        <Text>Toggle BottomSheet</Text>
      </Pressable>
      <CategoriesBottomSheet ref={bottomSheetModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
