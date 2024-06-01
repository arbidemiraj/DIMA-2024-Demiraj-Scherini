import React from 'react';
import { render } from '@testing-library/react-native';
import ParticipantChip from '@/components/ParticipantChip';

// Mock the Link component from expo-router
jest.mock('expo-router', () => ({
  Link: ({ children, href, testID }) => (
    <mock-Link href={href} testID={testID}>
      {children}
    </mock-Link>
  ),
}));

// Mock the Iconify component
jest.mock('react-native-iconify', () => ({
  Iconify: ({ icon, size, color, testID }) => <mock-Iconify icon={icon} size={size} color={color} testID={testID} />,
}));

describe('ParticipantChip component test', () => {
  // Mock the user data
  const userID = '123';
  const username = 'testuser';
  const role = 'author';

  it('Should render the chip correctly', async () => {
    // Render the ParticipantChip component
    const { getByText } = render(<ParticipantChip userID={userID} username={username} role={role} />);
    // Verify that the username is displayed correctly
    expect(getByText(username)).toBeTruthy();
  });

  it('Should render the chip icon with the correct role', async () => {
    const { getByTestId } = render(<ParticipantChip userID={userID} username={username} role={role} />);
    const icon = getByTestId('role-icon');

    // Verify that the icon corresponds to the role
    if (role === 'author') {
      expect(icon.props.icon).toBe('iconoir:user-star');
    } else {
      expect(icon.props.icon).toBe('iconoir:user');
    }
  });

  it('Should link to the correct user profile', async () => {
    const { getByTestId } = render(<ParticipantChip userID={userID} username={username} role={role} />);
    const link = getByTestId('profile-link');
    // Verify that the link href is correct
    expect(link.props.href).toEqual({ pathname: '/(profile)/[id]', params: { id: userID } });
  });
});
