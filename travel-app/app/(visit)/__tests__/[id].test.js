import React, { useCallback } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Visit from '../[id]';
import { supabase } from '@/lib/supabase';
import { renderRouter, screen } from 'expo-router/testing-library';

// Mock the necessary modules and dependencies
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return {
    BottomSheetModal: React.forwardRef(({ children, ...props }, ref) => {
      return (
        <div ref={ref} {...props}>
          {children}
        </div>
      );
    }),
    BottomSheetView: React.forwardRef(({ children, ...props }, ref) => {
      return (
        <div ref={ref} {...props}>
          {children}
        </div>
      );
    }),
    BottomSheetTextInput: React.forwardRef(({ children, ...props }, ref) => {
      return (
        <input ref={ref} {...props}>
          {children}
        </input>
      );
    }),
  };
});
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

const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  addListener: jest.fn(() => jest.fn()),
};
// Mock useFocusEffect and useLocalSearchParams
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: () => ({ id: '1' }),
}));

const mockVisitData = {
  id: '1',
  description: 'This is a visit description',
  lat: 12.34,
  long: 56.78,
  name: 'Visit Name',
  trip_id: 'trip1',
  image: [{ url: 'http://example.com/image1.jpg' }],
};

const mockCommentsData = [
  {
    id: 1,
    comment: 'This is the first comment',
    profile: {
      biography: 'bio1',
      id: 'user-1',
      updated_at: null,
      username: 'User1',
    },
  },
  {
    id: 2,
    comment: 'This the second comment',
    profile: {
      biography: 'bio2',
      id: 'user-2',
      updated_at: null,
      username: 'User2',
    },
  },
  {
    id: 3,
    comment: 'This is the third comment',
    profile: {
      biography: 'bio3',
      id: 'user-3',
      updated_at: null,
      username: 'User3',
    },
  },
];

describe('Visit Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    supabase.from.mockImplementation((table) => {
      if (table === 'visit') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockVisitData, error: null }),
        };
      }

      if (table === 'comment') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: mockCommentsData, error: null })),
        };
      }

      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: 'Table not mocked' }),
      };
    });
  });

  it('should display visit details correctly', async () => {
    const VisitComp = jest.fn(() => <Visit />);
    const { getByText, queryAllByText } = renderRouter(
      {
        index: VisitComp,
        '/(visit)/1': VisitComp,
      },
      {
        initialUrl: '/(visit)/1',
      }
    );

    // Wait for the visit details to be rendered
    await waitFor(() => {
      expect(getByText(mockVisitData.name)).toBeTruthy();
      expect(getByText(mockVisitData.description)).toBeTruthy();
    });
  });

  it('should display comments correctly', async () => {
    const VisitComp = jest.fn(() => <Visit />);
    const { getByText, queryAllByText } = renderRouter(
      {
        index: VisitComp,
        '/(visit)/1': VisitComp,
      },
      {
        initialUrl: '/(visit)/1',
      }
    );
    // Check if comments are rendered
    await waitFor(() => {
      // first and second comments are found twice (once in the page once in the bottom sheet)
      expect(queryAllByText(mockCommentsData[0].profile.username).length).toBe(2);
      expect(queryAllByText(mockCommentsData[0].comment).length).toBe(2);

      expect(queryAllByText(mockCommentsData[1].profile.username).length).toBe(2);
      expect(queryAllByText(mockCommentsData[1].comment).length).toBe(2);

      // third comment is found only once (in the bottom sheet)
      expect(queryAllByText(mockCommentsData[2].profile.username).length).toBe(1);
      expect(queryAllByText(mockCommentsData[2].comment).length).toBe(1);
    });
  });
});
