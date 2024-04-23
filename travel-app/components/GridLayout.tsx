import React, { ReactElement, useState } from 'react';
import { View } from '@/components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

interface GridProps<T> {
  data: T[];
  renderItem: (item: T) => ReactElement;
  numColumns?: number;
  itemMargin?: number;
  isScrollNested?: boolean;
}

export function GridLayout<T extends any>({ data, renderItem, numColumns = 3, itemMargin = 0, isScrollNested }: GridProps<T>) {
  const [componentSize, setComponentSize] = useState((Dimensions.get('window').width - itemMargin) / numColumns);
  const renderGridItem = ({ item }: { item: T }) => {
    return <View style={{ margin: itemMargin, flex: 1 / numColumns, height: componentSize }}>{renderItem(item)}</View>;
  };

  return (
    <View>
      <FlatList scrollEnabled={isScrollNested} data={data} renderItem={renderGridItem} keyExtractor={(item, index) => index.toString()} numColumns={numColumns} />
    </View>
  );
}
