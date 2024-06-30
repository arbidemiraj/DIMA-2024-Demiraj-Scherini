import { ReactNode, useEffect, useState } from 'react';
import { Image, StyleSheet, Pressable, Platform, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ScrollView, Text, View, TextInput } from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import CustomButton from '@/components/CustomButton';
import ParticipantChip from '@/components/ParticipantChip';
import AddParticipantsModal from '@/components/AddParticipantsModal';
import NewActivityModal from '@/components/NewActivityModal';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Stack, useNavigation, useRouter } from 'expo-router';
import React from 'react';
import StarRating from 'react-native-star-rating-widget';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import Toast from 'react-native-toast-message';
import { CategoryKey } from '@/types/types';
import { usePickImage } from '@/hooks/usePickImage';
import CalendarInput from '@/components/CalendarInput';
import UploadModal from '@/components/UploadModal';

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
  const [tripCategories, setTripCategories] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ startDate?: DateObject; endDate?: DateObject }>({});
  const [insertedTripId, setInsertedTripId] = useState<number>(0); // Store the inserted trip ID for future use
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false); // Loading state for image upload
  const [modalUpload, setModalUpload] = useState<boolean>(false); // Modal state for image upload

  const backgroundColor = useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background;
  const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;
  const tintColor = useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint;
  const placeHolderColor = useColorScheme() === 'light' ? '#979797' : '#aaaaaa';
  const separatorColor = useColorScheme() === 'light' ? Colors.light.separator : Colors.dark.separator;

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

  const addCategories = (categories: string[]) => {
    console.log(tripCategories);

    for (const category of categories) {
      if (!tripCategories.includes(category)) {
        setTripCategories((prevCategories) => [...prevCategories, category]);
      }
    }
  };

  const addParticipant = (user: User) => {
    console.log(participants, user);
    
    if (user.username !== null && !participants.some(p => p.username === user.username)){
      console.log('Adding participant:', user);

      setParticipants((prevParticipants) => {
        if (user.username) {
          return [...prevParticipants, user];
        } else {
          return prevParticipants; // Return previous state if username is falsy
        }
      });
  }else{
    global.alert('User already added');
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

  const resetPage = () => {
    setImage('');
    onChangeDescription('');
    onChangeTitle('');
    onChangeGivenStar(3);
    setModalVisible(false);
    setActivityModalVisible(false);
    setNewActivityModalVisible(false);
    setParticipants([]);
    setActivities([]);
    setSelectedActivity({ title: '', description: '', photos: [] });
    setTooltipHandlers(Array(activities.length).fill(false));
    setTripCategories([]);
    setSelectedDates({});
    setInsertedTripId(0);
    setLoadingUpload(false);
    setModalUpload(false);
  };

  
  const uploadImages = async (visitId: number, photos: string[], userID: string) => {
    try {
      const imageInsertData: { visit_id: number; url: string }[] = [];

      const uploadPromises = photos.map(async (photo) => {
        const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
        const ext = photo.split('.').pop();
        const filePath = `${userID}/${Date.now()}.${ext}`;

        console.log(base64);

        const { data: storageData, error: storageError } = await supabase.storage.from('images').upload(filePath, decode(base64), { contentType: `image/${ext}` });

        if (storageError) {
          throw storageError;
        }

        const imageUrl = `https://yksbvdkpcrrszwkjmnee.supabase.co/storage/v1/object/public/images/${storageData.path}`;
        imageInsertData.push({ visit_id: visitId, url: imageUrl });
      });

      await Promise.all(uploadPromises);

      const { data, error } = await supabase.from('image').insert(imageInsertData);

      if (error) {
        throw error;
      }

      console.log('Images uploaded successfully');
    } catch (error) {
      console.log('Error uploading images:', error);
      throw error; // Propagate the error to handle it in createJournal
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      await supabase.from('trip').delete().eq('id', tripId);
      console.log('Trip deleted successfully:', tripId);
    } catch (error) {
      console.log('Error deleting trip:', tripId, error);
    }
  };

  const removeDuplicates = (arr: string[]) => {
    return [...new Set(arr)];
  };
  const createJournal = async () => {
    if (titleText === '' || descriptionText === '' || !selectedDates.startDate || !selectedDates.endDate || !image || givenStar === 0 || activities.length == 0) {
      showAlert();

      return;
    }

    setModalUpload(true);
    setLoadingUpload(true);

    const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
    const ext = image.split('.').pop();
    const filePath = `${userID}/${new Date().getTime()}.${ext}`;

    const { data: storageData, error: storageError } = await supabase.storage.from('images').upload(filePath, decode(base64), { contentType: 'image/jpeg' });

    if (storageError) {
      throw storageError;
    }

    // Remove duplicates from tripCategories
    const categories = removeDuplicates(tripCategories);

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
        activities: activities.map((activity) => ({
          title: activity.title,
          description: activity.description,
          photos: activity.photos,
          lat: activity.coordinates?.latitude,
          long: activity.coordinates?.longitude, // Assuming `photos` is an array of photo URLs
        })),
        trip_categories: categories.map((category) => ({ id: categoryMap[category as CategoryKey] })), // Just pass category IDs
        participants: participants,
      });

      if (error) {
        console.log('Error creating journal:', error);
        return;
      }

      // The returned trip_id
      setInsertedTripId(data);
      console.log(data);

      // Fetch visit IDs created for this trip
      const { data: visitData, error: visitError } = await supabase.from('visit').select('id').eq('trip_id', data);

      //Change function to return also the visits if needed

      if (visitError) {
        console.log('Error fetching visits:', visitError);
        await deleteTrip(insertedTripId);
        return;
      }

      const visitPromises = visitData.map((visit, index) => {
        return uploadImages(visit.id, activities[index].photos, userID ?? ''); // Upload images for each visit
      });

      await Promise.all(visitPromises); // Ensure all image uploads complete

      console.log('Journal created successfully with trip_id:', insertedTripId);

      setLoadingUpload(false);

      setTimeout(() => {
        setModalUpload(false);
        resetPage();
        router.replace('/'); // Redirect to home screen
      }, 1000);
    } catch (error) {
      console.log('Error creating journal or uploading images:', error);

      // If there's an error, delete the trip and associated records
      if (error) {
        await deleteTrip(insertedTripId);
      }
    }
  };

  const showAlert = () => {
    Alert.alert('Error', 'Please fill all the inputs', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
  };

  function CreateButton(): ReactNode {
    return (
      <Pressable testID='upload-btn' style={styles.createIcon} onPress={createJournal}>
        <Iconify icon='material-symbols:upload' size={26} style={{ marginRight: 5 }} color={tintColor} />
      </Pressable>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps={'always'} style={styles.item} snapToAlignment={'start'} scrollEventThrottle={1}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 }}>
          <TextInput placeholder='Type in a title...' onChangeText={onChangeTitle} value={titleText} style={{ flex: 1, paddingVertical: 5 }} placeholderTextColor={placeHolderColor} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Description</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 }}>
          <TextInput
            multiline={true}
            numberOfLines={5}
            placeholder='Add a description...'
            onChangeText={onChangeDescription}
            value={descriptionText}
            style={{ flex: 1, paddingVertical: 5 }}
            placeholderTextColor={placeHolderColor}
          />
        </View>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={[styles.title, { marginBottom: 10 }]}>Date</Text>
        <CalendarInput selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={styles.title}>Score</Text>
        <View style={{ marginTop: 10 }}>
          <StarRating rating={givenStar} onChange={onChangeGivenStar} color={tintColor} starSize={50} />
        </View>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={styles.title}>Cover Image</Text>

        {!image ? (
          <View style={styles.picker}>
            <CustomButton func={() => usePickImage(setImage, addCategories)} altStyle={false} text='Pick an image from camera' />
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

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={styles.title}>Activities</Text>
        {activities.length > 0 && <Text style={{ color: placeHolderColor, fontStyle: 'italic', fontSize: 12, marginBottom: 10 }}>Long press on an activity to edit or delete it</Text>}
        <ScrollView keyboardShouldPersistTaps={'handled'} horizontal={true} style={styles.activityContainer}>
          {activities.map((activity, index) => {
            return (
              <View key={index}>
                <Tooltip
                  key={index}
                  closeOnContentInteraction={true}
                  isVisible={tooltipHandlers[index]}
                  contentStyle={{ backgroundColor: backgroundColor, borderRadius: 20 }}
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
            <Pressable testID="toggle-activity-modal" onPress={() => toggleNewActivityModal()}>
              <Iconify icon='basil:add-solid' size={34} color={textColor} />
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <View style={{ paddingVertical: 15, marginHorizontal: 20 }}>
        <Text style={styles.title}>Participants</Text>

        <View style={{ marginVertical: 20 }}>
          <CustomButton func={toggleModal} altStyle={false} text='Manage participants' />
          <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', marginVertical: 20 }}>
            {participants.map((participant, index) => (
              <ParticipantChip userID={participant.id} key={index} username={participant.username ?? ''} role={''} />
            ))}
          </View>
        </View>
      </View>

      <AddParticipantsModal isModalVisible={isModalVisible} toggleModal={toggleModal} participants={participants} removeParticipant={removeParticipant} addParticipant={addParticipant} />
      <NewActivityModal
        isModalVisible={isActivityModalVisible}
        toggleModal={toggleActivityModal}
        index={activities.indexOf(selectedActivity)}
        activityInfos={selectedActivity}
        setActivities={setActivities}
        addCategories={addCategories}
      />
      <NewActivityModal
        isModalVisible={isNewActivityModalVisible}
        toggleModal={toggleNewActivityModal}
        index={activities.length}
        activityInfos={null}
        setActivities={setActivities}
        addCategories={addCategories}
      />

      <UploadModal loading={loadingUpload} isModalVisible={modalUpload} />

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 15,
    marginHorizontal: 20,
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
    paddingHorizontal: 10,
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
