import { FlatList, ActivityIndicator, useColorScheme, Dimensions, View } from 'react-native';
import React, { useEffect } from 'react';
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
  const { width } = Dimensions.get('window');
  const numColumns = width < 768 ? 1 : 2;

  // Simple loader to be rendered while loading
  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator testID={'loading-indicator'} size='large' color={useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint} style={{ marginTop: 15 }} />;
  };

  // This is the actual page content
  return (
    <View style={{flex: 1}}>
      {trips.length > 0 && <FlatList
        // For memory optimization
        key={numColumns}
        removeClippedSubviews={true}
        data={trips}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={5}
        // Render a TripCard component for each trip
        renderItem={({ item }) => <TripCard trip={item} />}
        ListFooterComponent={renderFooter}
        // These attributes handle infinite scrolling
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        //TODO: address responsiveness
        numColumns={numColumns}
      />}
    </View>

  );
}
