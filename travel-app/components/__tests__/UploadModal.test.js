import React from 'react';
import { render } from '@testing-library/react-native';
import UploadModal from '@/components/UploadModal';
import Colors from '@/constants/Colors';

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn().mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 }),
  }));

describe('UploadModal', () => {
    it('should render loading state correctly', () => {
        const { getByText, getByTestId } = render(<UploadModal loading={true} isModalVisible={true} />);
        
        expect(getByTestId('activity-indicator')).toBeTruthy();
        expect(getByText('Creating journal...')).toBeTruthy();
    });

    it('should render success state correctly', () => {
        const { getByText } = render(<UploadModal loading={false} isModalVisible={true} />);
        
        expect(getByText('Journal created successfully')).toBeTruthy();
    });

    it('should not render modal when not visible', () => {
        const { queryByText } = render(<UploadModal loading={true} isModalVisible={false} />);
        
        expect(queryByText('Creating journal...')).toBeNull();
    });
});
