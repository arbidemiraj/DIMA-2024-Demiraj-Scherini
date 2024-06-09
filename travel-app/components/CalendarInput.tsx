import { ReactNode, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { Text, View } from '@/components/Themed';
import { Pressable, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';

interface DateObject {
  dateString: string;
}

interface Props {
  selectedDates: { startDate?: DateObject; endDate?: DateObject };
  setSelectedDates: (dates: { startDate?: DateObject; endDate?: DateObject }) => void;
}

export default function CalendarInput({ selectedDates, setSelectedDates }: Props) {
  const [dateInput, setDateInput] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const onDayPress = (day: DateObject) => {
    let updatedSelectedDates = {...selectedDates};

    if (
      !updatedSelectedDates.startDate ||
      (updatedSelectedDates.startDate && updatedSelectedDates.endDate) ||
      (updatedSelectedDates.startDate && new Date(day.dateString) < new Date(updatedSelectedDates.startDate.dateString))
    ) {
      updatedSelectedDates = { startDate: day };
      setDateInput(format(new Date(updatedSelectedDates.startDate?.dateString ?? new Date()), 'dd MMM') + ' - ');
    } else if (!updatedSelectedDates.endDate) {
      updatedSelectedDates.endDate = day;
      setDateInput(format(new Date(updatedSelectedDates.startDate.dateString ?? new Date()), 'dd MMM') + ' - ' + format(new Date(updatedSelectedDates.endDate.dateString ?? new Date()), 'dd MMM'));
    }

    setSelectedDates(updatedSelectedDates);
  };

  const getMarkedDates = () => {
    const markedDates: { [date: string]: { selected: boolean; startingDay?: boolean; endingDay?: boolean; color: string } } = {};

    if (selectedDates.startDate) {
      markedDates[selectedDates.startDate.dateString] = { selected: true, startingDay: true, color: 'blue' };
    }

    if (selectedDates.endDate) {
      markedDates[selectedDates.endDate.dateString] = { selected: true, endingDay: true, color: 'blue' };

      let currentDate = new Date(selectedDates.startDate?.dateString ?? new Date());
      currentDate.setDate(currentDate.getDate() + 1);
      const endDate = new Date(selectedDates.endDate.dateString);

      while (currentDate < endDate) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        markedDates[dateString] = { selected: true, color: Colors.light.tint };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ width: '100%' }}>
        <Pressable style={[styles.dateInput, { backgroundColor: '#fff', alignItems: 'center' }]} onPress={() => setShowDatePicker(!showDatePicker)}>
          {({ pressed }) => <Text style={{ color: '#000', opacity: pressed ? 0.5 : 1 }}>{dateInput ? dateInput : 'Select a Date'}</Text>}
        </Pressable>
        {showDatePicker && (
          <View>
            <Calendar testID={'calendar-component'} markingType={'period'} onDayPress={onDayPress} markedDates={getMarkedDates()} maxDate={new Date().toISOString()} />
            <TouchableOpacity>
              <View style={{ backgroundColor: Colors.light.tint }}>
                <CustomButton func={() => setShowDatePicker(!showDatePicker)} text='Confirm' altStyle={true} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dateInput: {
    marginTop: 10,
    borderRadius: 30,
    marginBottom: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
