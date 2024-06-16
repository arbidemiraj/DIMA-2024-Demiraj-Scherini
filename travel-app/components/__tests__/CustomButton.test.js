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

  it('renders with alt style false', () => {
    ButtonPropsMock.altStyle = false;
    const { getByTestId, getByText } = render(<CustomButton {...ButtonPropsMock} />);

    // check button and text color
    const button = getByTestId('btn-wrapper');
    expect(button.props.style[1][1].backgroundColor).toBe('#171717');

    const buttonText = getByText('Test');
    expect(buttonText.props.style[1][1].color).toBe('#F5F5F5');
  });

  it('renders with alt style true', () => {
    ButtonPropsMock.altStyle = true;
    const { getByTestId, getByText } = render(<CustomButton {...ButtonPropsMock} />);

    // check button and text color
    const button = getByTestId('btn-wrapper');
    expect(button.props.style[1][1].backgroundColor).toBe('transparent');

    const buttonText = getByText('Test');
    expect(buttonText.props.style[1][1].color).toBe('#262626');
  });
});
