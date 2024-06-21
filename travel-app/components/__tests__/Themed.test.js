import { Text, TextInput, ScrollView, View, BottomSheetView, SafeAreaView } from '../Themed';
import { render } from '@testing-library/react-native';
import BottomSheet from '@gorhom/bottom-sheet';

jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn((callback) => callback()),
    useAnimatedScrollHandler: jest.fn().mockImplementation((handlers) => (event) => {
      handlers.onScroll({
        contentOffset: {
          x: event.contentOffset.x,
        },
      });
    }),
    interpolate: jest.fn(),
    interpolateColor: jest.fn(),
  };
});
describe('Themed', () => {
  it('should render Text light theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('light');

    const { getByText } = render(<Text>Test text</Text>);
    const textColor = getByText('Test text').props.style[0].color;
    expect(textColor).toBe('#262626');
  });

  it('should render Text dark theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('dark');

    const { getByText } = render(<Text>Test text</Text>);
    const textColor = getByText('Test text').props.style[0].color;
    expect(textColor).toBe('#F5F5F5');
  });

  it('should render TextInput light theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('light');

    const { getByPlaceholderText } = render(<TextInput placeholder='Test text input' value='Test text' />);
    const placeholderTextColor = getByPlaceholderText('Test text input').props.style[0].color;
    expect(placeholderTextColor).toBe('#262626');
  });

  it('should render TextInput dark theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('dark');

    const { getByPlaceholderText } = render(<TextInput placeholder='Test text input' />);
    const placeholderTextColor = getByPlaceholderText('Test text input').props.style[0].color;
    expect(placeholderTextColor).toBe('#F5F5F5');
  });

  it('should render ScrollView light theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('light');

    const { getByText } = render(
      <ScrollView>
        <Text>Test text</Text>
      </ScrollView>
    );
    // Get the Text element
    const textElement = getByText('Test text');

    // Traverse up the DOM tree to find the ScrollView element
    let component = textElement;
    while (component && component.type !== 'RCTScrollView') {
      component = component.parent;
    }

    const style = component.props.style[0];

    expect(style.backgroundColor).toBe('#FAFAFA');
    expect(style.borderBottomColor).toBe('#CCCCCC');
    expect(style.borderTopColor).toBe('#CCCCCC');
  });

  it('should render ScrollView dark theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('dark');

    const { getByText } = render(
      <ScrollView>
        <Text>Test text</Text>
      </ScrollView>
    );
    // Get the Text element
    const textElement = getByText('Test text');

    // Traverse up the DOM tree to find the ScrollView element
    let component = textElement;
    while (component && component.type !== 'RCTScrollView') {
      component = component.parent;
    }

    const style = component.props.style[0];

    expect(style.backgroundColor).toBe('#171717');
    expect(style.borderBottomColor).toBe('#333333');
    expect(style.borderTopColor).toBe('#333333');
  });

  it('should render View light theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('light');

    const { getByText } = render(
      <View>
        <Text>Test text</Text>
      </View>
    );
    // Get the Text element
    const textElement = getByText('Test text');

    // Traverse up the DOM tree to find the View element
    let component = textElement;

    while (component && component.type !== 'View') {
      component = component.parent;
    }

    const style = component.props.style[0];

    expect(style.backgroundColor).toBe('#FAFAFA');
    expect(style.borderBottomColor).toBe('#CCCCCC');
    expect(style.borderTopColor).toBe('#CCCCCC');
  });

  it('should render View dark theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('dark');

    const { getByText } = render(
      <View>
        <Text>Test text</Text>
      </View>
    );
    // Get the Text element
    const textElement = getByText('Test text');

    // Traverse up the DOM tree to find the View element
    let component = textElement;

    while (component && component.type !== 'View') {
      component = component.parent;
    }

    const style = component.props.style[0];

    expect(style.backgroundColor).toBe('#171717');
    expect(style.borderBottomColor).toBe('#333333');
    expect(style.borderTopColor).toBe('#333333');
  });

  it('should render BottomSheetView light theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('light');
    const { getByText } = render(
      <BottomSheet snapPoints={['20%']}>
        <BottomSheetView>
          <Text>Test text</Text>
        </BottomSheetView>
      </BottomSheet>
    );

    // Get the Text element
    const textElement = getByText('Test text');
    let component = textElement;

    while (component && component.type !== 'View') {
      component = component.parent;
    }
    const style = component.props.style[0][0];

    expect(style.backgroundColor).toBe('#FAFAFA');
  });

  it('should render BottomSheetView dark theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('dark');
    const { getByText } = render(
      <BottomSheet snapPoints={['20%']}>
        <BottomSheetView>
          <Text>Test text</Text>
        </BottomSheetView>
      </BottomSheet>
    );

    // Get the Text element
    const textElement = getByText('Test text');
    let component = textElement;

    while (component && component.type !== 'View') {
      component = component.parent;
    }
    const style = component.props.style[0][0];

    expect(style.backgroundColor).toBe('#171717');
  });

  it('should render SafeAreaView light theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('light');
    const { getByText } = render(
      <SafeAreaView>
        <Text>Test text</Text>
      </SafeAreaView>
    );

    // Get the Text element
    const textElement = getByText('Test text');
    let component = textElement;

    while (component && component.type !== 'RNCSafeAreaView') {
      component = component.parent;
    }
    const style = component.props.style[0];

    expect(style.backgroundColor).toBe('#FAFAFA');
    expect(style.borderBottomColor).toBe('#CCCCCC');
    expect(style.borderTopColor).toBe('#CCCCCC');
  });

  it('should render SafeAreaView dark theme', () => {
    const colorLib = require('../useColorScheme');
    colorLib.useColorScheme.mockReturnValue('dark');
    const { getByText } = render(
      <SafeAreaView>
        <Text>Test text</Text>
      </SafeAreaView>
    );

    // Get the Text element
    const textElement = getByText('Test text');
    let component = textElement;

    while (component && component.type !== 'RNCSafeAreaView') {
      component = component.parent;
    }
    const style = component.props.style[0];

    expect(style.backgroundColor).toBe('#171717');
    expect(style.borderBottomColor).toBe('#333333');
    expect(style.borderTopColor).toBe('#333333');
  });
});
