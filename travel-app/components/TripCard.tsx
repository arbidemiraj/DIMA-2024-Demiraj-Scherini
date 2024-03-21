import { Image, StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import React, { memo } from 'react';
import { TripDetails } from '@/types/types';
import useDateFormatter from '@/hooks/useDateFormatter';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface Props {
  trip: TripDetails;
}

// using memo for performance optimization
export default memo(function TripCard({ trip }: Props) {
  return (
    <View style={styles.item}>
      <Image source={{ uri: trip.cover_url }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.detailsTitle}>
          <Text style={styles.title}>{trip.name}</Text>
          <View style={styles.scoreContainer}>
            {/* TODO: can use an icon instead of text*/}
            <Text style={[styles.star, { color: useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint }]}>✱</Text>
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
