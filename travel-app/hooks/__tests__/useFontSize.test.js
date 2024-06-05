import { renderHook } from '@testing-library/react-native';
import { useFontSize, useFontSizeTitle } from '../useFontSize'; // Adjust the path as needed

describe('useFontSize hook', () => {
  it('should return a font size of at least 16', () => {
    const { result } = renderHook(() => useFontSize());
    expect(result.current).toBeGreaterThanOrEqual(16);
  });
});

describe('useFontSizeTitle hook', () => {
  it('should return a font size of at least 16', () => {
    const { result } = renderHook(() => useFontSizeTitle());
    expect(result.current).toBeGreaterThanOrEqual(16);
  });

  it('should return a font size 30% larger than base font size', () => {
    const { result: baseResult } = renderHook(() => useFontSize());
    const { result: titleResult } = renderHook(() => useFontSizeTitle());

    expect(titleResult.current).toBeCloseTo(baseResult.current * 1.3, 5);
  });
});
