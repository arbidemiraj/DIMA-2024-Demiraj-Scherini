import React, { useRef, useState } from 'react';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Platform, Pressable, View } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Iconify } from 'react-native-iconify';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CategoriesBottomSheet from '@/components/CategoriesBottomSheet';
import useStore from '@/store/store';

interface Props {
  toggleOverlay: () => void;
  handlePlaceSelect: (data: any, details: any) => void;
  handleCategorySelect: () => void;
}

const GooglePlacesInput = ({ toggleOverlay, handlePlaceSelect, handleCategorySelect}: Props) => {
  const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;
  const [showBackIcon, setShowBackIcon] = useState<boolean>(false);
  const iconColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;

  // ref to BottomSheetModal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  //ref to GooglePlacesAutocomplete
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null); 

  // function to open the Filter tab
  const toggleModal = () => {
    bottomSheetModalRef.current?.present();
    toggleOverlay(); // toggles opacity overlay
  };

  // category filters logic
  const { cleanList } = useStore();

  const applyFilters = () => {
    bottomSheetModalRef.current?.dismiss();
    handleCategorySelect();
  };

  const handlePlacePress = (data: any, details: any = null) => {
    handlePlaceSelect(data, details);
    setShowBackIcon(true);
  };

  //Handles the back icon press
  const handleBack = () => {
    handlePlaceSelect(null, null); //set coordinates to null to reload the trips
    setShowBackIcon(false); //set showBackIcon to false to show the search icon
    autocompleteRef.current?.setAddressText(''); //remove the text of the google places component
  };
  
  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder='Discover by place...'
        enablePoweredByContainer={false}
        ref={autocompleteRef}
        query={{key: apiKey}}
        fetchDetails={true}
        onPress={handlePlacePress}
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
        renderLeftButton={() => (
            <View>
               {showBackIcon 
                  ? (
                  <Pressable onPress={handleBack}>
                    <Iconify icon='material-symbols:arrow-back' size={24} color={iconColor} style={{ marginLeft: 15, marginRight: 5 }} />
                  </Pressable>
                  )
                  : (<Iconify icon='material-symbols:search' size={24} color={iconColor} style={{ marginLeft: 15, marginRight: 5 }} /> )}
            </View>
          )}
        renderRightButton={() => (
          // this is the filter category menu button
          <Pressable onPress={toggleModal}>
            <Iconify icon='lucide:settings-2' size={24} color={iconColor} style={{ marginRight: 15, marginLeft: 5 }} />
          </Pressable>
        )}
      />

      {/* custom component used for the modal filter menu */}
      <CategoriesBottomSheet ref={bottomSheetModalRef} toggleOverlay={toggleOverlay} applyFilters={applyFilters} removeFilters={cleanList} />
    </View>
  );
};

export default GooglePlacesInput;
