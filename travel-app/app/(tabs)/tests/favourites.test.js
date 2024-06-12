// Favourites.test.js
import React from 'react';
import { render, waitFor, awaitexpect } from '@testing-library/react-native';
import Favourites from '../favourites';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useIsFocused } from '@react-navigation/native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getAllKeys: jest.fn(() => Promise.resolve(['1', '2'])),
  multiGet: jest.fn(() => Promise.resolve([['1', 'true'], ['2', 'true'], ['3', 'false']])),
}));


jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock TripList component
/*
jest.mock('@/components/TripList', () => (props) => {
    const { Text } = require('react-native');
    <>
      {props.trips.map((trip) => (
        <Text key={trip.id}>{trip.name}</Text>
      ))}
    </>
  });*/

// Mock the Link component from expo-router
jest.mock('expo-router', () => ({
    Link: ({ children, href, testID }) => (
      <mock-Link href={href} testID={testID}>
        {children}
      </mock-Link>
    ),
  }));

// Mock useIsFocused
jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
  }));

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation((callback) => {
      return Promise.resolve(callback({
        data: [
          {
            id: 1,
            cover_url: 'url',
            description: 'description',
            start_date: '2023-06-01',
            end_date: '2023-06-10',
            score: 5,
            name: 'Trip 1',
            category: [],
            profile_trip: [
              {
                role: 'admin',
                profile: {
                  name: 'User 1',
                },
              },
            ],
          },
          {
            id: 1,
            cover_url: 'url',
            description: 'description',
            start_date: '2023-06-01',
            end_date: '2023-06-10',
            score: 5,
            name: 'Trip 2',
            category: [],
            profile_trip: [
              {
                role: 'admin',
                profile: {
                  name: 'User 1',
                },
              },
            ],
          },
        ],
        error: null,
      }));
    }),
  }
  }));

describe('Favourites Component', () => {
  it('renders correctly and fetches favourite trips', async () => {
    useIsFocused.mockReturnValue(true); // Mock the useIsFocused hook to return true

    const { getByText } = render(<Favourites />);

    // Check if trips are rendered
    await waitFor(() => {
      expect(getByText('Trip 1')).toBeTruthy();
      expect(getByText('Trip 2')).toBeTruthy();
    });
  });
});
