import React from 'react';
import { render } from '@testing-library/react-native';
import TripList from '@/components/TripList';

const tripList = [
  {
    id: '123',
    cover_url: 'https://example.com/image.jpg',
    name: 'Test Trip',
    score: 4.5,
    start_date: '2023-06-01',
    end_date: '2023-06-10',
    partecipants: [
      {
        profile: {
          username: 'testuser',
        },
      },
    ],
  },
  {
    id: '123456',
    cover_url: 'https://example.com/image2.jpg',
    name: 'Test Trip2',
    score: 4.5,
    start_date: '2024-06-01',
    end_date: '2024-06-10',
    partecipants: [
      {
        profile: {
          username: 'testuser',
        },
      },
    ],
  },
];

func = jest.fn();

describe('TripList component test', () => {
  it('Should render the trips correctly', async () => {
    const { getByText } = render(<TripList trips={tripList} isLoading={false} handleEndReached={func} />);
    expect(getByText('Test Trip')).toBeTruthy();
    expect(getByText('Test Trip2')).toBeTruthy();
  });
});
