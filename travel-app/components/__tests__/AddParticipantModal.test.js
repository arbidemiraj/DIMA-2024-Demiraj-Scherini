import React from 'react';
import { render, rerender, fireEvent, waitFor } from '@testing-library/react-native';
import AddParticipantsModal from '@/components/AddParticipantsModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/provider/AuthProvider';
import { supabase } from '@/lib/supabase';

// Mock the dependencies
jest.mock('@/provider/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn(),
  }));

// Mock ParticipantChipWithRemove component
jest.mock('@/components/ParticipantChipWithRemove', () => (props) => {
    const { Text } = require('react-native');
    return <Text>{props.username}</Text>;
  });

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve(callback({
          data: [{ id: '2', username: 'Jane Doe' }],
          error: null,
        }));
      }),
    }
  }));

const mockParticipants = [
  { id: '1', username: 'user1', role: 'participant' },
  { id: '2', username: 'user2', role: 'participant' },
];

const mockAddParticipant = jest.fn();
const mockRemoveParticipant = jest.fn();
const mockToggleModal = jest.fn();

describe('AddParticipantsModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSafeAreaInsets.mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });
        useAuth.mockReturnValue({ user: { id: 'testUserId' } });
    });

  it('Should render correctly when modal is visible', () => {
    const { getByText, getByPlaceholderText } = render(
      <AddParticipantsModal
        isModalVisible={true}
        toggleModal={mockToggleModal}
        participants={[]}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );

    const participantsText = getByText('Partecipants');
    expect(participantsText).toBeTruthy();

    const searchInput = getByPlaceholderText('Search for a user');
    expect(searchInput).toBeTruthy();
  });

  
  it('Should display participants', () => {
    const { getByText } = render(
      <AddParticipantsModal
        isModalVisible={true}
        toggleModal={mockToggleModal}
        participants={mockParticipants}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );

    expect(getByText('user1')).toBeTruthy();
    expect(getByText('user2')).toBeTruthy();
  });

  it('Should show and hide modal based on isModalVisible prop', () => {
    const { getByText, queryByText, rerender } = render(
      <AddParticipantsModal
        isModalVisible={true}
        toggleModal={mockToggleModal}
        participants={mockParticipants}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );
  
    expect(getByText('Partecipants')).toBeTruthy();
  
    rerender(
      <AddParticipantsModal
        isModalVisible={false}
        toggleModal={mockToggleModal}
        participants={mockParticipants}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );
  
    expect(queryByText('Partecipants')).toBeNull();
  });
  
  it('should close the modal when the close button is pressed', () => {
    const { getByTestId, getByText } = render(
      <AddParticipantsModal
        isModalVisible={true}
        toggleModal={mockToggleModal}
        participants={mockParticipants}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );

    fireEvent.press(getByTestId('close-button'));
    expect(mockToggleModal).toHaveBeenCalled();
  });
  
  it('handles search input and displays results', async () => {

      const { getByPlaceholderText, getByText } = render(
        <AddParticipantsModal
          isModalVisible={true}
          toggleModal={mockToggleModal}
          participants={mockParticipants}
          removeParticipant={mockRemoveParticipant}
          addParticipant={mockAddParticipant}
        />
      );
  
      const searchInput = getByPlaceholderText('Search for a user');
      fireEvent.changeText(searchInput, 'Jane');

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(supabase.select).toHaveBeenCalledWith('id, username');
      expect(supabase.ilike).toHaveBeenCalledWith('username', 'Jane%');
      expect(getByText('Jane Doe')).toBeTruthy();
    });
  
  });


  it('should add participants correctly', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(
      <AddParticipantsModal
        isModalVisible={true}
        toggleModal={mockToggleModal}
        participants={mockParticipants}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );

    const searchInput = getByPlaceholderText('Search for a user');
    fireEvent.changeText(searchInput, 'Jane');

    await waitFor(() => {
        fireEvent.press(getByTestId('add-button'));
        expect(mockAddParticipant).toHaveBeenCalledWith({ id: '2', username: 'Jane Doe', role: 'participant' });
    });
    
  });

  it('should render correctly when there are no participants', () => {
    const { getByText } = render(
      <AddParticipantsModal
        isModalVisible={true}
        toggleModal={mockToggleModal}
        participants={[]}
        removeParticipant={mockRemoveParticipant}
        addParticipant={mockAddParticipant}
      />
    );

    expect(getByText('No other participants added yet...')).toBeTruthy();
  });
});
