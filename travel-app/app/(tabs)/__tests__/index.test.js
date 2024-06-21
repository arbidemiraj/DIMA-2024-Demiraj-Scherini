import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Index from '../index';
import { supabase } from '@/lib/supabase';
import useStore from '@/store/store';

global.alert = jest.fn();

// Mock supabase with closure to maintain call count
jest.mock('@/lib/supabase', () => {
  let callCount = 0;
  const mockTripDetails = [{
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
  },
  {
    id: '2',
    name: 'Test Trip 2',
    description: 'This is a test trip description',
    cover_url: 'https://example.com/image.jpg',
    start_date: '2023-06-01',
    end_date: '2023-06-10',
    score: 4.2,
    category: [{ id: 2, name: 'Category2' }],
    profile_trip: [
      {
        role: 'author',
        profile: { id: '123', username: 'AuthorUser' },
      },
    ],
  }];

  return {
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn(() => 'default')
      .mockImplementationOnce(((callback) => {
        return Promise.resolve(
          callback({
            data: mockTripDetails,
            error: null,
          })
        );
      }))
      .mockImplementationOnce(((callback) => {
        return Promise.resolve(
          callback({
            data: [],
            error: null,
          })
        );
      }))
    },
  };
});

// Mock GooglePlacesInput
jest.mock('@/components/GooglePlacesInput', () => {
  return {
    __esModule: true,
    default: () => <></>,
  };
});

// Mock useStore
jest.mock('@/store/store', () => ({
  __esModule: true,
  default: () => ({
    categoriesList: ['category1', 'category2'],
  }),
}));

describe('Home Screen', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('renders and displays correctly trips on mount', async () => {
    const { getByText, debug } = render(<Index />);
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalled();
      expect(getByText('Test Trip')).toBeTruthy();
      expect(getByText('Test Trip 2')).toBeTruthy();
    });
  });

});
 