import React from 'react';
import { render } from '@testing-library/react-native';
import Comment from '@/components/Comment';

describe('Comment component test', () => {
  const comment = {
    user: 'Test User',
    commentContent: 'This is a test comment',
  };

  it('Should render the user comment correctly', async () => {
    const { getByText } = render(<Comment comment={comment} />);

    const userName = getByText('Test User');
    const commentContent = getByText('This is a test comment');

    // Check if user name is rendered correctly
    expect(userName).toBeTruthy();

    // Check if comment content is rendered correctly
    expect(commentContent).toBeTruthy();
  });

  it("should render the user's comment style correctly", async () => {
    const { getByText } = render(<Comment comment={comment} />);

    const userName = getByText('Test User');

    // Check if the shape of the user name is bold
    const userNameStyle = userName.props.style.find((styleObj) => styleObj.fontWeight);
    expect(userNameStyle.fontWeight).toEqual('bold');

    // Check if the shape of the user name has a margin bottom
    const userNameMarginBottom = userName.props.style.find((styleObj) => styleObj.marginBottom);
    expect(userNameMarginBottom.marginBottom).toEqual(5);
  });
});
