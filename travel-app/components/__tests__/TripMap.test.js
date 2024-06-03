import React from 'react';
import { render } from '@testing-library/react-native';
import TripMap from '@/components/TripMap';

// Mock the useSafeAreaInsets hook
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })),
}));

describe('TripMap component tests', () => {
  const setScrollEnabledMock = jest.fn();
  const handleFullScreenMock = jest.fn();

  const visits = [
    {
      id: 1,
      description: 'Visit 1',
      lat: 37.78825,
      long: -122.4324,
      name: 'Visit One',
      trip_id: 123,
      images: [],
    },
    {
      id: 2,
      description: 'Visit 2',
      lat: 37.75825,
      long: -122.4524,
      name: 'Visit Two',
      trip_id: 123,
      images: [],
    },
  ];

  it('Should render the component accordingly', () => {
    const { getByTestId } = render(<TripMap setScrollEnabled={setScrollEnabledMock} visits={visits} isMapFullScreen={false} handleFullScreen={handleFullScreenMock} scrollEnabled={true} />);

    // Check if the map is rendered
    const map = getByTestId('trip-map');
    expect(map).toBeTruthy();

    // Check if the fullscreen button is rendered
    const fullscreenButton = getByTestId('fullscreen-button');
    expect(fullscreenButton).toBeTruthy();
  });

  it('Should render markers', () => {
    const { getByTestId } = render(<TripMap setScrollEnabled={setScrollEnabledMock} visits={visits} isMapFullScreen={false} handleFullScreen={handleFullScreenMock} scrollEnabled={true} />);

    // Check if the map is rendered
    const marker1 = getByTestId('Visit One');
    const marker2 = getByTestId('Visit Two');

    expect(marker1).toBeTruthy();
    expect(marker2).toBeTruthy();
  });

  it('Should render markers with correct coordinates', () => {
    const { getByTestId } = render(<TripMap setScrollEnabled={setScrollEnabledMock} visits={visits} isMapFullScreen={false} handleFullScreen={handleFullScreenMock} scrollEnabled={true} />);

    // Check if the markers have correct coordinates
    const marker1 = getByTestId('Visit One');
    const marker2 = getByTestId('Visit Two');

    expect(marker1.props.coordinate.latitude).toBe(visits[0].lat);
    expect(marker1.props.coordinate.longitude).toBe(visits[0].long);
    expect(marker2.props.coordinate.latitude).toBe(visits[1].lat);
    expect(marker2.props.coordinate.longitude).toBe(visits[1].long);
  });
});
