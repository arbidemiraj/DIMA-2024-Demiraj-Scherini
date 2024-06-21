import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewActivityModal from '@/components/NewActivityModal';
import { useColorScheme } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Alert } from 'react-native';

Alert.alert = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn().mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 }),
  }));

// Mock GooglePlacesAutocomplete as a simple TextInput
jest.mock('react-native-google-places-autocomplete', () => {
    const { forwardRef, useImperativeHandle, useState } = require('react');
    const { TextInput } = require('react-native');
  
    return {
      GooglePlacesAutocomplete: forwardRef((props, ref) => {
        const [text, setText] = useState('');
  
        useImperativeHandle(ref, () => ({
          setAddressText: (address) => setText(address),
        }));
  
        return (
          <TextInput
            value={text}
            onChangeText={(t) => {
              setText(t);
              props.onChangeText && props.onChangeText(t);
            }}
            placeholder={props.placeholder}
            testID="google-places-autocomplete"
          />
        );
      }),
    };
  });

describe('NewActivityModal', () => {
  const mockToggleModal = jest.fn();
  const mockSetActivities = jest.fn();
  const mockAddCategories = jest.fn();

  const activityInfos = {
    title: 'Test Place',
    description: 'Test Description',
    photos: [],
  };

  const props = {
    isModalVisible: true,
    toggleModal: mockToggleModal,
    index: 0,
    activityInfos: activityInfos,
    setActivities: mockSetActivities,
    addCategories: mockAddCategories,
  };

  it('renders correctly when the modal is visible', () => {
    const { getByText } = render(<NewActivityModal {...props} />);
    expect(getByText('Place')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('Photos')).toBeTruthy();
  });

  it('renders activity information correctly', () => {
    const { getByPlaceholderText } = render(<NewActivityModal {...props} />);

    expect(getByPlaceholderText('Type in a place...').props.value).toBe('Test Place');
    expect(getByPlaceholderText('Add a description...').props.value).toBe('Test Description');
  });

  it('calls toggleModal when the back button is pressed', () => {
    const { getByTestId } = render(<NewActivityModal {...props} />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockToggleModal).toHaveBeenCalled();
  });

  it('shows an alert when required fields are empty', () => {
    const { getByTestId } = render(<NewActivityModal {...props} />);
    fireEvent.press(getByTestId('check-button'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Fill all the inputs', [{ text: 'OK', onPress: expect.any(Function) }]);
  });

  it('updates activity state and closes modal on valid submission', async () => {
    const updatedProps = {
      ...props,
      activityInfos: { ...activityInfos, photos: ['photo1.jpg'] },
    };

    const { getByTestId } = render(<NewActivityModal {...updatedProps} />);
    fireEvent.press(getByTestId('check-button'));

    await waitFor(() => expect(mockSetActivities).toHaveBeenCalled());
    expect(mockToggleModal).toHaveBeenCalled();
  });
  
});
