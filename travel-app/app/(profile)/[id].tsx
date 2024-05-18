import { StyleSheet, Image, useColorScheme } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/provider/AuthProvider';
import { Redirect } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Profile, TripDetails } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { GridLayout } from '@/components/GridLayout';
import { ScrollView } from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import Colors from '@/constants/Colors';

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();

  const [user, setUser] = useState<Profile>();
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const iconColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;

  useFocusEffect(
    useCallback(() => {
      getUser();
      getTrips();
    }, [])
  );

  const getUser = async () => {
    try {
      if (id === undefined) {
        alert('No user logged-in');
        return;
      }
      const { data, error } = await supabase.from('profile').select('*').eq('id', id).single();

      if (error) throw error;
      setUser(data);
    } catch (err) {
      console.log(err);
      alert('Error while fetching the user');
    }
  };

  const getTrips = async () => {
    setLoading(true);
    try {
      if (!id) return;

      let query = supabase.from('trip').select(`*, category!inner(*), profile_trip!inner(role, profile!inner(*)), visit!inner(lat, long, description, name, image(*))`);
      query.eq('profile_trip.profile.id', id).eq('profile_trip.role', 'author');
      const { data, error } = await query.order('start_date');

      if (error) throw error;
      if (trips === null) throw error;

      // map response data to TripData type
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

      if (data.length > 0) setTrips(tripDetailsData);
    } catch (err) {
      console.log(err);
      alert('There was an error while retriving data from the server');
    } finally {
      setLoading(false);
    }
  };

  const Item = ({ trip }: { trip: TripDetails }) => {
    return (
      <Link href={{ pathname: '/(trip)/[id]', params: { id: trip.id } }} asChild push>
        <Pressable>
          <View style={{ paddingHorizontal: 2, paddingVertical: 2 }}>
            <Image source={{ uri: trip.cover_url }} style={{ minHeight: 120, resizeMode: 'cover', borderRadius: 10, height: '100%' }} />
          </View>
        </Pressable>
      </Link>
    );
  };

  // for now I decided to just return a view with re-routing
  /*if (id === useAuth().user?.id) {
    return <Redirect href='/(tabs)/profile' />;
  } else*/
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: user?.username!,
          headerTitleAlign: 'center',
        }}
      />
      <View style={styles.section}>
        <Text style={[styles.title, styles.sectionHeader]}>Biography</Text>
        <Text>{user?.biography}</Text>
      </View>
      <View style={[styles.section, { paddingBottom: 80, paddingHorizontal: 10, paddingVertical: 20 }]}>
        {trips.length > 0 && <GridLayout isScrollNested={false} data={trips} renderItem={(item) => <Item trip={item} />} numColumns={3} />}
        {trips.length === 0 && !isLoading && (
          <View style={{ justifyContent: 'center', width: '100%', alignContent: 'center', alignItems: 'center' }}>
            <Iconify icon='tabler:photo-off' size={64} color={iconColor} style={{ margin: 20 }} />
            <Text style={[styles.title, { textAlign: 'center' }]}>No journals yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingBottom: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
