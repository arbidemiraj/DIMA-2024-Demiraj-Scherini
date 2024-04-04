import React, { useEffect, useState, useRef } from 'react';
import { View } from '@/components/Themed';
import { VisitDetails } from '@/types/types';
import MapView, { Region } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Pressable, StyleSheet } from 'react-native';
import { Iconify } from 'react-native-iconify';

interface Props {
  setScrollEnabled: (enable: boolean) => void;
  visits: VisitDetails[];
}

interface MarkerInfo {
  lat: number;
  long: number;
  description: string | null;
  name: string;
}

const TripMap = ({ setScrollEnabled, visits }: Props) => {
  const [region, setRegion] = useState<Region>();
  const [markers, setMarkers] = useState<VisitDetails[]>([]);
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMarkers(visits);
    calculateRegion(visits);
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

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} ref={mapRef} region={region} zoomEnabled={true} scrollEnabled={true} loadingEnabled={true} onMapReady={handleMapReady} onTouchStart={handleMapTouch} onTouchEnd={handleMapRelease}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={{ latitude: marker.lat, longitude: marker.long }} title={marker.name}></Marker>
        ))}
      </MapView>
      <Pressable onPress={() => console.log('set map full screen')}>
        <Iconify style={styles.expandIcon} icon='gg:expand' size={22} color={'#000'} />
      </Pressable>
    </View>
  );
};

//add dark mode also to map?
const styles = StyleSheet.create({
  expandIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 5,
    height: 300,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  map: {
    flex: 1,
    width: '100%',
    ...StyleSheet.absoluteFillObject,
  },
});

export default TripMap;
