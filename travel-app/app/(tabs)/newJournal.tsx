import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react';
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
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { format, set } from 'date-fns';
import StarRating from 'react-native-star-rating-widget';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import Toast, { BaseToast } from 'react-native-toast-message';
import { CategoryKey } from '@/types/types';

interface User {
  id: string;
  username: string | null;
  role: string;
}

interface Activity {
  title: string;
  description: string;
  photos: string[];
  coordinates?: Coordinates;
}

interface TooltipContentProps {
  index: number;
}

interface DateObject {
  dateString: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

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

  const backgroundColor = useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background;
  const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;

  const [tripCategories, setTripCategories] = useState<string[]>([]);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<{ startDate?: DateObject; endDate?: DateObject }>({});
  const [dateInput, setDateInput] = useState<string>('');
  const [insertedTripId, setInsertedTripId] = useState<number>(0); // Store the inserted trip ID for future use

  const userID = useAuth().user?.id;
  const router = useRouter();

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
          <Iconify icon='material-symbols:delete' size={34} color={textColor} style={{ flex: 1, marginRight: 30 }} />
        </Pressable>

        <Pressable
          onPress={() => {
            toggleOptionModal(index);
            setSelectedActivity(activities[index]);
            toggleActivityModal();
          }}
        >
          <Iconify icon='flowbite:edit-outline' size={34} color={textColor} style={{ flex: 1 }} />
        </Pressable>
      </View>
    );
  }


  const uploadImages = async (visitId: number, photos: string[]) => {
    try {
      const paths: string[] = [];

      for (const photo of photos) {
        const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
        const ext = photo.split('.').pop();
        const filePath = `${userID}/${new Date().getTime()}.${ext}`;

        const { data: storageData, error: storageError } = await supabase.storage.from('images').upload(filePath, decode(base64), { contentType: 'image/jpeg' });

        if (storageError) {
          throw storageError;
        }

        const { data, error } = await supabase.from('image').insert(
          { visit_id: visitId, url: 'https://yksbvdkpcrrszwkjmnee.supabase.co/storage/v1/object/public/images/' + storageData.path }
        );

        console.log(data);

        console.log(storageData);

        if (error) {
          throw error;
        }

        paths.push(storageData.path);
      }

      console.log('Images uploaded successfully:', paths);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error; // Propagate the error to handle it in createJournal
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      await supabase.from('trip').delete().eq('id', tripId);
      console.log('Trip deleted successfully:', tripId);
    } catch (error) {
      console.error('Error deleting trip:', tripId, error);
    }
  };

  function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
  }

  const createJournal = async () => {
    if (titleText === '' || descriptionText === '' || !selectedDates.startDate || !selectedDates.endDate || !image || givenStar === 0 || activities.length == 0) {
      showAlert();
    }

    const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
    const ext = image.split('.').pop();
    const filePath = `${userID}/${new Date().getTime()}.${ext}`;

    const { data: storageData, error: storageError } = await supabase.storage.from('images').upload(filePath, decode(base64), { contentType: 'image/jpeg' });

    if (storageError) {
      throw storageError;
    }

    try {
      //@ts-ignore
      const { data, error } = await supabase.rpc('create_journal_rpc', {
        title_text: titleText,
        description_text: descriptionText,
        start_date: selectedDates.startDate?.dateString ?? null,
        end_date: selectedDates.endDate?.dateString ?? null,
        image_url: 'https://yksbvdkpcrrszwkjmnee.supabase.co/storage/v1/object/public/images/' + storageData.path,
        given_star: givenStar,
        user_id: userID, // Assuming user_id is being converted correctly
        activities: activities.map(activity => ({
          title: activity.title,
          description: activity.description,
          photos: activity.photos,
          lat: activity.coordinates?.latitude,
          long: activity.coordinates?.longitude // Assuming `photos` is an array of photo URLs
        })),
        trip_categories: tripCategories.map(category => ({ id: categoryMap[category as CategoryKey] })), // Just pass category IDs
        participants: participants,
      });

      if (error) {
        console.error('Error creating journal:', error);
        return;
      }

      // The returned trip_id
      setInsertedTripId(data);
      console.log(data);

      // Fetch visit IDs created for this trip
      const { data: visitData, error: visitError } = await supabase
        .from('visit')
        .select('id')
        .eq('trip_id', data);

      //Change function to return also the visits if needed

      if (visitError) {
        console.error('Error fetching visits:', visitError);
        await deleteTrip(insertedTripId);
        return;
      }

      const visitPromises = visitData.map((visit, index) => {
        return uploadImages(visit.id, activities[index].photos); // Upload images for each visit
      });

      await Promise.all(visitPromises); // Ensure all image uploads complete

      showUploadingAlert();

      console.log('Journal created successfully with trip_id:', insertedTripId);
    } catch (error) {
      console.error('Error creating journal or uploading images:', error);

      // If there's an error, delete the trip and associated records
      if (error) {
        await deleteTrip(insertedTripId);
      }
    }
  }

  const confirmJournalCreation = () => {
    setImage('');
    onChangeDescription('');
    onChangeTitle('');
    onChangeGivenStar(3);
    setParticipants([]);
    setActivities([]);
    setDateInput('');
    setSelectedDates({});
    setTripCategories([]);
    setInsertedTripId(0);
    setModalVisible(false);
    setActivityModalVisible(false);
    setNewActivityModalVisible(false);
    setTooltipHandlers([]);

    router.push('/');
  }
  const showUploadingAlert = () => {
    Alert.alert('Success', 'Journal created successfully', [{ text: 'OK', onPress: () => confirmJournalCreation() }]);
  }

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
        <Iconify icon='mingcute:check-fill' size={32} color={textColor} onPress={createJournal} />
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
          headerStyle: { backgroundColor: backgroundColor },
          headerTitle: 'New Journal',
          headerLeft: () => <></>,
          headerRight: () => <CreateButton></CreateButton>,
        }}
      />

      <View style={styles.section}>
        <Text style={styles.title}>Title</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, }}>
          <TextInput placeholder='Type in a title' onChangeText={onChangeTitle} value={titleText} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Description</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextInput multiline={true} numberOfLines={5} placeholder='Add a description' onChangeText={onChangeDescription} value={descriptionText} />
        </View>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20, }}>
        <Text style={styles.title}>Date</Text>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ marginRight: 30, width: '80%' }}>
            <Pressable style={[styles.dateInput, { backgroundColor: '#fff', alignItems: 'center' }]} onPress={() => setShowDatePicker(!showDatePicker)}>
              {({ pressed }) => <Text style={{ color: '#000', opacity: pressed ? 0.5 : 1 }}>{dateInput ? dateInput : 'Select a Date'}</Text>}
            </Pressable>
            {showDatePicker && (
              <View>
                <Calendar markingType={'period'} onDayPress={onDayPress} markedDates={getMarkedDates()} maxDate={new Date().toISOString()} />
                <TouchableOpacity>
                  <View style={{ backgroundColor: Colors.light.tint }}>
                    <CustomButton func={() => setShowDatePicker(!showDatePicker)} text='Confirm' altStyle={true} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={styles.title}>Score</Text>
        <View style={{ marginTop: 10 }}>
          <StarRating
            rating={givenStar}
            onChange={onChangeGivenStar}
            color={textColor}
            starSize={50}
          />
          {/*<AirbnbRating size={24} selectedColor={Colors.light.tint} reviewColor={Colors.light.tint} onFinishRating={onChangeGivenStar} />*/}
        </View>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={styles.title}>Cover Image</Text>

        {!image ? (
          <View style={styles.picker}>
            <CustomButton func={pickImage} altStyle={false} text='Pick an image from camera' />
          </View>
        ) : (
          <View>
            <Pressable onPress={() => setImage('')} style={{ position: 'absolute', top: 15, right: 10, zIndex: 1 }}>
              <Iconify icon='carbon:close-filled' size={32} color={backgroundColor} />
            </Pressable>
            <Image source={{ uri: image }} style={styles.picker} />
          </View>

        )}
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20, }}>
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
              <Iconify icon='basil:add-solid' size={34} color={textColor} />
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
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

      <Toast />
    </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 15,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  activityImage: {
    height: 120,
    width: 120,
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  item: {
    flex: 1,
    width: '100%',
  },
  activity: {
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    height: 120,
    width: 120,
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    padding: 10,
  },
  picker: {
    marginTop: 10,
    backgroundColor: '#D9D9D9',
    height: 300,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIcon: {
    marginRight: 10,
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