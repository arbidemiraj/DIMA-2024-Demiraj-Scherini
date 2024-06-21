// __tests__/NewJournal.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewJournal from '../newJournal';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

Alert.alert = jest.fn();

// Mock necessary modules and hooks
jest.mock('expo-router', () => ({
    ...jest.requireActual('expo-router'),
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
    })),
    Stack: {
        Screen: jest.fn(({ options, children }) => {
            const { headerRight } = options || {};
            return (
                <>
                    {headerRight && headerRight()}
                    {children}
                </>
            );
        }),
    },
}));


// Mock the AddParticipantsModal component
jest.mock('@/components/AddParticipantsModal', () => {
    const React = require('react');
    const { View, Button } = require('react-native');

    return ({ isModalVisible, toggleModal, addParticipant }) => {
        if (!isModalVisible) return null;

        const mockParticipant = { id: '1', username: 'testuser', role: 'participant' };

        return (
            <View>
                <Button
                    testID='add-participant-btn'
                    title="Add Participant"
                    onPress={() => {
                        addParticipant(mockParticipant);
                        toggleModal();
                    }}
                />
            </View>
        );
    };
});

// Mock the NewActivityModal component
jest.mock('@/components/NewActivityModal', () => {
    const React = require('react');
    const { View, Button, TextInput } = require('react-native');

    return ({ isModalVisible, toggleModal, setActivities, activities }) => {
        if (!isModalVisible) return null;

        const [title, setTitle] = React.useState('');
        const [description, setDescription] = React.useState('');
        const mockActivity = { title: title, description: description, photos: [] };

        return (
            <View>
                <TextInput placeholder="Title" onChangeText={setTitle} value={title} />
                <TextInput placeholder="Description" onChangeText={setDescription} value={description} />
                <Button
                    testID='add-activity-btn'
                    title="Add Activity"
                    onPress={() => {
                        setActivities([mockActivity]);
                        toggleModal();
                    }}
                />
            </View>
        );
    };
});

// Mock the usePickImage hook
jest.mock('@/hooks/usePickImage', () => ({
    usePickImage: (setImage, addCategories) => {
        setImage('https://example.com/image.jpg');
    },
}));

// Mock the score component
jest.mock('react-native-star-rating-widget', () => {
    const React = require('react');
    const { TextInput } = require('react-native');

    return ({ value, onChange }) => {
        return <TextInput testID="score" value={value} onChange={onChange} testId="score" />
    };
});

jest.mock('@/provider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        user: { id: 'test-user-id' },
    })),
    AuthProvider: ({ children }) => children,
}));


jest.mock('expo-file-system', () => ({
    readAsStringAsync: jest.fn().mockResolvedValue('mocked_base64')
}));

jest.mock('base64-arraybuffer', () => ({
    decode: jest.fn().mockReturnValue('mocked_decoded')
}));

jest.mock('@/lib/supabase', () => ({
    supabase: {
        storage: {
            from: jest.fn(() => ({
                upload: jest.fn().mockResolvedValue({ data: { Key: 'mocked_key' } })
            })),
        },
        from: jest.fn(() => ({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn(
                () => ({
                    eq: jest.fn().mockResolvedValue({ data: [], error: null }),
                })),
            delete: jest.fn().mockReturnThis(),
        })),
        rpc: jest.fn().mockResolvedValue({ data: 1, error: null }),
    },
}));

jest.mock('../newJournal', () => {
    const originalModule = jest.requireActual('../newJournal');

    return {
        __esModule: true,
        ...originalModule,
        uploadImages: jest.fn().mockImplementation(() => {
            return Promise.resolve([
                { visit_id: 1, url: 'https://example.com/image1.jpg' },
                { visit_id: 1, url: 'https://example.com/image2.jpg' },
            ]);
        }),
        createJournal: jest.fn().mockImplementation(() => {
            return Promise.resolve({ data: 'ok', error: null });
        }),
    };
});

describe('NewJournal', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<NewJournal />);

        const title = getByPlaceholderText('Type in a title...');
        const description = getByPlaceholderText('Add a description...');
        const activities = getByText('Activities');
        const coverImage = getByText('Cover Image');
        const addImage = getByText('Pick an image from camera');
        const participants = getByText('Participants');
        const score = getByText('Score');

        expect(title).toBeTruthy();
        expect(description).toBeTruthy();
        expect(activities).toBeTruthy();
        expect(coverImage).toBeTruthy();
        expect(addImage).toBeTruthy();
        expect(participants).toBeTruthy();
        expect(score).toBeTruthy();
    });

    it('does not allow to create a journal without filling the inputs', async () => {
        const { getByText, getByTestId } = render(<NewJournal />);

        const createButton = getByText('Pick an image from camera');
        fireEvent.press(createButton);

        const uploadButton = getByTestId('upload-btn');
        fireEvent.press(uploadButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalled();
        });
    });



    it('handles journal creation', async () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(
            <NewJournal />
        );

        const titleInput = getByPlaceholderText('Type in a title...');
        fireEvent.changeText(titleInput, 'New Journal Title');
        const descriptionInput = getByPlaceholderText('Add a description...');
        fireEvent.changeText(descriptionInput, 'New Journal Description');

        const createButton = getByText('Pick an image from camera');
        fireEvent.press(createButton);

        const scoreInput = getByTestId('score');
        fireEvent.changeText(scoreInput, '5');

        const dateInput = getByText('Select a Date');
        fireEvent.press(dateInput);
        const calendarComponent = getByTestId('calendar-component');
        expect(calendarComponent).toBeTruthy();

        fireEvent(calendarComponent, 'onDayPress', { dateString: '2024-04-01' });
        fireEvent(calendarComponent, 'onDayPress', { dateString: '2024-04-05' });


        const activityModal = getByTestId('toggle-activity-modal');
        fireEvent.press(activityModal);

        const activitiesButton = getByTestId('add-activity-btn');
        const activityTitle = getByPlaceholderText('Title');
        const activityDescription = getByPlaceholderText('Description');

        fireEvent.changeText(activityTitle, 'Activity Title');
        fireEvent.changeText(activityDescription, 'Activity Description');
        fireEvent.press(activitiesButton);

        const uploadButton = getByTestId('upload-btn');
        fireEvent.press(uploadButton);

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalled();
            expect(supabase.rpc).toHaveBeenCalled();
            expect(supabase.storage.from).toHaveBeenCalled();

            expect(getByText("Journal created successfully")).toBeTruthy();
        });
    });

    it('shows the AddParticipantsModal when the button is pressed', async () => {
        const { getByText } = render(<NewJournal />);

        const addParticipantButton = getByText('Manage participants');
        fireEvent.press(addParticipantButton);

        await waitFor(() => {
            expect(getByText('Add Participant')).toBeTruthy();
        });
    });

    it('shows the NewActivityModal when the button is pressed', async () => {
        const { getByText, getByTestId } = render(<NewJournal />);

        const addActivityButton = getByTestId('toggle-activity-modal');
        fireEvent.press(addActivityButton);

        await waitFor(() => {
            expect(getByText('Add Activity')).toBeTruthy();
        });
    });

});
