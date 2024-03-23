import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native';

const GooglePlacesInput = () => {
  const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;
  
  return (
    <SafeAreaView>
        <GooglePlacesAutocomplete
        placeholder="Search"
        query={{key: apiKey}}
        fetchDetails={true}
        onPress={(data, details = null) => console.log(data, details)}
        onFail={error => console.log(error)}
        onNotFound={() => console.log('no results')}
        styles={{
          container: {
            flex: 0,
          },
          description: {
            color: '#000',
            fontSize: 16,
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          },
          predefinedPlacesDescription: {
            color: '#3caf50',
          },
        }}
        />
    </SafeAreaView>
        
  );
};

export default GooglePlacesInput;