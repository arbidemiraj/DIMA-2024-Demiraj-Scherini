import React from 'react';
import { View, Image, StyleSheet, Dimensions, useColorScheme, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, interpolateColor, Extrapolate } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Iconify } from 'react-native-iconify';
import CustomButton from './CustomButton';
import { usePickImage } from '@/hooks/usePickImage';

const { width } = Dimensions.get('screen');

const slideWidth = width * 0.75;
const slideHeight = 350;

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Activity {
    title: string;
    description: string;
    photos: string[];
    coordinates?: Coordinates;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface Props {
    setActivityState: SetStateFunction<Activity>;
    addCategories: (categories:string[]) => void;
    activityState: Activity;
}

export default function ImageSlide({setActivityState, activityState, addCategories} : Props) {
    const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;
    const separatorColor = useColorScheme() === 'light' ? Colors.light.separator : Colors.dark.separator;

    const setImage = (imageUri: string) => {
      setActivityState((prevState) => ({
        ...prevState,
        photos: [...prevState.photos, imageUri],
      }));
    }

    // Function to remove an image from the slideshow
  const removeImage = (indexToRemove: number) => {
    setActivityState((prevState) => ({
      ...prevState,
      photos: prevState.photos.filter((_, index) => index !== indexToRemove),
    }));
  };
      // Function to display the images in the slideshow
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
        testID={`image-slide-${index}`}
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
          <Pressable testID={`remove-button-${index}`} onPress={() => removeImage(index)} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
            <Iconify icon='carbon:close-filled' size={32} color={Colors.light.text} />
          </Pressable>

          <Image source={{ uri: slide }} style={styles.picker} />
        </View>
      </Animated.View>
    );
  };

  //Handles the indicator under the image
  const Indicator = ({ scrollOffset, index }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const input = scrollOffset.value / slideWidth;
      const inputRange = [index - 1, index, index + 1];
      const animatedColor = interpolateColor(input, inputRange, [separatorColor, textColor, separatorColor]);

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
        <View style={styles.container}>
            <Animated.ScrollView
             testID="scroll-view"
             nestedScrollEnabled={true}
             scrollEventThrottle={1}
             horizontal
             snapToInterval={slideWidth}
             decelerationRate='fast'
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={{
                 paddingHorizontal: (width - slideWidth) / 4,
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
                  width: slideWidth,
                  height: slideHeight,
                  paddingVertical: 10,
                },
                animatedStyle,
              ]}
            >
              <View style={styles.picker}>
                <CustomButton func={() => usePickImage(setImage, addCategories)} altStyle={false} text='Pick an image from camera' />
              </View>
            </Animated.View>
          </Animated.ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 50,}}>
            {activityState.photos.map((_, index) => {
              return <Indicator key={index} index={index} scrollOffset={scrollOffset} />;
            })}
            <Indicator key={activityState.photos.length} index={activityState.photos.length} scrollOffset={scrollOffset} />
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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