import React, { ReactNode, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { View as DefaultView } from 'react-native';
import useDateFormatter from '@/hooks/useDateFormatter';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Image } from 'react-native';
import { TripDetails } from '@/types/types';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Iconify } from 'react-native-iconify';
import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import TripMap from '@/components/TripMap';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Trip() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState<TripDetails>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [isFav, setFav] = useState<boolean>(false);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  
  useEffect(() => {
    getIsFav();
    getTrip();
  }, []);

  const getTrip = async () => {
    if (isLoading) return; // if there is no more content stop
    setLoading(true);
    try {
      const { data, error } = await supabase.from('trip').select(`*, category(*), visit(*, image(*)), profile_trip(role, profile(*))`).eq('id', id).single();

      if (error) throw error;

      //console.dir(data);
      setTrip({
        id: data.id,
        cover_url: data.cover_url,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        score: data.score,
        name: data.name,
        categories: data.category,
        partecipants: data.profile_trip.map((profileTrip) => ({
          // TODO: remove ! and fix DB
          // must be fixed in the DB, they cannot be null, then remove the !
          role: profileTrip.role!,
          profile: profileTrip.profile!,
        })),
        visits: data.visit.map((visit) => ({
          lat: visit.lat,
          long: visit.long,
          description: visit.description,
          name: visit.name,
          images: visit.image,
        })),
      }); // add newly-retrieved data to trips

    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  }; 

  //called when the favourite button is pressed
  const handleFav = async () => {
    setFav((prev) => !prev);

    storeIsFav(!isFav);
  };

  //gets if the trip is in the user favourites or not
  const getIsFav = async () => {
    try {
      const stringValue = await AsyncStorage.getItem(id.toString());

      if (stringValue !== null) {
        setFav(JSON.parse(stringValue));
      }else{
        setFav(false);
      }
    } catch (e) {
      // error reading value
    }
  };

  // gets all the favourites, for now to useful
  const getAllFavourites = async () => {
    try {
      const keys =  ['1', '2', '3', '4', '5', '6', '7', '8', '9'] // All the trip ids
      const items = await AsyncStorage.multiGet(keys); // Get all items corresponding to the keys
      // Convert items to an object
      const itemsObject: { [key: string]: string | null } = {};
      items.forEach(([key, value]) => {
        itemsObject[key] = value;
      });
      return itemsObject;
    } catch (error) {
      console.error('Error getting all items from AsyncStorage:', error);
      return null;
    }
  };
  
  //saves the new fav value for the current trip
  const storeIsFav = async (value:boolean) => {
    try {
      await AsyncStorage.setItem(id.toString(), JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  function BackButton(): ReactNode {
    return (
      <Pressable onPress={() => router.back()}>
        <Iconify icon='ion:chevron-back-outline' size={28} color={'#FFF'} />
      </Pressable>
    );
  }

  function FavoutiteButton(): ReactNode {
    return (
      <Pressable onPress={() => console.log('added to favoutites')}>
        <Iconify icon='ph:heart-duotone' size={32} color={'#FFF'} />
      </Pressable>
    );
  }

  return (
    <ScrollView style={styles.item} snapToAlignment={'start'} scrollEnabled={scrollEnabled}>
      {/* modify the back arrow to be always white only in this page*/}
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Iconify icon='ion:chevron-back-outline' size={28} color={'#FFF'} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleFav}>
              {isFav 
              ? <Iconify icon='ph:heart-fill' size={32} color={'#cf2626'} />
              : <Iconify icon='ph:heart-duotone' size={32} color={'#FFF'} />}
            </Pressable>
          ),
  
        }}
      />
      {/* modify the status bar only in this page*/}
      <StatusBar style='light' animated={true} />
      <DefaultView style={styles.imageContainer}>
        <Image source={{ uri: trip?.cover_url }} style={styles.image} />
        <DefaultView style={styles.overlay}>
          <DefaultView style={{ padding: 20, marginBottom: 10 }}>
            <Text style={{ color: Colors.dark.text, fontWeight: 'bold', fontSize: 28 }}>{trip?.name}</Text>
            <Text style={[{ color: Colors.dark.text }, styles.overlayText]}>Author - {trip?.partecipants[0].profile.username}</Text>
            <Text style={[{ color: Colors.dark.text }, styles.overlayText]}>
              From {useDateFormatter(trip?.start_date!)} to {useDateFormatter(trip?.end_date!)}
            </Text>
          </DefaultView>
        </DefaultView>
      </DefaultView>
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.title}>Description</Text>
            <View style={styles.scoreContainer}>
              <Text style={[styles.star, { color: useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint }]}>✱</Text>
              <Text style={styles.score}>{trip?.score?.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 16 }}>{trip?.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.title, styles.sectionHeader]}>Activities</Text>
          <Text style={{ fontSize: 16 }}>Place card will be displayed here</Text>
        </View>
        <View style={[styles.section, styles.sectionHeader]}>
          <Text style={styles.title}>Itinerary</Text>
        </View>
        {trip && <TripMap setScrollEnabled={setScrollEnabled} trip={trip} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    width: '100%',
  },
  image: {
    height: 350,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  overlayText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  section: {
    marginVertical: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  star: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  score: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.dark.text,
  }
});
