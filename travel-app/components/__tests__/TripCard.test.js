import React from 'react';
import { render } from '@testing-library/react-native';
import TripCard from '@/components/TripCard';

// Mock useDateFormatter hook
jest.mock('@/hooks/useDateFormatter', () => jest.fn((date) => date));

// Mock Link component from expo-router
jest.mock('expo-router', () => ({
  Link: ({ children, href, asChild, testID }) => (
    <mock-Link href={href} testID={testID}>
      {children}
    </mock-Link>
  ),
}));

describe('TripCard component test', () => {
  const trip = {
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
  };

  it('Should render the trip details correctly', async () => {
    const { getByText } = render(<TripCard trip={trip} />);

    // Check if the trip name is displayed
    expect(getByText(trip.name)).toBeTruthy();

    // Check if the author is displayed
    expect(getByText(`Author - ${trip.partecipants[0].profile.username}`)).toBeTruthy();

    // Check if the dates are displayed
    expect(getByText(`From ${trip.start_date} to ${trip.end_date}`)).toBeTruthy();

    // Check if the score is displayed
    expect(getByText(trip.score.toFixed(1))).toBeTruthy();
  });

  it('Should render the trip cover image correctly', async () => {
    const { getByTestId } = render(<TripCard trip={trip} />);

    // Check if the cover image is displayed
    const image = getByTestId('trip-cover-image');
    expect(image.props.source.uri).toBe(trip.cover_url);
  });

  it('Should link to the correct trip profile', async () => {
    const { getByTestId } = render(<TripCard trip={trip} />);

    // Check if the link href is correct
    const link = getByTestId('profile-link');
    expect(link.props.href).toEqual({ pathname: '/(trip)/[id]', params: { id: trip.id } });
  });
});
