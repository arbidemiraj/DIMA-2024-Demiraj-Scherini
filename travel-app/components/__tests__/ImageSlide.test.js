import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ImageSlide from '@/components/ImageSlide'; // Adjust the import path accordingly
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { usePickImage } from '@/hooks/usePickImage';
import { useSharedValue } from 'react-native-reanimated';

// Mock necessary hooks and components
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    return {
      ...Reanimated,
      useSharedValue: jest.fn(() => ({ value: 0 })),
      useAnimatedStyle: jest.fn((callback) => callback()),
      useAnimatedScrollHandler: jest.fn().mockImplementation((handlers) => (event) => {
        handlers.onScroll({
          contentOffset: {
            x: event.contentOffset.x,
          },
        });
      }),
      interpolate: jest.fn(),
      interpolateColor: jest.fn(),
    };
  });

jest.mock('@/hooks/usePickImage', () => ({
  usePickImage: jest.fn(),
}));

jest.mock('@/components/CustomButton', () => {
  const { Pressable, Text } = require('react-native');
  return jest.fn().mockImplementation(({ func, text }) => (
    <Pressable testID="add-image-button" onPress={func}>
      <Text>{text}</Text>
    </Pressable>
  ));
});

describe('ImageSlide', () => {
  const setActivityState = jest.fn();
  const addCategories = jest.fn();

  const activityState = {
    title: 'Sample Activity',
    description: 'This is a sample activity description',
    photos: ['https://via.placeholder.com/150', 'https://via.placeholder.com/200'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correctly', () => {
    const { getByText, getAllByTestId } = render(
      <ImageSlide
        setActivityState={setActivityState}
        activityState={activityState}
        addCategories={addCategories}
      />
    );

    activityState.photos.forEach((_, index) => {
      expect(getAllByTestId(`image-slide-${index}`)).toBeTruthy();
    });

    expect(getByText('Pick an image from camera')).toBeTruthy();
  });

  
  it('Should call setActivityState when an image is removed', () => {
    const { getByTestId } = render(
      <ImageSlide
        setActivityState={setActivityState}
        activityState={activityState}
        addCategories={addCategories}
      />
    );

    const removeButton = getByTestId('remove-button-0');
    fireEvent.press(removeButton);

    expect(setActivityState).toHaveBeenCalledWith(expect.any(Function));
  });

  
  it('Should call usePickImage when the add image button is pressed', () => {
    const { getByText } = render(
      <ImageSlide
        setActivityState={setActivityState}
        activityState={activityState}
        addCategories={addCategories}
      />
    );

    const addButton = getByText('Pick an image from camera');
    fireEvent.press(addButton);

    expect(usePickImage).toHaveBeenCalled();
  });

/*
  it('should handle scroll animation correctly', () => {
    const { getByTestId } = render(
      <ImageSlide
        setActivityState={setActivityState}
        activityState={activityState}
        addCategories={addCategories}
      />
    );

    const scrollView = getByTestId('scroll-view');

    fireEvent.scroll(scrollView, {
        nativeEvent: {
          contentOffset: {
            x: Dimensions.get('screen').width * 0.75,
          },
        },
      });
  
      // Verify that scrollOffset has been updated correctly
      const scrollOffset = require('react-native-reanimated').useSharedValue();
      expect(scrollOffset.value).toBe(Dimensions.get('screen').width * 0.75);
  });*/
});
