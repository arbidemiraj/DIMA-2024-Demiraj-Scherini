import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Platform, SafeAreaView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

const GooglePlacesInput = () => {
  const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

  return (
    <SafeAreaView>
      <GooglePlacesAutocomplete
        placeholder='Discover by...'
        enablePoweredByContainer={false}
        query={{ key: apiKey }}
        fetchDetails={true}
        onPress={(data, details = null) => console.log(data, details)}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log('no results')}
        textInputProps={{
          placeholderTextColor: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text,
        }}
        styles={{
          container: {
            flex: 0,
            marginTop: 10,
            paddingHorizontal: 20,
          },
          description: {
            color: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text,
            fontSize: 16,
          },
          textInputContainer: {
            backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.separator,
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 30,

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
          textInput: {
            backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.separator,
            color: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text,
            flex: 1,
            height: 40,
            paddingLeft: 5,
            marginTop: 2,
          },
          predefinedPlacesDescription: {
            color: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text,
          },
          row: {
            backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background, // Dropdown menu color
          },
          poweredContainer: {
            backgroundColor: useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background, // Background color of 'powered by Google' row
          },
        }}
        renderLeftButton={() => <FontAwesome name='search' size={22} color={useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text} style={{ marginRight: 10, marginLeft: 15 }} />}
        renderRightButton={() => <FontAwesome name='filter' size={22} color={useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text} style={{ marginRight: 15 }} />}
      />
    </SafeAreaView>
  );
};

export default GooglePlacesInput;
