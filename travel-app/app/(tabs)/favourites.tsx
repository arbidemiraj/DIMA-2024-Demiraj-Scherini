import { StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TripDetails } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { View } from '@/components/Themed';
import TripList from '@/components/TripList';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';

export default function Favourites() {
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getFavTrips();
    }

    //Reset when component unmounts
    return () => {
      setTrips([]);
    };
  }, [isFocused]);

  const handleEndReached = () => {};

  const getFavTrips = async () => {
    setLoading(true);
    try {
      //Get the ids of the favourites trip of the users
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      const filteredResult = result.filter(([key, value]) => {
        // Check if value is not null and is equal to "true"
        return value !== null && JSON.parse(value) === true;
      });

      const filteredIds = filteredResult.map(([key, value]) => parseInt(key));

      console.log('ids:', filteredIds);

      const { data, error } = await supabase.from('trip').select(`*, category(*), profile_trip(role, profile(*))`).in('id', filteredIds).order('id');

      if (error) throw error;

      if (!data || data.length === 0) {
        //setTrips([]);
        console.log('Trips:' + trips);
      } else {
        const tripDetailsData: TripDetails[] = data.map((trip) => ({
          id: trip.id,
          cover_url: trip.cover_url,
          description: trip.description,
          start_date: trip.start_date,
          end_date: trip.end_date,
          score: trip.score,
          name: trip.name,
          categories: trip.category,
          partecipants: trip.profile_trip.map((profileTrip) => ({
            // TODO: remove ! and fix DB
            // must be fixed in the DB, they cannot be null, then remove the !
            role: profileTrip.role!,
            profile: profileTrip.profile!,
          })),
        }));

        setTrips(tripDetailsData);
      }
    } catch (err) {
      console.log(err);
      alert('There was an error while fetching data from the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TripList trips={trips} isLoading={isLoading} handleEndReached={handleEndReached} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
