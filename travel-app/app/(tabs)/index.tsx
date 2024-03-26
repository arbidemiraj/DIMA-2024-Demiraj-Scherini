import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { TripDetails } from '@/types/types';
import TripList from '@/components/TripList';
import GooglePlacesInput from '@/components/GooglePlacesInput';

export default function TabOneScreen() {
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1); // starting page is 1
  const [pageSize, setPageSize] = useState<number>(5); // page content size is 5
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    getTrips();
  }, []);

  // When the user reaches the end of the list this function gets called
  const handleEndReached = () => {
    if (hasMore) {
      getTrips();
    }
  };

  const getTrips = async () => {
    if (isLoading || !hasMore) return; // if there is no more content stop
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip')
        .select(`*, category(*), profile_trip(role, profile(*))`)
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
      }));

      if (data?.length === 0) {
        setHasMore(false);
      } else {
        setTrips((prevTrips) => [...prevTrips, ...tripDetailsData]); // add newly-retrieved data to trips
        setPage(page + 1); // increment for pagination
      }
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesInput />
      <TripList trips={trips} isLoading={isLoading} handleEndReached={handleEndReached} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
