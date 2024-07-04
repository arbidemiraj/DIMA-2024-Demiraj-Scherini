import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { renderRouter, screen, router } from 'expo-router/testing-library';
import Signup from '../signup'; // Adjust the import based on your file structure
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

global.alert = jest.fn();

describe('Signup Screen testing', () => {
  const mockSignUpWithEmail = supabase.auth.signUp;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the signup screen correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    const title = getByText('Create an Account');
    expect(title).toBeTruthy();

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

  it('should display an error message when the provided password is too short', async () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    const signupButton = getByText('SignUp');

    // Set up the mock to return the error response
    mockSignUpWithEmail.mockResolvedValue({
      data: { session: null },
      error: { message: 'Password should be at least 6 characters.' },
    });

    const emailInput = getByPlaceholderText('Type in your email...');
    fireEvent.changeText(emailInput, 'wrong@email.it');
    const pswInput = getByPlaceholderText('Password');
    fireEvent.changeText(pswInput, 'short');
    const usernameInput = getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, 'usernameTest');

    fireEvent.press(signupButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Password should be at least 6 characters.');

      // Ensure the mock was called with the correct parameters
      expect(mockSignUpWithEmail).toHaveBeenCalledWith({
        email: 'wrong@email.it',
        password: 'short',
        options: {
          data: {
            username: 'usernameTest',
          },
        },
      });
    });
  });

  it('should display an error message when the email is not formatted correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    const signupButton = getByText('SignUp');

    // Set up the mock to return the error response
    mockSignUpWithEmail.mockResolvedValue({
      data: { session: null },
      error: { message: 'Unable to validate email address: invalid format' },
    });

    const emailInput = getByPlaceholderText('Type in your email...');
    fireEvent.changeText(emailInput, 'wrongemail');
    const pswInput = getByPlaceholderText('Password');
    fireEvent.changeText(pswInput, 'password');
    const usernameInput = getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, 'usernameTest');

    fireEvent.press(signupButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Unable to validate email address: invalid format');

      // Ensure the mock was called with the correct parameters
      expect(mockSignUpWithEmail).toHaveBeenCalledWith({
        email: 'wrongemail',
        password: 'password',
        options: {
          data: {
            username: 'usernameTest',
          },
        },
      });
    });
  });
  it('should display an error message when the username is empty', async () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    const signupButton = getByText('SignUp');

    // Set up the mock to return the error response
    mockSignUpWithEmail.mockResolvedValue({
      data: { session: null },
      error: { message: 'Username cannot be empty' },
    });

    const emailInput = getByPlaceholderText('Type in your email...');
    fireEvent.changeText(emailInput, 'sample@email.com');
    const pswInput = getByPlaceholderText('Password');
    fireEvent.changeText(pswInput, 'password');
    const usernameInput = getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, '');

    fireEvent.press(signupButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Username cannot be empty');
    });
  });
});
