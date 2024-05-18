import { ReactNode, useEffect, useState } from 'react';
import { Image, StyleSheet, Pressable, Platform, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ScrollView, Text, View, TextInput } from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import CustomButton from '@/components/CustomButton';
import ParticipantChip from '@/components/ParticipantChip';
import AddParticipantsModal from '@/components/AddParticipantsModal';
import NewActivityModal from '@/components/NewActivityModal';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Stack } from 'expo-router';
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';

interface User {
  id: string;
  username: string | null;
  role: string;
}

interface Activity {
  title: string;
  description: string;
  photos: string[];
}

interface TooltipContentProps {
  index: number;
}

interface DateObject {
  dateString: string;
}

type CategoryKey = 'food' | 'sport' | 'nature' | 'adventure' | 'luxury' | 'roadTrip' | 'culture' | 'museum' | 'monuments' | 'wildlife';

export default function NewJournal() {
  const [image, setImage] = useState<string>('');
  const [descriptionText, onChangeDescription] = useState<string>('');
  const [titleText, onChangeTitle] = useState<string>('');
  const [givenStar, onChangeGivenStar] = useState<number>(3);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isActivityModalVisible, setActivityModalVisible] = useState<boolean>(false);
  const [isNewActivityModalVisible, setNewActivityModalVisible] = useState<boolean>(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>({ title: '', description: '', photos: [] });
  const [tooltipHandlers, setTooltipHandlers] = useState<boolean[]>(Array(activities.length).fill(false));
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;
  const [tripCategories, setTripCategories] = useState<string[]>([]);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<{ startDate?: DateObject; endDate?: DateObject }>({});
  const [dateInput, setDateInput] = useState<string>('');
  const userID = useAuth().user?.id;

  const categoryMap: Record<CategoryKey, number> = {
    food: 1,
    sport: 2,
    nature: 3,
    adventure: 4,
    luxury: 5,
    roadTrip: 6,
    culture: 7,
    museum: 8,
    monuments: 9,
    wildlife: 10,
  };

  //Handles the addition of a new activity by adding the state variable for the associated tooltip
  useEffect(() => {
    const updated = [...tooltipHandlers];
    updated[activities.length - 1] = false;

    setTooltipHandlers(updated);
  }, [activities]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleActivityModal = () => {
    setActivityModalVisible(!isActivityModalVisible);
  };

  const toggleNewActivityModal = () => {
    setNewActivityModalVisible(!isNewActivityModalVisible);
  };

  const addParticipant = (user: User) => {
    if (user.username !== null && !participants.includes(user))
      setParticipants((prevParticipants) => {
        if (user.username) {
          return [...prevParticipants, user];
        } else {
          return prevParticipants; // Return previous state if username is falsy
        }
      });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /*const uploadImage = async (imageUri:string) => {
    try {
        const { data, error } = await supabase.storage
            .from('images')
            .upload(`image_${Date.now()}`, imageUri);

        if (error) {
            console.error('Error uploading image:', error.message);

            return;
        }

        setImage(imageUri);
        detectLabels(imageUri);
    } catch (error) {
        console.log(error);
    }
  };*/

  const toggleOptionModal = (index: number) => {
    const updated = [...tooltipHandlers];
    updated[index] = !updated[index];

    setTooltipHandlers(updated);
  };

  const removeParticipant = (indexToRemove: number) => {
    setParticipants((participants) => participants.filter((_, index) => index !== indexToRemove));
  };

  const deleteActivity = (index: number) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1); // Remove the activity at the specified index
    setActivities(updatedActivities);

    const updated = [...tooltipHandlers];
    updated.splice(index, 1); // Remove the activity at the specified index
    setTooltipHandlers(updated);
  };

  function TooltipContent({ index }: TooltipContentProps): ReactNode {
    return (
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/*TODO DELETE ACTIVITY*/}
        <Pressable onPress={() => deleteActivity(index)}>
          <Iconify icon='material-symbols:delete' size={34} color={iconColor} style={{ flex: 1, marginRight: 30 }} />
        </Pressable>

        <Pressable
          onPress={() => {
            toggleOptionModal(index);
            setSelectedActivity(activities[index]);
            toggleActivityModal();
          }}
        >
          <Iconify icon='flowbite:edit-outline' size={34} color={iconColor} style={{ flex: 1 }} />
        </Pressable>
      </View>
    );
  }

  const insertCategories = async (tripId: number) => {
    try {
      console.log('tripCategories', tripCategories);

      const { data, error } = await supabase.from('trip_category').insert(
        tripCategories.map((category) => ({
          category_id: categoryMap[category as CategoryKey], // Add an index signature to allow indexing with a string
          trip_id: tripId,
        }))
      );

      if (error) {
        console.error('Error adding categories:', error);
        return;
      }

      console.log('Categories added successfully');
    } catch (error) {
      console.error('Error adding categories:', error);
    }
  };
  const insertImages = async (visitId: number, index: number) => {
    try {
      const { data, error } = await supabase.from('image').insert(
        activities[index].photos.map((photo) => ({
          visit_id: visitId,
          url: photo,
        }))
      );

      if (error) {
        console.error('Error adding images:', error);
        return;
      }

      console.log('Images added successfully');
    } catch (error) {
      console.error('Error adding images:', error);
    }
  };

  const insertVisits = async (tripId: number) => {
    try {
      const { data, error } = await supabase
        .from('visit')
        .insert(
          activities.map((activity) => ({
            name: activity.title,
            description: activity.description,
            trip_id: tripId,
            lat: 0,
            long: 0,
          }))
        )
        .select();

      if (error) {
        console.error('Error adding visits:', error);
        return;
      }

      const insertedIDs = data.map((visit) => visit.id);
      insertedIDs.map((id, index) => {
        insertImages(id, index);
      });

      console.log('Visits added successfully');
    } catch (error) {
      console.error('Error adding visits:', error);
    }
  };

  const insertParticipants = async (tripId: number) => {
    try {
      participants.push({ id: userID ?? '', username: null, role: 'author' });
      const { data, error } = await supabase.from('profile_trip').insert(
        participants.map((participant) => ({
          profile_id: participant.id,
          trip_id: tripId,
          role: 'participant',
        }))
      );

      if (error) {
        console.error('Error adding participants:', error);
        return;
      }

      console.log('Participants added successfully');
    } catch (error) {
      console.error('Error adding participants:', error);
    }
  };

  const createJournal = async () => {
    // Add journal to database
    if (titleText === '' || descriptionText === '' || !selectedDates.startDate || !selectedDates.endDate || !image || givenStar === 0) {
      showAlert();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trip')
        .insert([
          {
            cover_url: image,
            description: descriptionText,
            start_date: selectedDates.startDate?.dateString ?? null,
            end_date: selectedDates.endDate?.dateString ?? null,
            score: givenStar,
            name: titleText,
          },
        ])
        .select();

      if (error) {
        console.error('Error creating journal:', error);
        return;
      }

      const insertedId = data[0].id;

      insertParticipants(insertedId);
      insertVisits(insertedId);
      insertCategories(insertedId);

      console.log('Journal created successfully');
    } catch (error) {
      console.error('Error creating journal:', error);
    }
  };

  const showAlert = () => {
    Alert.alert('Error', 'Please fill all the inputs', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
  };

  const onDayPress = (day: DateObject) => {
    let updatedSelectedDates = { ...selectedDates };

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

  function CreateButton(): ReactNode {
    return (
      <Pressable style={styles.createIcon}>
        <Iconify icon='fluent:checkmark-circle-24-filled' size={32} color={iconColor} onPress={createJournal} />
      </Pressable>
    );
  }

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
    <ScrollView style={styles.item} snapToAlignment={'start'} scrollEventThrottle={1}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background },
          headerTitle: 'New Journal',
          headerLeft: () => <></>,
          headerRight: () => <CreateButton></CreateButton>,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Title</Text>

        <View style={styles.inputContainer}>
          <TextInput placeholder='Type in a title' onChangeText={onChangeTitle} value={titleText} style={styles.textInput} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Description</Text>

        <View style={[styles.inputContainer, { height: 100 }]}>
          <TextInput multiline={true} numberOfLines={5} placeholder='Add a description' onChangeText={onChangeDescription} value={descriptionText} style={styles.textInput} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Date</Text>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ marginRight: 30 }}>
            <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(!showDatePicker)}>
              {({ pressed }) => <Text style={{ opacity: pressed ? 0.5 : 1 }}>{dateInput ? dateInput : 'Select a Date'}</Text>}
            </Pressable>
            {showDatePicker && (
              <View>
                <Calendar markingType={'period'} onDayPress={onDayPress} markedDates={getMarkedDates()} maxDate={new Date().toISOString()} />
                <TouchableOpacity>
                  <View style={{ backgroundColor: Colors.light.tint, borderRadius: 20 }}>
                    <Text></Text>
                    <CustomButton func={() => setShowDatePicker(!showDatePicker)} text='Confirm' altStyle={true} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Score</Text>
        <View>
          <AirbnbRating size={24} selectedColor={Colors.light.tint} reviewColor={Colors.light.tint} onFinishRating={onChangeGivenStar} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Cover Image</Text>

        {!image ? (
          <View style={styles.picker}>
            <CustomButton func={pickImage} altStyle={false} text='Pick an image from camera' />
          </View>
        ) : (
          <Image source={{ uri: image }} style={styles.picker} />
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Activities</Text>

        <ScrollView horizontal={true} style={styles.activityContainer}>
          {activities.map((activity, index) => {
            return (
              <View key={index}>
                <Tooltip
                  key={index}
                  closeOnContentInteraction={true}
                  isVisible={tooltipHandlers[index]}
                  content={<TooltipContent index={index}></TooltipContent>}
                  placement='center'
                  onClose={() => toggleOptionModal(index)}
                >
                  <Pressable
                    key={index}
                    onLongPress={() => {
                      toggleOptionModal(index);
                    }}
                  >
                    <Image key={index} source={{ uri: activity.photos[0] }} style={styles.activityImage} />
                  </Pressable>
                </Tooltip>
              </View>
            );
          })}
          <View style={styles.activity}>
            <Pressable onPress={() => toggleNewActivityModal()}>
              <Iconify icon='basil:add-solid' size={34} color={iconColor} />
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Participants</Text>

        <View style={{ marginVertical: 20 }}>
          <CustomButton func={toggleModal} altStyle={false} text='Add participants' />
          <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', marginVertical: 20 }}>
            {participants.map((participant, index) => (
              <ParticipantChip userID={participant.id} key={index} username={participant.username ?? ''} role={''} />
            ))}
          </View>
        </View>
      </View>

      <AddParticipantsModal
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        participants={participants}
        removeParticipant={removeParticipant}
        addParticipant={addParticipant}
      ></AddParticipantsModal>
      <NewActivityModal
        isModalVisible={isActivityModalVisible}
        toggleModal={toggleActivityModal}
        index={activities.indexOf(selectedActivity)}
        activityInfos={selectedActivity}
        setActivities={setActivities}
        tripCategories={tripCategories}
        setCategories={setTripCategories}
      />
      <NewActivityModal
        isModalVisible={isNewActivityModalVisible}
        toggleModal={toggleNewActivityModal}
        index={activities.length}
        activityInfos={null}
        setActivities={setActivities}
        tripCategories={tripCategories}
        setCategories={setTripCategories}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateInput: {
    marginTop: 10,
    padding: 20,
    borderRadius: 30,
    marginBottom: 10,
    width: '100%',
    backgroundColor: Colors.light.background,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  createButton: {
    borderRadius: 20, // Border radius
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    backgroundColor: 'blue', // Button background color
  },
  activityImage: {
    height: 100,
    width: 100,
    marginRight: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  item: {
    flex: 1,
    width: '100%',
  },
  activity: {
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    height: 100,
    width: 100,
    marginRight: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // for Android shadow
  },
  picker: {
    marginTop: 10,
    backgroundColor: '#D9D9D9',
    height: 300,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  textInput: {
    flex: 1,
    borderRadius: 30,
    height: 30,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  inputContainer: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    marginLeft: 10,
    borderBottomColor: '#737373',
    marginBottom: 20,
  },
  star: {
    marginRight: 5,
  },
  stars: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
  },
  scores: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  createIcon: {
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
