import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, Modal, useColorScheme} from 'react-native';

import Colors from '@/constants/Colors';
import { View, Text, TextInput, ScrollView } from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';


import Toast from 'react-native-toast-message';
import ImageSlide from './ImageSlide';


type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  activityInfos: Activity | null;
  index: number;
  setActivities: SetStateFunction<Activity[]>;
  setCategories: SetStateFunction<string[]>;
  tripCategories: string[];
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Activity {
  title: string;
  description: string;
  photos: string[];
  coordinates?: Coordinates;
}

export default function NewActivityModal({ isModalVisible, toggleModal, index, activityInfos, setActivities, setCategories, tripCategories }: Props) {
  const [image, setImage] = useState<string>('');

  const backgroundColor = useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background;
  const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;
  const separatorColor = useColorScheme() === 'light' ? Colors.light.separator : Colors.dark.separator;

  const isFocused = useIsFocused();
  const [activityState, setActivityState] = useState<Activity>({
    description: '',
    title: '',
    photos: [],
  });

  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null); 
  const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

  // calculate the top padding for the modal
  const topPadding = useSafeAreaInsets().top;

  useEffect(() => {
    if (activityInfos !== null) {
      setActivityState({
        description: activityInfos.description,
        title: activityInfos.title,
        photos: activityInfos.photos,
      });
    } else {
      setActivityState({
        description: '',
        title: '',
        photos: [],
      });
    }
  }, [activityInfos, isFocused]);

  // Handles when a place is selected from the dropdown menu
  const handlePlacePress = (data: any, details: any = null) => {   
    const text = autocompleteRef.current?.getAddressText() ?? '';

    if (details) {
      const mainText = data.structured_formatting.main_text;

      // Extract locality and country from address components
      const addressComponents = details.address_components;
      const localityComponent = addressComponents.find((component: { types: string | string[]; }) => 
        component.types.includes('locality')
      );
      const countryComponent = addressComponents.find((component: { types: string | string[]; }) => 
        component.types.includes('country')
      );

      const locality = localityComponent ? localityComponent.long_name : '';
      const country = countryComponent ? countryComponent.long_name : '';

      // Format as main_text, locality, Country
      const formattedPlaceName = `${mainText}${locality ? `, ${locality}` : ''}${country ? `, ${country}` : ''}`;
      
      autocompleteRef.current?.setAddressText(formattedPlaceName);

      setActivityState((prevState) => ({
        ...prevState,
        title: formattedPlaceName,
      }));
      
      // Clear the input field after selecting a place
      const { lat, lng } = details.geometry.location;

      setActivityState((prevState) => ({
        ...prevState,
        coordinates: { latitude: lat, longitude: lng },
      }));

      console.log('Place selected:', formattedPlaceName);
    } 
  };

  // Function to close the modal
  const handleClose = () => {
    if (activityState.title === '' || activityState.description === '' || activityState.photos.length === 0){
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please fill all the inputs',
        visibilityTime: 1500,
        autoHide: true,
      });
    } 
    else {
      setActivities((prevActivities) => {
        const newActivity = [...prevActivities]; // Create a copy of the previous array
        newActivity[index] = activityState; // Update the value at the specified index
        return newActivity; // Return the new array
      });
      setActivityState({
        description: '',
        title: '',
        photos: [],
      });
      toggleModal();
    }
  };

  

  return (
    <Modal visible={isModalVisible} style={{ backgroundColor: 'green' }} transparent={true}>
      <ScrollView style={{ flex: 1, display: 'flex', paddingHorizontal: 10, paddingTop: topPadding }} keyboardShouldPersistTaps={'always'} nestedScrollEnabled={true}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={toggleModal}>
            <Iconify icon='ion:chevron-back-outline' size={28} color={textColor} style={{ marginLeft: 10, flex: 1 }} />
          </Pressable>

          <Pressable onPress={handleClose}>
            <Iconify icon='mingcute:check-fill' size={28} color={textColor} style={{ marginRight: 15, flex: 1 }} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Place</Text>

          <GooglePlacesAutocomplete
              placeholder='Type in a place...'
              enablePoweredByContainer={false}
              listViewDisplayed={false}
              ref={autocompleteRef}
              disableScroll={true}
              fetchDetails={true}
              query={{key: 'AIzaSyC7Qjn3MKrk9I9MVcgRHqWdaPhYhwz4QZ8'}}
              onPress={handlePlacePress}
              onFail={(error) => console.log(error)}
              onNotFound={() => console.log('no results')}
              textInputProps={{
                placeholderTextColor: textColor,
              }}
              styles={{
                container: {
                  flex: 0,
                  marginVertical: 10, 
                  paddingVertical: 10,
                  backgroundColor: 'transparent',
                },
                description: {
                  color: textColor,
                  fontSize: 16,
                },
                textInputContainer: {
                  backgroundColor: 'transparent',
                  borderBottomWidth: 1,
                  borderColor: separatorColor,
                },
                textInput: {
                  backgroundColor: 'transparent',
                  color: textColor,
                },
                predefinedPlacesDescription: {
                  color: textColor,
                },
                row: {
                  backgroundColor: backgroundColor, // Dropdown menu color
                },
                poweredContainer: {
                  backgroundColor: backgroundColor, // Background color of 'powered by Google' row
                },
              }}
            />
          
        </View>
        

        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <View style={{ borderBottomWidth: 1, marginVertical: 10, paddingVertical: 10 }}>
            <TextInput 
              style={{ color: textColor, fontSize: 16, paddingHorizontal: 10,}}
              multiline={true}
              numberOfLines={5}
              placeholder='Add a description'
              onChangeText={(text) => {
                setActivityState((prevState) => ({ ...prevState, description: text }));
              }}
              value={activityState.description}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Photos</Text>
          <ImageSlide setActivityState={setActivityState} activityState={activityState} setCategories={setCategories}/>
          
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 15,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
});
