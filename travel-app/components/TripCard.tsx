import { Image, Pressable, StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import React, { memo } from 'react';
import { TripDetails } from '@/types/types';
import useDateFormatter from '@/hooks/useDateFormatter';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
/**
 * TripCard: component that renders a Trip general details
 * Trip details displayed:
 *  - cover
 *  - name
 *  - author
 *  - score
 *  - start & end dates
 */

interface Props {
  trip: TripDetails;
}

// using memo for performance optimization
export default memo(function TripCard({ trip }: Props) {
  const scoreIconColor = useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint;

  return (
    <Link href={{ pathname: '/(trip)/[id]', params: { id: trip.id } }} asChild testID='profile-link' style={{ flex: 0.5 }}>
      <Pressable>
        <View style={styles.item}>
          <Image source={{ uri: trip.cover_url }} style={styles.image} testID='trip-cover-image' />
          <View style={styles.detailsContainer}>
            <View style={styles.detailsTitle}>
              <Text style={styles.title}>{trip.name}</Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.star, { color: scoreIconColor }]}>✱</Text>
                <Text style={styles.score}>{trip.score?.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={{ fontWeight: '300' }}>Author - {trip.partecipants[0].profile.username}</Text>
            <Text style={{ fontWeight: '300' }}>
              {/* TODO: remove ! and fix DB*/}
              From {useDateFormatter(trip.start_date!)} to {useDateFormatter(trip.end_date!)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  image: {
    height: 260,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  detailsContainer: {
    paddingVertical: 10,
    gap: 1,
  },
  detailsTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  star: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  score: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
