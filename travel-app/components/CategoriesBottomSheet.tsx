import { Platform, StyleSheet } from 'react-native';
import React, { forwardRef, useMemo } from 'react';
import { Text, View, BottomSheetView } from '@/components/Themed';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import CustomButton from './CustomButton';
import { FoodIcon, SportIcon, NatureIcon, AdventureIcon, LuxoryIcon, RoadTripIcon, CultureIcon, MuseumIcon, MonumentIcon, WildlifeIcon } from './CategoryIcons';
export type Ref = BottomSheetModal;

// the components accepts a function to handle the overlay
// applied on the whole page when the bottom sheet is shown
interface Props {
  toggleOverlay: () => void;
}

// forwardRef enables us to pass a ref from a parent component down
// to a child, ensuring that we can still access and interact with DOM elements
export default forwardRef<Ref, Props>(function CategoriesBottomSheet({ toggleOverlay }: Props, ref) {
  const isLightTheme = useColorScheme() === 'light';
  const snapPoints = useMemo(() => ['50%'], []);

  const handlePress = (value: string) => {
    console.log(value);
  };

  return (
    <View style={styles.container}>
      <BottomSheetModal ref={ref} snapPoints={snapPoints} index={0} onDismiss={toggleOverlay} backgroundStyle={{ backgroundColor: isLightTheme ? Colors.light.background : Colors.dark.background }} handleIndicatorStyle={{ backgroundColor: isLightTheme ? Colors.light.text : Colors.dark.text }}>
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
          </View>
          <View style={styles.categoryBox}>
            <Text style={styles.title}>Category</Text>
            <Text>Select one or more</Text>
            <View style={styles.catList}>
              <FoodIcon func={handlePress} size={28} />
              <SportIcon func={handlePress} size={28} />
              <NatureIcon func={handlePress} size={28} />
              <AdventureIcon func={handlePress} size={28} />
              <LuxoryIcon func={handlePress} size={28} />
              <RoadTripIcon func={handlePress} size={28} />
              <CultureIcon func={handlePress} size={28} />
              <MuseumIcon func={handlePress} size={28} />
              <MonumentIcon func={handlePress} size={28} />
              <WildlifeIcon func={handlePress} size={28} />
            </View>
          </View>
          <View style={[styles.btnGroup, { paddingBottom: Platform.OS === 'ios' ? 30 : 20 }]}>
            <CustomButton text='Remove Filters' altStyle={true} func={() => console.log('pressed 1')} />
            <CustomButton text='Apply Filters' altStyle={false} func={() => console.log('pressed 2')} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryBox: {
    width: '100%',
    padding: 30,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flex: 1,
  },
  catList: {
    paddingVertical: 20,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  btnGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
});
