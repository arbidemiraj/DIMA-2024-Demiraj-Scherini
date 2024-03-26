import { StyleSheet } from 'react-native';
import React, { forwardRef, useMemo } from 'react';
import { Text, View } from '@/components/Themed';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

export type Ref = BottomSheetModal;

// forwardRef enables us to pass a ref from a parent component down
// to a child, ensuring that we can still access and interact with DOM elements
export default forwardRef<Ref>(function CategoriesBottomSheet(props, ref) {
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  return (
    <View style={styles.container}>
      <BottomSheetModal ref={ref} snapPoints={snapPoints} index={0}>
        <BottomSheetView>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
