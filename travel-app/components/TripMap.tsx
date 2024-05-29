import React, { useEffect, useState, useRef } from 'react';
import { View } from '@/components/Themed';
import { VisitDetails } from '@/types/types';
import MapView, { Region } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Pressable, StyleSheet } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * TripMap: component that displays the map of a Trip,
 * recieves the Visits made by the users and display
 * the markers accordingly.
 * setScrollEnabled : Handles the locking of parent scrollView
 * handleFullScreen : Handles when the map is expanded to fullscreen
 */
interface Props {
  setScrollEnabled: (enable: boolean) => void;
  visits: VisitDetails[];
  isMapFullScreen: boolean;
  handleFullScreen: () => void;
  scrollEnabled: boolean;
}

const TripMap = ({ setScrollEnabled, scrollEnabled, visits, handleFullScreen, isMapFullScreen }: Props) => {
  const [region, setRegion] = useState<Region>();
  const [markers, setMarkers] = useState<VisitDetails[]>([]);
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const insets = useSafeAreaInsets();

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

  // sets the starting region when the map is loaded
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
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <MapView style={styles.map} ref={mapRef} region={region} zoomEnabled={true} scrollEnabled={true} loadingEnabled={true} onMapReady={handleMapReady} onTouchStart={handleMapTouch} onTouchCancel={handleMapRelease} onTouchEndCapture={handleMapRelease}>
          {markers.map((marker, index) => (
            <Marker key={index} coordinate={{ latitude: marker.lat, longitude: marker.long }} title={marker.name}></Marker>
          ))}
        </MapView>
        <View style={{ flex: 1, marginTop: isMapFullScreen ? insets.top : 0, backgroundColor: 'transparent' }} pointerEvents='box-none'>
          {isMapFullScreen ? (
            <Pressable onPress={handleFullScreen} style={styles.mapIconContainer}>
              <Iconify icon='gg:close' size={26} color={'#000'} />
            </Pressable>
          ) : (
            <Pressable onPress={handleFullScreen} style={styles.mapIconContainer}>
              <Iconify icon='gg:expand' size={26} color={'#000'} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

//add dark mode also to map? No because it is native!
const styles = StyleSheet.create({
  mapIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    padding: 5,
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
    ...StyleSheet.absoluteFillObject,
  },
});

export default TripMap;
