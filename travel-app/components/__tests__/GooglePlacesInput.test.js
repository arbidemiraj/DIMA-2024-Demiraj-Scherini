import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GooglePlacesInput from '@/components/GooglePlacesInput';

// Mock the dependencies
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

  // Mock the Iconify component
jest.mock('react-native-iconify', () => ({
    Iconify: ({ icon, size, color, testID }) => <mock-Iconify icon={icon} size={size} color={color} testID={testID} />,
  }));

  jest.mock('react-native-google-places-autocomplete', () => {
    const React = require('react');
    const { TextInput } = require('react-native');
  
    return {
      GooglePlacesAutocomplete: React.forwardRef((props, ref) => (
        <TextInput
          testID="google-places-autocomplete"
          placeholder='Discover by place...'
          onChangeText={(text) => props.onPress({ description: text }, { geometry: { location: { lat: 0, lng: 0 } } })}
          ref={ref}
        />
      )),
    };
  });


  // Mock the CategoriesBottomSheet component
jest.mock('@/components/CategoriesBottomSheet', () => {
    const React = require('react');
    const { View, Button } = require('react-native');
  
    return {
      __esModule: true,
      default: React.forwardRef(({ toggleOverlay, applyFilters, removeFilters, children }, ref) => (
        <View ref={ref}>
          <Button title="Toggle" onPress={toggleOverlay} />
          <Button title="Apply" onPress={applyFilters} />
          <Button title="Remove" onPress={removeFilters} />
          {children}
        </View>
      )),
    };
  });

jest.mock('@/store/store', () => ({
  __esModule: true,
  default: () => ({
    cleanList: jest.fn(),
    categoriesList: ['food', 'sport'],
  }),
}));

describe('GooglePlacesInput', () => {
  const toggleOverlay = jest.fn();
  const mockHandlePlaceSelect = jest.fn();
  const mockHandleCategorySelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <GooglePlacesInput
        toggleOverlay={toggleOverlay}
        handlePlaceSelect={mockHandlePlaceSelect}
        handleCategorySelect={mockHandleCategorySelect}
      />
    );

    expect(getByPlaceholderText('Discover by place...')).toBeTruthy();
    expect(getByText('sport')).toBeTruthy();
    expect(getByText('food')).toBeTruthy();
  });

  
  it('Should call handlePlaceSelect when a place is selected', () => {
    const { getByPlaceholderText } = render(
      <GooglePlacesInput
        toggleOverlay={toggleOverlay}
        handlePlaceSelect={mockHandlePlaceSelect}
        handleCategorySelect={mockHandlePlaceSelect}
      />
    );

    const input = getByPlaceholderText('Discover by place...');
    fireEvent.changeText(input, 'New Place');

    expect(mockHandlePlaceSelect).toHaveBeenCalledWith(
      { description: 'New Place' },
      { geometry: { location: { lat: 0, lng: 0 } } }
    );
  });  
});
