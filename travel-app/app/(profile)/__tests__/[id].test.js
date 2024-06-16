import React from 'react';
import { waitFor } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { renderRouter } from 'expo-router/testing-library';
import UserProfilePage from '../[id]';

// Mock the necessary modules and dependencies
global.alert = jest.fn();

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock the useAuth hook
jest.mock('@/provider/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'user123' },
  }),
}));

// Mock useFocusEffect and useLocalSearchParams
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: () => ({ id: '1' }),
}));

const mockUserData = {
  id: 'user-1',
  username: 'AuthorUser',
  biography: 'bio1',
  updated_at: null,
};

const mockTripsData = [
  {
    id: '1',
    name: 'Test Trip',
    description: 'This is a test trip description',
    cover_url: 'https://example.com/image.jpg',
    start_date: '2023-06-01',
    end_date: '2023-06-10',
    score: 4.5,
    category: [{ id: 1, name: 'wildlife' }],
    profile_trip: [
      {
        role: 'author',
        profile: { id: 'user-1', username: 'AuthorUser' },
      },
    ],
  },
  {
    id: '2',
    name: 'Test Trip 2',
    description: 'This is the second test trip description',
    cover_url: 'https://example.com/image2.jpg',
    start_date: '2023-06-11',
    end_date: '2023-06-20',
    score: 4.0,
    category: [{ id: 1, name: 'food' }],
    profile_trip: [
      {
        role: 'author',
        profile: { id: 'user-1', username: 'AuthorUser' },
      },
    ],
  },
];

describe('UserProfilePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    supabase.from.mockImplementation((table) => {
      if (table === 'profile') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockUserData, error: null }),
        };
      }

      if (table === 'trip') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockTripsData, error: null })),
        };
      }

      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: 'Table not mocked' }),
      };
    });
  });

  it('should display user data correctly', async () => {
    const ProfilePage = jest.fn(() => <UserProfilePage />);
    const { getByText } = renderRouter(
      {
        index: ProfilePage,
        '/(profile)/1': ProfilePage,
      },
      {
        initialUrl: '/(profile)/1',
      }
    );

    await waitFor(() => {
      expect(getByText('Biography')).toBeTruthy();
      expect(getByText(mockUserData.biography)).toBeTruthy();
    });
  });

  it('should display visits details correctly', async () => {
    const ProfilePage = jest.fn(() => <UserProfilePage />);
    const { getByTestId } = renderRouter(
      {
        index: ProfilePage,
        '/(profile)/1': ProfilePage,
      },
      {
        initialUrl: '/(profile)/1',
      }
    );

    await waitFor(() => {
      expect(getByTestId(mockTripsData[0].cover_url)).toBeTruthy();
      expect(getByTestId(mockTripsData[1].cover_url)).toBeTruthy();
    });
  });
});
