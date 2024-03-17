import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

export default function TabOneScreen() {

  // Test for supabase query -> WORKING CORRECTLY
  useEffect(() => {
    getTrips();
  }, []);

  const getTrips = async () => {
    const { data: trips, error } = await supabase
      .from('trip')
      .select(`*, trip_category(*, category(*)), profile_trip(*, profile(username))`)
      .eq('profile_trip.role', 'author').order('id');

    if (error) throw error;
    console.dir(trips);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
