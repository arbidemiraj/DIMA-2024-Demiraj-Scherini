import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ParticipantChipWithRemove from '@/components/ParticipantChipWithRemove';

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
  const onRemove = jest.fn();

  it('Should render the chip with Remove correctly', async () => {
    // Render the ParticipantChip component
    const { getByText } = render(<ParticipantChipWithRemove userID={userID} username={username} role={role} removeParticipants={onRemove} />);
    // Verify that the username is displayed correctly
    expect(getByText(username)).toBeTruthy();
  });

  it('Should fire remove function correctly', async () => {
    const { getByTestId } = render(<ParticipantChipWithRemove userID={userID} username={username} role={role} removeParticipants={onRemove} />);
    const removeButton = getByTestId('remove-button');
    // Fire the remove button
    fireEvent.press(removeButton);
    // Verify that the remove function is called
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
