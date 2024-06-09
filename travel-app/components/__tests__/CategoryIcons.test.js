import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FoodIcon, SportIcon, NatureIcon, AdventureIcon, LuxoryIcon, RoadTripIcon, CultureIcon, MuseumIcon, MonumentIcon, WildlifeIcon } from '@/components/CategoryIcons';
import useStore from '@/store/store';

jest.mock('@/store/store');

describe('CategoryIcons Component', () => {
  const mockFunc = jest.fn();

  beforeEach(() => {
    useStore.mockReturnValue({
      categoriesList: [],
    });
  });

  it('renders FoodIcon correctly', () => {
    const { getByTestId } = render(<FoodIcon size={24} func={mockFunc} testID="food-icon" />);
    expect(getByTestId('food-icon')).toBeTruthy();
  });

  it('handles press event for FoodIcon', () => {
    const { getByTestId } = render(<FoodIcon size={24} func={mockFunc} testID="food-icon" />);
    fireEvent.press(getByTestId('food-icon'));
    expect(mockFunc).toHaveBeenCalledWith('food');
  });

  it('renders SportIcon correctly', () => {
    const { getByTestId } = render(<SportIcon size={24} func={mockFunc} testID="sport-icon" />);
    expect(getByTestId('sport-icon')).toBeTruthy();
  });

  it('handles press event for SportIcon', () => {
    const { getByTestId } = render(<SportIcon size={24} func={mockFunc} testID="sport-icon" />);
    fireEvent.press(getByTestId('sport-icon'));
    expect(mockFunc).toHaveBeenCalledWith('sport');
  });

  it('renders NatureIcon correctly', () => {
    const { getByTestId } = render(<NatureIcon size={24} func={mockFunc} testID="sport-icon" />);
    expect(getByTestId('sport-icon')).toBeTruthy();
  });

  it('handles press event for NatureIcon', () => {
    const { getByTestId } = render(<NatureIcon size={24} func={mockFunc} testID="nature-icon" />);
    fireEvent.press(getByTestId('nature-icon'));
    expect(mockFunc).toHaveBeenCalledWith('nature');
  });

  it('renders AdventureIcon correctly', () => {
    const { getByTestId } = render(<AdventureIcon size={24} func={mockFunc} testID="adventure-icon" />);
    expect(getByTestId('adventure-icon')).toBeTruthy();
  });

  it('handles press event for AdventureIcon', () => {
    const { getByTestId } = render(<AdventureIcon size={24} func={mockFunc} testID="sport-icon" />);
    fireEvent.press(getByTestId('sport-icon'));
    expect(mockFunc).toHaveBeenCalledWith('adventure');
  });

  it('renders LuxoryIcon correctly', () => {
    const { getByTestId } = render(<LuxoryIcon size={24} func={mockFunc} testID="luxury-icon" />);
    expect(getByTestId('luxury-icon')).toBeTruthy();
  });

  it('handles press event for LuxoryIcon', () => {
    const { getByTestId } = render(<LuxoryIcon size={24} func={mockFunc} testID="luxury-icon" />);
    fireEvent.press(getByTestId('luxury-icon'));
    expect(mockFunc).toHaveBeenCalledWith('luxury');
  });

  it('renders RoadTripIcon correctly', () => {
    const { getByTestId } = render(<RoadTripIcon size={24} func={mockFunc} testID="road-trip-icon" />);
    expect(getByTestId('road-trip-icon')).toBeTruthy();
  });

  it('handles press event for RoadTripIcon', () => {
    const { getByTestId } = render(<RoadTripIcon size={24} func={mockFunc} testID="road-trip-icon" />);
    fireEvent.press(getByTestId('road-trip-icon'));
    expect(mockFunc).toHaveBeenCalledWith('roadTrip');
  });

  it('renders CultureIcon correctly', () => {
    const { getByTestId } = render(<CultureIcon size={24} func={mockFunc} testID="culture-icon" />);
    expect(getByTestId('culture-icon')).toBeTruthy();
  });

  it('handles press event for CultureIcon', () => {
    const { getByTestId } = render(<CultureIcon size={24} func={mockFunc} testID="culture-icon" />);
    fireEvent.press(getByTestId('culture-icon'));
    expect(mockFunc).toHaveBeenCalledWith('culture');
  });

  it('renders MuseumIcon correctly', () => {
    const { getByTestId } = render(<MuseumIcon size={24} func={mockFunc} testID="museum-icon" />);
    expect(getByTestId('museum-icon')).toBeTruthy();
  });

  it('handles press event for MuseumIcon', () => {
    const { getByTestId } = render(<MuseumIcon size={24} func={mockFunc} testID="museum-icon" />);
    fireEvent.press(getByTestId('museum-icon'));
    expect(mockFunc).toHaveBeenCalledWith('museum');
  });

  it('renders MonumentIcon correctly', () => {
    const { getByTestId } = render(<MonumentIcon size={24} func={mockFunc} testID="monument-icon" />);
    expect(getByTestId('monument-icon')).toBeTruthy();
  });

  it('handles press event for MonumentIcon', () => {
    const { getByTestId } = render(<MonumentIcon size={24} func={mockFunc} testID="monument-icon" />);
    fireEvent.press(getByTestId('monument-icon'));
    expect(mockFunc).toHaveBeenCalledWith('monument');
  });

  it('renders WildlifeIcon correctly', () => {
    const { getByTestId } = render(<WildlifeIcon size={24} func={mockFunc} testID="wildlife-icon" />);
    expect(getByTestId('wildlife-icon')).toBeTruthy();
  });

  it('handles press event for WildlifeIcon', () => {
    const { getByTestId } = render(<WildlifeIcon size={24} func={mockFunc} testID="wildlife-icon" />);
    fireEvent.press(getByTestId('wildlife-icon'));
    expect(mockFunc).toHaveBeenCalledWith('wildlife');
  });
});
