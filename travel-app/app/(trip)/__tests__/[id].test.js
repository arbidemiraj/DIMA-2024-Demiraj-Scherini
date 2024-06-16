import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Trip from '../[id]'; // Adjust the import based on your file structure
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

global.alert = jest.fn();

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock the Link component from expo-router
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  Stack: {
    Screen: jest.fn(() => null),
  },
  Link: ({ children, href, testID }) => (
    <mock-Link href={href} testID={testID}>
      {children}
    </mock-Link>
  ),
  useLocalSearchParams: jest.fn().mockReturnValue({ id: '1' }),
  useRouter: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Trip Screen', () => {
  const mockTripDetails = {
    id: '1',
    name: 'Test Trip',
    description: 'This is a test trip description',
    cover_url: 'https://example.com/image.jpg',
    start_date: '2023-06-01',
    end_date: '2023-06-10',
    score: 4.5,
    category: [{ id: 1, name: 'Category1' }],
    profile_trip: [
      {
        role: 'author',
        profile: { id: '123', username: 'AuthorUser' },
      },
    ],
  };

  const mockVisits = [
    {
      id: '1',
      name: 'Visit 1',
      description: 'Description 1',
      lat: 0,
      long: 0,
      trip_id: '1',
      image: [{ url: 'https://example.com/visit1.jpg' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(false));

    useSafeAreaInsets.mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });

    // Mock supabase calls
    supabase.from.mockImplementation((table) => {
      if (table === 'trip') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockTripDetails, error: null }),
        };
      }
      if (table === 'visit') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockVisits, error: null })),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: 'Table not mocked' }),
      };
    });
  });

  it('should render the trip data correctly', async () => {
    const { getByText, getByTestId } = render(<Trip />);

    await waitFor(() => {
      // Expect the different elements to be rendered
      expect(getByText('Test Trip')).toBeTruthy();
      expect(getByText('This is a test trip description')).toBeTruthy();
      expect(getByTestId('cover-image')).toBeTruthy();
    });
  });

  it('should render visits data correctly', async () => {
    const { getAllByTestId } = render(<Trip />);

    await waitFor(() => {
      // Check that the visit images are rendered
      const visitImages = getAllByTestId('visit-image');
      expect(visitImages.length).toBe(mockVisits.length);
      visitImages.forEach((image, index) => {
        expect(image.props.source.uri).toBe(mockVisits[index].image[0].url);
      });
    });
  });
});
