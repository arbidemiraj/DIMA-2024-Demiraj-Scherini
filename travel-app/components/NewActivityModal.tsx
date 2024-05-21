import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Pressable, Modal, useColorScheme, Dimensions, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Colors from '@/constants/Colors';
import { View, Text, ScrollView, TextInput, SafeAreaView } from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import CustomButton from '@/components/CustomButton';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, interpolateColor, Extrapolate } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('screen');

const slideWidth = width * 0.7;
const slideHeight = 380;

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

  const handlePlacePress = (data: any, details: any = null) => {   
    console.log(data);
    const text = autocompleteRef.current?.getAddressText() ?? '';

    setActivityState((prevState) => ({
      ...prevState,
      title: text,
    }));
    
    autocompleteRef.current?.render; // Close the dropdown menu after selecting a place
    if (details) {
      // Clear the input field after selecting a place
      const { lat, lng } = details.geometry.location;
      console.log(lat, lng);

      setActivityState((prevState) => ({
        ...prevState,
        coordinates: { latitude: lat, longitude: lng },
      }));

    } 
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
      detectLabels(result.assets[0].uri);

      setActivityState((prevState) => ({
        ...prevState,
        photos: [...prevState.photos, result.assets[0].uri],
      }));
    }
  };

  // Function to detect labels using Google Vision API
  const detectLabels = async (imageUri: string) => {
    const apiKey = 'AIzaSyCa4-rskhmT6sUv9uab7be_pI8Lw9jmHyI'; // Replace with your API key
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestData = {
      requests: [
        {
          image: {
            content: base64ImageData,
          },
          features: [{ type: 'LABEL_DETECTION', maxResults: 25 }],
        },
      ],
    };

    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      const labelAnnotations = data.responses[0].labelAnnotations;
      getCategories(labelAnnotations);
    } catch (error) {
      console.error('Error detecting labels:', error);
    }
  };

  const getCategories = (labelAnnotations: any) => {
    let tripCategories: string[] = [];

    const categories: { [key: string]: string[] } = {
      sport: ['sports', 'sport', 'exercise', 'activity', 'fitness', 'workout', 'gym', 'running', 'swimming', 'yoga', 'cycling'],
      nature: ['nature', 'landscape', 'outdoors', 'scenic', 'wilderness', 'mountain', 'forest', 'beach', 'park', 'waterfall'],
      adventure: ['adventure', 'exploration', 'journey', 'expedition', 'trekking', 'hiking', 'climbing', 'rafting', 'skydiving', 'bungee jumping'],
      luxury: ['luxury', 'lavish', 'opulence', 'exclusive', 'premium', 'high-end', 'fancy', 'elegant', 'champagne', 'limousine'],
      roadTrip: ['road trip', 'journey', 'driving', 'travel', 'car', 'motorcycle', 'campervan', 'route', 'exploring'],
      culture: ['culture', 'tradition', 'heritage', 'cultural', 'customs', 'art', 'music', 'dance', 'festival', 'ceremony'],
      museum: ['museum', 'exhibition', 'artifacts', 'gallery', 'historic', 'painting', 'sculpture', 'archaeology', 'history', 'collection'],
      monuments: ['monuments', 'landmarks', 'historic sites', 'memorial', 'ruins', 'statue', 'castle', 'temple', 'palace', 'tower'],
      wildlife: ['wildlife', 'animals', 'nature reserve', 'wild', 'fauna', 'safari', 'birdwatching', 'zoo', 'national park', 'conservation'],
      food: ['food', 'cuisine', 'restaurant', 'dining', 'gastronomy', 'cooking', 'chef', 'foodie', 'delicious', 'tasting'],
    };

    for (let category in categories) {
      categories[category].forEach((label) => {
        labelAnnotations.forEach((element: { description: string }) => {
          if (element.description.toLowerCase() === label && !tripCategories.includes(category)) {
            tripCategories.push(category);
          }
        });
      });
    }

    setCategories((prevCategories) => {
      return [...prevCategories, ...tripCategories];
    });
  };

  const removeImage = (indexToRemove: number) => {
    setActivityState((prevState) => ({
      ...prevState,
      photos: prevState.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  //Handles the single component for the slideshow
  const Slide = ({ slide, scrollOffset, index }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const input = scrollOffset.value / slideWidth;
      const inputRange = [index - 1, index, index + 1];

      return {
        transform: [
          {
            scale: interpolate(input, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP),
          },
        ],
      };
    });

    return (
      <Animated.View
        key={index}
        style={[
          {
            flex: 1,
            width: slideWidth,
            height: slideHeight,
            paddingVertical: 10,
          },
          animatedStyle,
        ]}
      >
        <View>
          <Pressable onPress={() => removeImage(index)} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
            <Iconify icon='carbon:close-filled' size={32} color={Colors.light.text} />
          </Pressable>

          <Image source={{ uri: slide }} style={styles.picker} />
        </View>
        <Toast />
      </Animated.View>
    );
  };

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

  //Handles the indicator under the image
  const Indicator = ({ scrollOffset, index }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const input = scrollOffset.value / slideWidth;
      const inputRange = [index - 1, index, index + 1];
      const animatedColor = interpolateColor(input, inputRange, ['#D9D9D9', Colors.light.tint, '#D9D9D9']);

      return {
        width: interpolate(input, inputRange, [20, 25, 20], Extrapolate.CLAMP),
        backgroundColor: animatedColor,
      };
    });

    return (
      <Animated.View
        style={[
          {
            marginHorizontal: 5,
            height: 20,
            borderRadius: 10,
            backgroundColor: textColor,
          },
          animatedStyle,
        ]}
      />
    );
  };

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / slideWidth;
    const inputRange = [activityState.photos.length - 1, activityState.photos.length, activityState.photos.length + 1];

    return {
      transform: [
        {
          scale: interpolate(input, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP),
        },
      ],
    };
  });

  return (
    <Modal visible={isModalVisible} style={{ backgroundColor: 'green' }} transparent={true}>
      <SafeAreaView style={{ flex: 1, display: 'flex', paddingHorizontal: 10, paddingTop: topPadding }} edges={['']}>
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
              keepResultsAfterBlur={true}
              ref={autocompleteRef}
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
          <Animated.ScrollView
            nestedScrollEnabled={true}
            scrollEventThrottle={1}
            horizontal
            snapToInterval={slideWidth}
            decelerationRate='fast'
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              display: 'flex',
              alignItems: 'center',
              paddingHorizontal: (width - slideWidth) / 2,
              justifyContent: 'center',
            }}
            onScroll={scrollHandler}
          >
            {activityState.photos.map((photo, index) => {
              return <Slide key={index} index={index} slide={photo} scrollOffset={scrollOffset} pickInput={false} />;
            })}

            <Animated.View
              key={activityState.photos.length}
              style={[
                {
                  flex: 1,
                  width: slideWidth,
                  height: slideHeight,
                  paddingVertical: 10,
                },
                animatedStyle,
              ]}
            >
              <View style={styles.picker}>
                <CustomButton func={pickImage} altStyle={false} text='Pick an image from camera' />
              </View>
            </Animated.View>
          </Animated.ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {activityState.photos.map((_, index) => {
              return <Indicator key={index} index={index} scrollOffset={scrollOffset} />;
            })}
            <Indicator key={activityState.photos.length} index={activityState.photos.length} scrollOffset={scrollOffset} />
          </View>
        </View>
      </SafeAreaView>
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
  picker: {
    backgroundColor: '#D9D9D9',
    height: 300,
    borderRadius: 30,
    width: '100%',
    resizeMode: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
