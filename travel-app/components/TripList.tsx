import { FlatList, ActivityIndicator, useColorScheme } from 'react-native';
import React from 'react';
import { TripDetails } from '@/types/types';
import Colors from '@/constants/Colors';
import TripCard from './TripCard';

/**
 * TripList: component that displays the list of Trip passed as
 * a prop. Has some additional logic (handleEndReached, renderFooter)
 */

interface Props {
  trips: TripDetails[];
  isLoading: boolean;
  handleEndReached: () => void;
}

export default function TripList({ trips, isLoading, handleEndReached }: Props) {
  // Simple loader to be rendered while loading
  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size='large' color={useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint} style={{ marginTop: 15 }} />;
  };

  // This is the actual page content
  return (
    <FlatList
      // For memory optimization
      removeClippedSubviews
      data={trips}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={5}
      // Render a TripCard component for each trip
      renderItem={({ item }) => <TripCard trip={item} />}
      ListFooterComponent={renderFooter}
      // These attributes handle infinite scrolling
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      //TODO: address responsiveness
      //numColumns={numColumns}
    />
  );
}
