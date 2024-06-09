import React, {createRef} from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FoodIcon, SportIcon, NatureIcon, AdventureIcon, LuxoryIcon, RoadTripIcon, CultureIcon, MuseumIcon, MonumentIcon, WildlifeIcon } from '@/components/CategoryIcons';
import useStore from '@/store/store';
import CategoriesBottomSheet from '@/components/CategoriesBottomSheet';
jest.mock('@/store/store');

// Mock the necessary modules and dependencies
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return {
    BottomSheetModal: React.forwardRef(({ children, ...props }, ref) => {
      return <div ref={ref} {...props}>{children}</div>;
    }),
    BottomSheetTextInput: React.forwardRef(({ children, ...props }, ref) => {
      return <input ref={ref} {...props}>{children}</input>;
    }),
  };
});

jest.mock('@/store/store', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/components/Themed', () => ({
  Text: (props) => <text {...props} />,
  View: (props) => <view {...props} />,
  BottomSheetView: (props) => <view {...props} />
}));

jest.mock('@/hooks/useFontSize', () => ({
  useFontSize: jest.fn().mockReturnValue(16),
  useFontSizeTitle: jest.fn().mockReturnValue(20)
}));

describe('CategoryBottomSheet Component', () => {
  const iconData = [
    { icon: <FoodIcon />, testId: 'food-icon', category: 'food' },
    { icon: <SportIcon />, testId: 'sport-icon', category: 'sport' },
    { icon: <NatureIcon />, testId: 'nature-icon', category: 'nature' },
    { icon: <AdventureIcon />, testId: 'adventure-icon', category: 'adventure' },
    { icon: <LuxoryIcon />, testId: 'luxury-icon', category: 'luxury' },
    { icon: <RoadTripIcon />, testId: 'road-trip-icon', category: 'roadTrip' },
    { icon: <CultureIcon />, testId: 'culture-icon', category: 'culture' },
    { icon: <MuseumIcon />, testId: 'museum-icon', category: 'museum' },
    { icon: <MonumentIcon />, testId: 'monument-icon', category: 'monument' },
    { icon: <WildlifeIcon />, testId: 'wildlife-icon', category: 'wildlife' }
  ];

  const toggleOverlay = jest.fn();
  const applyFilters = jest.fn();
  const removeFilters = jest.fn();
  const mockToggleCategory = jest.fn();
  const bottomSheetModalRef = createRef();

  beforeEach(() => {
    useStore.mockReturnValue({
      categoriesList: [],
      toggleCategory: mockToggleCategory,
    });
  });

  it('Should render correctly and handles category toggle', () => {
        const { getByTestId } = render(
        <CategoriesBottomSheet
            ref={bottomSheetModalRef}
            toggleOverlay={toggleOverlay}
            applyFilters={applyFilters}
            removeFilters={removeFilters}
        />
        );

        iconData.forEach(({ testId, category }) => {
          const icon = getByTestId(testId);
          expect(icon).toBeTruthy();
          fireEvent.press(icon);
          expect(mockToggleCategory).toHaveBeenCalledWith(category);
        });
    });

    it('Should handle apply filters button click correctly', () => {
    const { getByTestId } = render(
      <CategoriesBottomSheet
        ref={bottomSheetModalRef}
        toggleOverlay={toggleOverlay}
        applyFilters={applyFilters}
        removeFilters={removeFilters}
      />
    );

    // Simulate clicking on Apply Filters button
    const applyButton = getByTestId('apply');
    fireEvent.press(applyButton);
    expect(applyFilters).toHaveBeenCalled();
    });

    it('Should handle remove filters button click correctly', () => {
      const toggleOverlay = jest.fn();
      const applyFilters = jest.fn();
      const removeFilters = jest.fn();
  
      const { getByTestId } = render(
        <CategoriesBottomSheet
          ref={bottomSheetModalRef}
          toggleOverlay={toggleOverlay}
          applyFilters={applyFilters}
          removeFilters={removeFilters}
        />
      );
  
      // Simulate clicking on Remove Filters button
      const removeButton = getByTestId('remove');
      fireEvent.press(removeButton);
      expect(removeFilters).toHaveBeenCalled();
    });
});
