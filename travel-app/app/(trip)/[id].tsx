import React, { ReactNode, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { View as DefaultView, Modal, Platform } from 'react-native';
import useDateFormatter from '@/hooks/useDateFormatter';
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Image } from 'react-native';
import { TripDetails, VisitDetails } from '@/types/types';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Iconify } from 'react-native-iconify';
import { Pressable } from 'react-native';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import TripMap from '@/components/TripMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParticipanrChip from '@/components/ParticipantChip';
import { useFontSize } from '@/hooks/useFontSize';

export default function Trip() {
  const { id } = useLocalSearchParams();

  const [trip, setTrip] = useState<TripDetails>();
  const [visits, setVisits] = useState<VisitDetails[]>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [isFav, setFav] = useState<boolean>(false);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const [isMapFullScreen, setMapFullScreen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const colorScheme = useColorScheme();

  // Returns if the user has scrolled past the cover image
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 350) setHasScrolled(true);
    else setHasScrolled(false);
  };

  // Returns the insets for applying safeArea paddings
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getIsFav();
    getTrip();
    getVisits();
  }, []);

  /**
   * Uncomment for scrolling problems with map
   * testing, combine it with console.log in handleRelease
   * and handleMapTouch in TripMap.tsx to understand when it locks
   */

  // Get the visits (activities) done during the trip
  const getVisits = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase.from('visit').select(`*, image(*)`).eq('trip_id', id);
      if (error) throw error;

      // map query data result to VisitDetails[]
      //console.dir(data);
      const visits: VisitDetails[] = data.map((visit) => ({
        id: visit.id,
        description: visit.description,
        name: visit.name,
        lat: visit.lat,
        long: visit.long,
        trip_id: visit.trip_id,
        images: visit.image,
      }));
      setVisits((prev) => (prev = visits));
    } catch (err) {
      console.log('trip [id] get visits: ', err);
      alert('There was an error while fetching data from the server');
    } finally {
      setLoading(false);
    }
  };

  // Get data of the trip
  const getTrip = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.from('trip').select(`*, category(*), visit(*, image(*)), profile_trip(role, profile(*))`).eq('id', id).single();

      if (error) throw error;

      // map query data to TripDetails
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
      });
    } catch (err) {
      console.log('trip [id] get trip data: ', err);
      alert('There was an error while fetching data from the server');
    } finally {
      setLoading(false);
    }
  };

  //called when the favourite button is pressed
  const handleFav = async () => {
    setFav((prev) => !prev);
    storeIsFav(!isFav);
  };

  //handle full screen button of the map
  const handleFullScreen = () => {
    setMapFullScreen(!isMapFullScreen);
  };

  //gets if the trip is in the user favourites or not
  const getIsFav = async () => {
    if (!id) return;

    try {
      const stringValue = await AsyncStorage.getItem(id.toString());

      if (stringValue !== null) {
        setFav(JSON.parse(stringValue));
      } else {
        setFav(false);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  //saves the new fav value for the current trip
  const storeIsFav = async (value: boolean) => {
    if (!id) return;

    try {
      await AsyncStorage.setItem(id.toString(), JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * The following components are interactive buttons
   * displayed over the cover image of the Trip
   */
  function BackButton(): ReactNode {
    return (
      <Pressable onPress={() => router.back()}>
        <Iconify icon='ion:chevron-back-outline' size={28} color={'#FFF'} />
      </Pressable>
    );
  }

  function FavouriteButton(): ReactNode {
    return <Pressable onPress={handleFav}>{isFav ? <Iconify icon='ph:heart-fill' size={32} color={'#FFF'} /> : <Iconify icon='ph:heart-duotone' size={32} color={'#FFF'} />}</Pressable>;
  }

  // dynamically apply the statusBar style to the statusBar based on OS, theme and scrolling
  const styleStatusBar = (): StatusBarStyle => {
    let style: StatusBarStyle = 'auto';
    if (Platform.OS === 'android') style = 'light';
    else if (colorScheme === 'dark' && (hasScrolled || isMapFullScreen)) style = 'light';
    else if (colorScheme === 'dark' && !(hasScrolled || isMapFullScreen)) style = 'light';
    else if (colorScheme === 'light' && (hasScrolled || isMapFullScreen)) style = 'dark';
    else style = 'light';
    return style;
  };

  return (
    <ScrollView style={styles.item} snapToAlignment={'start'} scrollEnabled={scrollEnabled} onScroll={handleScroll} scrollEventThrottle={1}>
      {/* modify the back arrow to be always white only in this page, create a custom function that compute the correct color*/}
      <StatusBar animated={false} style={styleStatusBar()} backgroundColor='rgba(0,0,0,0.3)' />
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            headerShown: hasScrolled,
            headerStyle: { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background },
            headerTitle: trip?.name!,
            headerLeft: () => <></>,
            headerRight: () => <></>,
          }}
        />
      )}
      {Platform.OS === 'android' && <Stack.Screen options={{ headerShown: false }} />}
      {/* modify the status bar only in this page*/}
      <DefaultView style={styles.imageContainer}>
        <View>
          <Image testID='cover-image' source={{ uri: trip?.cover_url }} style={styles.image} />
          {trip && (
            <DefaultView style={styles.overlay}>
              <DefaultView style={{ padding: 20, marginBottom: 10 }}>
                <Text style={{ color: Colors.dark.text, fontWeight: 'bold', fontSize: 28 }}>{trip?.name}</Text>
                <Text style={[{ color: Colors.dark.text }, styles.overlayText]}>Author - {trip?.partecipants.filter((x) => x.role === 'author')[0].profile.username}</Text>
                <Text style={[{ color: Colors.dark.text }, styles.overlayText]}>
                  From {useDateFormatter(trip?.start_date!)} to {useDateFormatter(trip?.end_date!)}
                </Text>
              </DefaultView>
              <View style={[styles.buttonsContainer, { marginTop: insets.top }]}>
                <BackButton />
                <FavouriteButton />
              </View>
            </DefaultView>
          )}
        </View>
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
          <Text style={{ fontSize: useFontSize() }}>{trip && trip.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.title, styles.sectionHeader]}>Partecipants</Text>
          <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap' }}>
            {trip?.partecipants
              .filter((x) => x.role === 'author')
              .map((user, index) => (
                <ParticipanrChip userID={user.profile.id} key={index} username={user.profile.username!} role={user.role} />
              ))}
            {trip?.partecipants
              .filter((x) => x.role === 'participant')
              .map((user, index) => (
                <ParticipanrChip userID={user.profile.id} key={index} username={user.profile.username!} role={user.role} />
              ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.title, styles.sectionHeader]}>Visits</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 15 }}>
            {visits &&
              visits.map((visit, index) => (
                <View key={index} style={{ flexBasis: '30%', aspectRatio: 1, maxHeight: 175, maxWidth: 175, minWidth: 100, minHeight: 100, marginBottom: 5 }}>
                  <Link href={{ pathname: '/(visit)/[id]', params: { id: visit.id } }} asChild>
                    <Pressable>
                      <Image testID='visit-image' key={index} source={{ uri: visit.images[0].url! }} style={{ height: '100%', width: '100%', resizeMode: 'cover', borderRadius: 10 }} />
                    </Pressable>
                  </Link>
                </View>
              ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Itinerary</Text>
        </View>
        {visits && <TripMap scrollEnabled={scrollEnabled} setScrollEnabled={setScrollEnabled} visits={visits} handleFullScreen={handleFullScreen} isMapFullScreen={isMapFullScreen} />}
        <Modal visible={isMapFullScreen} statusBarTranslucent={true}>
          {visits && <TripMap scrollEnabled={scrollEnabled} setScrollEnabled={setScrollEnabled} visits={visits} handleFullScreen={handleFullScreen} isMapFullScreen={isMapFullScreen} />}
        </Modal>
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
    paddingBottom: 20,
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
  buttonsContainer: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 1,
    backgroundColor: 'transparent',
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
});
