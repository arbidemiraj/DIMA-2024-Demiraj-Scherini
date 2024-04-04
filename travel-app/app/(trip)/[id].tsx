import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, View } from '@/components/Themed';
import { View as DefaultView, GestureResponderEvent } from 'react-native';
import useDateFormatter from '@/hooks/useDateFormatter';
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Image } from 'react-native';
import { TripDetails, Visit, VisitDetails, Image as ImageType } from '@/types/types';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Iconify } from 'react-native-iconify';
import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Marker } from 'react-native-maps';

interface MarkerInfo {
  lat: number;
  long: number;
  description: string | null;
  name: string;
}

export default function Trip() {
  const { id } = useLocalSearchParams();

  const [trip, setTrip] = useState<TripDetails>();
  const [visits, setVisits] = useState<VisitDetails[]>();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [region, setRegion] = useState<Region>();
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const router = useRouter();

  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    getTrip();
    getVisits();
  }, []);

  const handleMapReady = () => {
    setMapReady(true);
  };

  const handleMapTouch = () => {
    if (!mapReady) return; // Ignore touch events until map is ready
    setScrollEnabled(false); // Disable ScrollView scrolling while interacting with the map
  };

  const handleMapRelease = () => {
    setScrollEnabled(true); // Re-enable ScrollView scrolling when interaction with the map ends
  };

  const calculateRegion = (visits: VisitDetails[]) => {
    const latitudes = visits.map((marker) => marker.lat);
    const longitudes = visits.map((marker) => marker.long);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLong = Math.min(...longitudes);
    const maxLong = Math.max(...longitudes);

    const lat = (maxLat + minLat) / 2;
    const long = (maxLong + minLong) / 2;
    const latDelta = maxLat - minLat + 0.1;
    const longDelta = maxLong - minLong + 0.1;

    setRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    });
  };

  const getVisits = async () => {
    try {
      const { data, error } = await supabase.from('visit').select(`*, image(*)`).eq('trip_id', id);
      if (error) throw error;

      console.dir(data);
      const visits: VisitDetails[] = data.map((visit) => ({
        id: visit.id,
        description: visit.description,
        name: visit.name,
        score: visit.score,
        lat: visit.lat,
        long: visit.long,
        trip_id: visit.trip_id,
        images: visit.image,
      }));

      calculateRegion(visits); // Calculate the initial region
      setVisits((prev) => (prev = visits));

      const markerData: MarkerInfo[] = visits.map((visit) => ({
        lat: visit.lat,
        long: visit.long,
        description: visit.description ?? null, // Use nullish coalescing operator to handle null values
        name: visit.name,
      }));

      setMarkers((marker) => (marker = markerData));
      //console.log(markerData);
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const getTrip = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('trip').select(`*, category(*), visit(*, image(*)), profile_trip(role, profile(*))`).eq('id', id).single();

      if (error) throw error;

      //console.dir(data);

      // map response data to TripData type
      const trip: TripDetails = {
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
      };

      setTrip((prev) => (prev = trip)); // add newly-retrieved data to trips
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
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
            <Pressable onPress={() => console.log('added to favoutites')}>
              <Iconify icon='ph:heart-duotone' size={32} color={'#FFF'} />
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
          <View style={{ flexDirection: 'row', gap: 25, flexWrap: 'wrap' }}>
            {visits?.map((visit, index) => (
              <Image key={index} source={{ uri: visit.images[0].url! }} style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 10 }} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Itineraty</Text>
        </View>
        <View style={{ flex: 1, height: 250 }}>
          <MapView style={{ flex: 1, borderRadius: 10 }} ref={mapRef} region={region} zoomEnabled={true} scrollEnabled={true} loadingEnabled={true} onMapReady={handleMapReady} onTouchStart={handleMapTouch} onTouchEnd={handleMapRelease}>
            {markers.map((marker, index) => (
              <Marker key={index} coordinate={{ latitude: marker.lat, longitude: marker.long }} title={marker.name} />
            ))}
          </MapView>
        </View>
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
  },
});
