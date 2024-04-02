import { StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { TripDetails } from '@/types/types';
import TripList from '@/components/TripList';
import GooglePlacesInput from '@/components/GooglePlacesInput';
import { SafeAreaView, View } from '@/components/Themed';
import useStore from '@/store/store';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function TabOneScreen() {
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1); // starting page is 1
  const [pageSize, setPageSize] = useState<number>(5); // page content size is 5
  const [hasMore, setHasMore] = useState<boolean>(true);
  // overlay logic
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<number>(0);

  const { categoriesList } = useStore();

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  useEffect(() => {
    getTrips();
  }, [coordinates, categoryFilter]); //added filters dependencies

  // When the user reaches the end of the list this function gets called
  const handleEndReached = () => {
    if (hasMore) {
      getTrips();
    }
  };

  // When applying filters it resets all for the reloading
  const resetPage = () => {
    setPage(1);
    setTrips([]);
    setHasMore(true);
  }

  const getTrips = async () => {
    if (isLoading || !hasMore) return; // if there is no more content stop
    setLoading(true);
    try {    
      let query = supabase
      .from('trip')
      .select(`*, category!inner(*), profile_trip(role, profile(*)), visit!inner(lat, long, description, name, image(*))`);
      //!inner to filter on the inner's table attributes
      
      //if the user has selected a place it will filter the trips with visits near the selected place
      //lat: [coo.lat - 1, coo.lat + 1] 
      // 1 degree of latitude = 111.321 km
      if (coordinates) {
          query = query
          .gte('visit.lat', (coordinates.latitude - 1).toString()) //greater or equal
          .lte('visit.lat', (coordinates.latitude + 1).toString()) //less or equal
          .gte('visit.long', (coordinates.longitude - 1).toString())
          .lte('visit.long', (coordinates.longitude + 1).toString());
      }

      if(categoriesList.length > 0) {
        query = query.in('category.name', categoriesList);
      }

      const { data, error } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('id');

      if (error) throw error;
      if (trips === null) throw error;

      //console.dir(data);

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
        visits: trip.visit.map((visit) => ({
          lat: visit.lat,
          long: visit.long,
          description: visit.description,
          name: visit.name,
          images: visit.image,
        }))
      }));

      if (data?.length === 0) {
        setHasMore(false);
      } else {
        setTrips((prevTrips) => [...prevTrips, ...tripDetailsData]); // add newly-retrieved data to trips
        setPage((page) => (page + 1)); // increment for pagination
      }
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  //called when a place to search is selected
  const handlePlaceSelect = (data: any, details: any = null) => {
    resetPage();

    if (details) {
      const { lat, lng } = details.geometry.location;
      setCoordinates({ latitude: lat, longitude: lng });
    }else{
      setCoordinates(null); 
    }
  };

  //called when apply filters is pressed
  const handleCategorySelect = () => {
    resetPage();

    //to make the useEffect hook execute
    setCategoryFilter(categoryFilter => categoryFilter + 1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ paddingBottom: 0 }}>
        <GooglePlacesInput toggleOverlay={toggleOverlay} handlePlaceSelect={handlePlaceSelect} handleCategorySelect={handleCategorySelect}/>
      </SafeAreaView>
      <TripList trips={trips} isLoading={isLoading} handleEndReached={handleEndReached} />
      {showOverlay && <View style={styles.overlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
