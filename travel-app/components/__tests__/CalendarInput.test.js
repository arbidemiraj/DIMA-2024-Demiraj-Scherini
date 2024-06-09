import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarInput from '@/components/CalendarInput';

describe('CalendarInput', () => {
    const mockSetSelectedDates = jest.fn();
    const selectedDates = {};

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
      });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should render correctly', () => {
        const { getByText } = render(<CalendarInput selectedDates={selectedDates} setSelectedDates={mockSetSelectedDates} />);

        const dateInput = getByText('Select a Date');
        expect(dateInput).toBeTruthy();
    });

    it('Should open the calendar when pressed', async () => {
        const { getByText, getByTestId } = render(<CalendarInput selectedDates={selectedDates} setSelectedDates={mockSetSelectedDates} />);

        const dateInput = getByText('Select a Date');
        fireEvent.press(dateInput);

        const calendarComponent = getByTestId('calendar-component');
        expect(calendarComponent).toBeTruthy();
    });

    it('Should update start date correctly', () => {
        const { getByText, getByTestId } = render(<CalendarInput selectedDates={{}} setSelectedDates={mockSetSelectedDates} />);
        const dateInput = getByText('Select a Date');
        fireEvent.press(dateInput);
        const calendarComponent = getByTestId('calendar-component');
        expect(calendarComponent).toBeTruthy();
    
        fireEvent(calendarComponent, 'onDayPress', { dateString: '2024-04-01' });
    
        expect(mockSetSelectedDates).toHaveBeenCalledTimes(1);
        expect(mockSetSelectedDates).toHaveBeenCalledWith({
            startDate: { dateString: '2024-04-01' },
        });
    });

    it('Should update end date correctly', () => {
        const { getByText, getByTestId } = render(<CalendarInput selectedDates={{startDate: { dateString: '2024-04-01' }}} setSelectedDates={mockSetSelectedDates} />);
        const dateInput = getByText('Select a Date');
        fireEvent.press(dateInput);
        const calendarComponent = getByTestId('calendar-component');
        expect(calendarComponent).toBeTruthy();
    
        fireEvent(calendarComponent, 'onDayPress', { dateString: '2024-04-05' });
    
        expect(mockSetSelectedDates).toHaveBeenCalledTimes(1);
        expect(mockSetSelectedDates).toHaveBeenCalledWith({
            startDate: { dateString: '2024-04-01' },
            endDate: { dateString: '2024-04-05' },
        });
    });

    it('Should update the date range correctly', () => {
        const { getByText, getByTestId } = render(<CalendarInput selectedDates={{startDate: { dateString: '2024-04-01' }}} setSelectedDates={mockSetSelectedDates} />);
        const dateInput = getByText('Select a Date');

        fireEvent.press(dateInput);
        const calendarComponent = getByTestId('calendar-component');
        expect(calendarComponent).toBeTruthy();
    
        fireEvent(calendarComponent, 'onDayPress', { dateString: '2024-04-05' });
    
        const dateInputText = getByText('01 Apr - 05 Apr');
        expect(dateInputText).toBeTruthy();
    });

    it('Should toggle date picker visibility on button press', () => {
        const { getByText, queryByTestId } = render(<CalendarInput selectedDates={selectedDates} setSelectedDates={mockSetSelectedDates} />);
    
        const dateInput = getByText('Select a Date');
        fireEvent.press(dateInput);
    
        const calendarComponent = queryByTestId('calendar-component');
        expect(calendarComponent).toBeTruthy();
    
        const confirmButton = getByText('Confirm');
        fireEvent.press(confirmButton);
    
        expect(queryByTestId('calendar-component')).toBeNull();
      });
    
});