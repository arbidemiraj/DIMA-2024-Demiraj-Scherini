import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {ExternalLink} from '@/components/ExternalLink';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

jest.mock('expo-web-browser');

describe('ExternalLink Component', () => {
  beforeAll(() => {
    // Mock Platform OS
    Platform.OS = 'ios'; // or 'android' or 'web' as needed
  });

  it('Should handle onPress correctly', () => {
    const props = {
      href: 'https://example.com',
    };

    // Create a mock event with preventDefault method
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    // Mock WebBrowser.openBrowserAsync
    WebBrowser.openBrowserAsync.mockResolvedValue({ type: 'success' });

    const { getByTestId } = render(<ExternalLink testID={'link'} {...props}>Link</ExternalLink>);

    fireEvent.press(getByTestId('link'), mockEvent);

    // Verify preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();

    // Verify openBrowserAsync was called with the correct href
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith('https://example.com');
  });
});

