import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { GridLayout } from '../GridLayout'; // Adjust the import path accordingly
import { View, Text, Dimensions } from 'react-native';

const mockData = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

const renderItem = (item) => (
  <View testID={`grid-item-${item.id}`} key={item.id}>
    <Text>{item.name}</Text>
  </View>
);

describe('GridLayout', () => {
  it('Should render all items', () => {
    render(<GridLayout data={mockData} renderItem={renderItem} numColumns={3} itemMargin={5} />);

    mockData.forEach((item) => {
      expect(screen.getByTestId(`grid-item-${item.id}`)).toBeTruthy();
      expect(screen.getByText(item.name)).toBeTruthy();
    });
  });

  it('Should render the correct number of columns', () => {
    render(<GridLayout data={mockData} renderItem={renderItem} numColumns={3} itemMargin={5} />);

    const gridItems = screen.getAllByTestId(/grid-item-/);
    expect(gridItems.length).toBe(mockData.length);
  });

  //TODO - Add test for itemMargin prop

  it('Should handle nested scrolling', () => {
    const { getByTestId } = render(
      <GridLayout data={mockData} renderItem={renderItem} numColumns={3} itemMargin={5} isScrollNested={true} />
    );
    const flatList = getByTestId('flat-list');

    expect(flatList.props.scrollEnabled).toBe(true);
  });
});
