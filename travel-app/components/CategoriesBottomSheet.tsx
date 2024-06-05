import { Platform, StyleSheet } from 'react-native';
import React, { forwardRef, useMemo } from 'react';
import { Text, View, BottomSheetView } from '@/components/Themed';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import CustomButton from './CustomButton';
import { FoodIcon, SportIcon, NatureIcon, AdventureIcon, LuxoryIcon, RoadTripIcon, CultureIcon, MuseumIcon, MonumentIcon, WildlifeIcon } from './CategoryIcons';
import useStore from '@/store/store';
import { useWindowDimensions } from 'react-native';
import { useFontSize, useFontSizeTitle } from '@/hooks/useFontSize';

export type Ref = BottomSheetModal;

// the components accepts a function to handle the overlay
// applied on the whole page when the bottom sheet is shown
// it also accepts the function to handle filter applying and cleaning
interface Props {
  toggleOverlay: () => void;
  applyFilters: () => void;
  removeFilters: () => void;
}

// forwardRef enables us to pass a ref from a parent component down
// to a child, ensuring that we can still access and interact with DOM elements
export default forwardRef<Ref, Props>(function CategoriesBottomSheet({ toggleOverlay, applyFilters, removeFilters }: Props, ref) {
  const isLightTheme = useColorScheme() === 'light';
  const snapPoints = useMemo(() => ['50%'], []);
  const { toggleCategory } = useStore();

  const handlePress = (value: string) => {
    toggleCategory(value);
  };

  const calculateIconSize = (screenWidth: number) => {
    const baselineSize = 28;
    const minWidth = 600;
    const maxWidth = 1024;
    const maxSize = 64;

    // If screenWidth is less than minWidth, return the baseline size
    if (screenWidth <= minWidth) {
      return baselineSize;
    }

    // Calculate scaling factor based on remaining width (after minWidth)
    const remainingWidth = screenWidth - minWidth;
    const scaleFactor = remainingWidth / (maxWidth - minWidth);

    // Interpolate between baseline size and maximum size using the scaling factor
    const scaledSize = baselineSize + (maxSize - baselineSize) * scaleFactor;

    // Ensure that the size does not exceed the maximum size
    return Math.min(scaledSize, maxSize);
  };
  const { width: screenWidth } = useWindowDimensions();
  const iconSize = calculateIconSize(screenWidth);

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        onDismiss={toggleOverlay}
        backgroundStyle={{ backgroundColor: isLightTheme ? Colors.light.background : Colors.dark.background }}
        handleIndicatorStyle={{ backgroundColor: isLightTheme ? Colors.light.text : Colors.dark.text }}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
          </View>
          <View style={styles.categoryBox}>
            <Text style={[styles.title, { fontSize: useFontSize() * 1.1, marginBottom: 2 }]}>Category</Text>
            <Text style={{ fontSize: useFontSize() }}>Select one or more</Text>
            <View style={[styles.catList, { justifyContent: screenWidth < 1000 ? 'space-between' : 'flex-start', gap: screenWidth < 1000 ? 10 : 20 }]}>
              <FoodIcon func={handlePress} size={iconSize} />
              <SportIcon func={handlePress} size={iconSize} />
              <NatureIcon func={handlePress} size={iconSize} />
              <AdventureIcon func={handlePress} size={iconSize} />
              <LuxoryIcon func={handlePress} size={iconSize} />
              <RoadTripIcon func={handlePress} size={iconSize} />
              <CultureIcon func={handlePress} size={iconSize} />
              <MuseumIcon func={handlePress} size={iconSize} />
              <MonumentIcon func={handlePress} size={iconSize} />
              <WildlifeIcon func={handlePress} size={iconSize} />
            </View>
          </View>
          <View style={[styles.btnGroup, { paddingBottom: Platform.OS === 'ios' ? 30 : 20 }]}>
            <CustomButton text='Remove Filters' altStyle={true} func={removeFilters} />
            <CustomButton text='Apply Filters' altStyle={false} func={applyFilters} />
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
    justifyContent: 'center',
  },
  catList: {
    paddingVertical: 20,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
});
