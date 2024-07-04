import { StyleSheet, Image, useColorScheme, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Profile, TripDetails } from '@/types/types';
import { supabase } from '@/lib/supabase';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { GridLayout } from '@/components/GridLayout';
import { ScrollView } from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import Colors from '@/constants/Colors';
import { useFontSize, useFontSizeTitle } from '@/hooks/useFontSize';
import { Calendar } from 'react-native-calendars';
import ParticipantChip from '@/components/ParticipantChip';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();

  const [user, setUser] = useState<Profile>();
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(true);
  const Tab = createMaterialTopTabNavigator();
  const iconColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;
  const tintColor = useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint;
  const separatorColor = useColorScheme() === 'light' ? Colors.light.separator : Colors.dark.separator;
  const { width } = Dimensions.get('window');
  const isTablet = width > 730;
  const opacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      setSelected(true);
      getUser();
      getTrips();
    }, [])
  );

  useEffect(() => {
    setTrips([]);
    getTrips();
    opacity.value = withSequence(
      withTiming(0),
      withTiming(1, { duration: 1000 })
    );
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
      console.log('user [id]: ', err);
      alert('Error while fetching the user');
    }
  };

  const getTrips = async () => {
    setLoading(true);
    try {
      if (!id) return;

      let query;

      if (selected) {
        query = supabase.from('trip').select(`*, category!inner(*), profile_trip!inner(role, profile!inner(*)), visit!inner(lat, long, description, name, image(*))`);
        query.eq('profile_trip.profile.id', id).eq('profile_trip.role', 'author');
      } else {
        query = supabase.from('trip').select(`*, category!inner(*), profile_trip!inner(role, profile!inner(*)), visit!inner(lat, long, description, name, image(*))`);
        query.eq('profile_trip.profile.id', id).eq('profile_trip.role', 'participant');
      }
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
      console.log('[id] profile page finding trips: ', err);
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
            <Image testID={trip.cover_url} source={{ uri: trip.cover_url }} style={{ minHeight: 120, resizeMode: 'cover', borderRadius: 10, height: '100%' }} />
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
        <Text style={[styles.title, styles.sectionHeader, { fontSize: useFontSizeTitle() }]}>Biography</Text>
        <Text style={{ fontSize: useFontSize() }}>{user?.biography}</Text>
      </View>
      <View style={{ marginTop: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20, gap: 5 }}>
        <TouchableOpacity
          testID='my-trips-button'
          style={[
            { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, borderBottomWidth: 2, flexDirection: 'row', gap: 10 },
            { borderColor: selected ? tintColor : separatorColor }
          ]}
          onPress={() => setSelected(true)}
        >
          {isTablet && <Text>My Trips</Text>}<Iconify icon='akar-icons:grid' color={iconColor} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          testID='tagged-trips-button'
          style={[
            { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, borderBottomWidth: 2, flexDirection: 'row', gap: 10 },
            { borderColor: selected ? separatorColor : tintColor }
          ]}
          onPress={() => setSelected(false)}
        >
          {isTablet && <Text>Tagged Trips</Text>}<Iconify icon='bxs:user-account' color={iconColor} size={30} />
        </TouchableOpacity>
      </View>
      {isLoading
        ? <ActivityIndicator size={'large'} style={{ marginTop: 50 }} color={tintColor}></ActivityIndicator>
        : <Animated.View style={[animatedStyle, { paddingBottom: 80, paddingHorizontal: 10, paddingVertical: 20 }]}>
          {trips.length > 0 && <GridLayout isScrollNested={false} data={trips} renderItem={(item) => <Item trip={item} />} numColumns={3} />}
          {trips.length === 0 && !isLoading && (
            <View style={{ justifyContent: 'center', width: '100%', alignContent: 'center', alignItems: 'center' }}>
              <Iconify icon='tabler:photo-off' size={64} color={iconColor} style={{ margin: 20 }} />
              <Text style={[styles.title, { textAlign: 'center' }]}>No journals yet</Text>
            </View>
          )}
        </Animated.View>}
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
