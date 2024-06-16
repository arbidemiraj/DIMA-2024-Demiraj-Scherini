import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { renderRouter, screen, router } from 'expo-router/testing-library';
import Login from '../login'; // Adjust the import based on your file structure
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

global.alert = jest.fn();

describe('Login Screen', () => {
  const mockSignInWithPassword = supabase.auth.signInWithPassword;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login screen correctly', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);

    // Check if the TextInput for email is rendered
    const emailInput = getByPlaceholderText('Type in your email...');
    expect(emailInput).toBeTruthy();

    // Check if the TextInput for password is rendered
    const passwordInput = getByPlaceholderText('Password');
    expect(passwordInput).toBeTruthy();

    // Check if the login button is rendered
    const loginButton = getByText('Login');
    expect(loginButton).toBeTruthy();
  });

  it('should display an error message when incorrect credentials are provided', async () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    const loginButton = getByText('Login');

    // Set up the mock to return the error response
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Invalid login credentials' },
    });

    const emailInput = getByPlaceholderText('Type in your email...');
    fireEvent.changeText(emailInput, 'wrong@email.it');
    const pswInput = getByPlaceholderText('Password');
    fireEvent.changeText(pswInput, 'wrong');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Email or password are incorrect');

      // Ensure the mock was called with the correct parameters
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'wrong@email.it',
        password: 'wrong',
      });
    });
  });

  it('should handle login correctly', async () => {
    const LoginComp = jest.fn(() => <Login />);

    const { getByText, getByPlaceholderText } = renderRouter(
      {
        index: LoginComp,
        '(auth)/login': LoginComp,
      },
      {
        initialUrl: '(auth)/login',
      }
    );

    const loginButton = getByText('Login');

    // Set up the mock to return the error response
    mockSignInWithPassword.mockResolvedValue({
      data: { session: 'test', user: 'test' },
      error: null,
    });

    const emailInput = getByPlaceholderText('Type in your email...');
    fireEvent.changeText(emailInput, 'correct@email.it');
    const pswInput = getByPlaceholderText('Password');
    fireEvent.changeText(pswInput, 'correct');

    fireEvent.press(loginButton);

    await waitFor(() => {
      // Ensure the mock was called with the correct parameters
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'correct@email.it',
        password: 'correct',
      });

      expect(screen).toHavePathname('/(tabs)');
    });
  });
});
