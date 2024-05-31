import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '@/components/CustomButton';

describe('CustomButton', () => {
  let ButtonPropsMock;

  beforeEach(() => {
    ButtonPropsMock = {
      func: jest.fn(),
      text: 'Test',
      altStyle: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('renders correctly', () => {
    const { getByText } = render(<CustomButton {...ButtonPropsMock} />);
    const button = getByText('Test');
    expect(button).toBeTruthy();
  });

  it('fires the function when pressed', () => {
    const { getByText } = render(<CustomButton {...ButtonPropsMock} />);
    const button = getByText('Test');
    fireEvent.press(button);
    expect(ButtonPropsMock.func).toHaveBeenCalledTimes(1);
  });
});
