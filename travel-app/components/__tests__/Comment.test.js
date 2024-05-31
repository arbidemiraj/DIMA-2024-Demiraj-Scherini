import React from 'react';
import { render } from '@testing-library/react-native';
import Comment from '@/components/Comment';

describe('Comment component test', () => {
  it('Should render the user comment correctly', async () => {
    const comment = {
      user: 'Test User',
      commentContent: 'This is a test comment',
    };

    const { getByText } = render(<Comment comment={comment} />);

    const userName = getByText('Test User');

    // Check if user name is rendered correctly
    expect(userName).toBeTruthy();

    // Check if the shape of the user name is bold
    const userNameStyle = userName.props.style.find((styleObj) => styleObj.fontWeight);
    expect(userNameStyle.fontWeight).toEqual('bold');

    // Check if the shape of the user name has a margin bottom
    const userNameMarginBottom = userName.props.style.find((styleObj) => styleObj.marginBottom);
    expect(userNameMarginBottom.marginBottom).toEqual(5);

    // Check if comment content is rendered correctly
    expect(getByText('This is a test comment')).toBeTruthy();
  });
});
