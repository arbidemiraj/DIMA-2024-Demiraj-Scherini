import {useEffect, useState} from 'react';
import { Image, StyleSheet, Pressable, Modal, useColorScheme, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { View, Text, ScrollView, TextInput, SafeAreaView} from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import CustomButton from '@/components/CustomButton';
import { useIsFocused } from '@react-navigation/native';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    interpolateColor,
    Extrapolate,
  } from "react-native-reanimated";
  
const { width } = Dimensions.get("screen");

const textColor = "#2A3B38";
const slideWidth = width * 0.9;
const slideHeight = 350;

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  activityInfos: Activity|null;
  index: number,
  setActivities: SetStateFunction<Activity[]>;
}

interface Activity {
    title: string,
    description: string,
    photos: string[],
}

export default function NewActivityModal({isModalVisible, toggleModal, index, activityInfos, setActivities,} : Props) {
  const [image, setImage] = useState<string>('');
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;
  const isFocused = useIsFocused();
  const [activityState, setActivityState] = useState<Activity>({
    description: '',
    title: '',
    photos: [],
  });

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
      setActivityState(prevState => ({
        ...prevState,
        photos: [...prevState.photos, result.assets[0].uri],
      }));
    }
  };

  const removeImage = (indexToRemove: number) =>  {
    setActivityState(prevState => ({
      ...prevState,
      photos: prevState.photos.filter((_, index) => index !== indexToRemove),
    }));
  }

  const showAlert = () => {
    Alert.alert('Error', 'Please fill all the inputs', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
   }

  //Handles the single component for the slideshow
  const Slide = ({ slide, scrollOffset, index }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
        const input = scrollOffset.value / slideWidth;
        const inputRange = [index - 1, index, index + 1];
    
        return {
          transform: [
            {
              scale: interpolate(
                input,
                inputRange,
                [0.8, 1, 0.8],
                Extrapolate.CLAMP
              ),
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
            <Pressable onPress={() => removeImage(index)} style={{position: 'absolute',top: 10,right: 10,zIndex: 1,}}>
                <Iconify icon='carbon:close-filled' size={32} color={Colors.light.text} />
            </Pressable>
            
            <Image source={{ uri: slide }} style={styles.picker} />
      </View>
                       
      </Animated.View>
    );
  };

  const handleClose = () => {
    if(activityState.title === '' || activityState.description === '' || activityState.photos.length === 0) showAlert()
    else {
        setActivities(prevActivities => {
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
      const animatedColor = interpolateColor(input, inputRange, [
        '#D9D9D9',
        Colors.light.tint,
        '#D9D9D9',
      ]);
  
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
          scale: interpolate(
            input,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Modal visible={isModalVisible} statusBarTranslucent={true}>
      <ScrollView style={{flex: 1}} snapToAlignment={'start'} scrollEventThrottle={1}>

        <SafeAreaView style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Pressable onPress={toggleModal}>
            <Iconify icon='ion:chevron-back-outline' size={28} color={iconColor} style={{marginLeft: 10, flex: 1, marginTop: 20,}} />
          </Pressable>

          <Pressable onPress={handleClose}>
            <Iconify icon='mingcute:check-fill' size={28} color={iconColor} style={{marginRight: 10, flex: 1, marginTop: 20,}} />
          </Pressable>
        </SafeAreaView>
      
        <View style={styles.container}>
          <Text style={styles.title}>Title</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Type in a title'
              onChangeText={(text) => setActivityState(prevState => ({ ...prevState, title: text }))}
              value={activityState.title}
              style={styles.textInput}
            />
          </View>
        </View>
        
        <View style={styles.container}>
          <Text style={styles.title}>Description</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Add a description'
              onChangeText={(text) => setActivityState(prevState => ({ ...prevState, description: text }))}
              value={activityState.description}
              style={styles.textInput}
            />
          </View>
        
        </View>
        
      
        <View style={styles.container}>
          <Text style={styles.title}>Photos</Text>
          <Animated.ScrollView
          scrollEventThrottle={1}
          horizontal
          snapToInterval={slideWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            display: 'flex',
            alignItems: "center",
            paddingHorizontal: (width - slideWidth) / 2,
            justifyContent: "center",
          }}
          onScroll={scrollHandler}
        >
          {activityState.photos.map((photo, index) => {
            return (
              <Slide
                key={index}
                index={index}
                slide={photo}
                scrollOffset={scrollOffset}
                pickInput={false}
              />
            );
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
        
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          {activityState.photos.map((_, index) => {
            return (
              <Indicator key={index} index={index} scrollOffset={scrollOffset} />
            );
          })}
              <Indicator key={activityState.photos.length} index={activityState.photos.length} scrollOffset={scrollOffset} />
        </View>
          

        </View>
    </ScrollView>
    </Modal>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10, 
  },
  item: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  picker: {
    backgroundColor: '#D9D9D9',
    height: 300,
    borderRadius: 30,
    width: '100%',
    resizeMode: 'cover',
    zIndex: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
});
