import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Settings from '../settings'; // Adjust the import based on your file structure
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.alert = jest.fn();

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

// Mock useAuth
jest.mock('@/provider/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Settings Screen', () => {
  const mockUser = {
    id: '123',
    username: 'TestUser',
    biography: 'Test Bio',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });

    AsyncStorage.getItem.mockResolvedValue(null);
    supabase.from.mockReturnThis();
    supabase.select.mockReturnThis();
    supabase.update.mockReturnThis();
    supabase.eq.mockReturnThis();
    supabase.single.mockResolvedValue({ data: mockUser, error: null });
  });

  it('should render the settings screen correctly', async () => {
    const { getByText, getByTestId } = render(<Settings />);

    await waitFor(() => {
      const usernameInput = getByTestId('usernameInput');
      const bioInput = getByTestId('bioInput');
      const logoutButton = getByText('Logout from your Account');
      const darkModeSwitch = getByText('Dark Theme');
      const lightModeSwitch = getByText('Light Theme');
      const defaultModeSwitch = getByText('System Default');

      expect(usernameInput).toBeTruthy();
      expect(bioInput).toBeTruthy();
      expect(logoutButton).toBeTruthy();
      expect(darkModeSwitch).toBeTruthy();
      expect(lightModeSwitch).toBeTruthy();
      expect(defaultModeSwitch).toBeTruthy();
    });
  });

  it('should update the username correctly', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      const usernameInput = getByTestId('usernameInput');
      fireEvent.changeText(usernameInput, 'NewUsername');
      expect(usernameInput.props.value).toBe('NewUsername');

      // Find and press the update button (make sure the identifier is correct)
      const updateButton = getByTestId('update-name-btn');
      fireEvent.press(updateButton);

      expect(global.alert).toHaveBeenCalledWith('You have successfully updated your name!');

      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(supabase.update).toHaveBeenCalledWith({ username: 'NewUsername' });
      expect(supabase.eq).toHaveBeenCalledWith('id', mockUser.id);
      expect(supabase.select).toHaveBeenCalled();
    });
  });

  it('should update the biography correctly', async () => {
    const { getByTestId } = render(<Settings />);

    await waitFor(() => {
      const biographyInput = getByTestId('bioInput');
      fireEvent.changeText(biographyInput, 'NewBio');
      expect(biographyInput.props.value).toBe('NewBio');

      // Find and press the update button
      const updateButton = getByTestId('update-bio-btn');
      fireEvent.press(updateButton);

      expect(global.alert).toHaveBeenCalledWith('You have successfully updated your bio!');

      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(supabase.update).toHaveBeenCalledWith({ biography: 'NewBio' });
      expect(supabase.eq).toHaveBeenCalledWith('id', mockUser.id);
      expect(supabase.select).toHaveBeenCalled();
    });
  });

  it('should logout correctly', async () => {
    const { getByText } = render(<Settings />);
    const logoutButton = getByText('Logout from your Account');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
