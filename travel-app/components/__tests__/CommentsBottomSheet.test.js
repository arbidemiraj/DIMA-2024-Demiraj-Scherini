import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CommentsBottomSheet from '@/components/CommentsBottomSheet';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return {
    BottomSheetModal: React.forwardRef(({ children, ...props }, ref) => {
      return <div ref={ref} {...props}>{children}</div>;
    }),
    BottomSheetTextInput: React.forwardRef(({ children, ...props }, ref) => {
      return <input ref={ref} {...props}>{children}</input>;
    }),
  };
});

jest.mock('@/components/Themed', () => {
  const React = require('react');
  return {
    Text: ({ children }) => <text>{children}</text>,
    View: ({ children }) => <view>{children}</view>,
    BottomSheetView: ({ children }) => <view>{children}</view>,
    SafeAreaView: React.forwardRef(({ children, ...props }, ref) => <safearea ref={ref} {...props}>{children}</safearea>),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    ScrollView: React.forwardRef(({ children, ...props }, ref) => <scrollview ref={ref} {...props}>{children}</scrollview>),
  };
});


jest.mock('@/components/Comment', () => ({ comment }) => <div>{comment.text}</div>);

describe('CommentsBottomSheet', () => {
  const postComment = jest.fn();
  const dismissModal = jest.fn();
  const scrollViewRef = createRef();
  const bottomSheetModalRef = createRef();

  //TODO - Add tests

  /*
  it('renders correctly with no comments', async () => {
    const {findByTestId, debug} = render(
      <CommentsBottomSheet
        ref={bottomSheetModalRef}
        comments={[]}
        postComment={postComment}
        dismissModal={dismissModal}
        scrollViewRef={scrollViewRef}
      />
    );
    debug(); // Output the rendered component for debugging
  
  const noCommentsElement = await findByTestId('no-comments');
  expect(noCommentsElement).toBeTruthy();
  });
  */
 
  it('renders correctly with comments', async () => {
    const comments = [{ id: 1, text: 'Comment 1' }, { id: 2, text: 'Comment 2' }];
    const {findByTestId, debug} = render(
      <CommentsBottomSheet
        ref={bottomSheetModalRef}
        comments={comments}
        postComment={postComment}
        dismissModal={dismissModal}
        scrollViewRef={scrollViewRef}
      />
    );
    //debug(); // Output the rendered component for debugging

    const commentsScrollView = await findByTestId('comments');
    expect(commentsScrollView).toBeTruthy();
  });

  // Additional tests
});
