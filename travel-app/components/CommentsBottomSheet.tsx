import { StyleSheet } from 'react-native';
import React, { forwardRef, useMemo, useEffect, useRef, useState } from 'react';
import { Text, View, BottomSheetView, SafeAreaView } from '@/components/Themed';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { CommentDetails } from '@/types/types';
import { Keyboard } from 'react-native';
import Comment from './Comment';
import { ScrollView } from 'react-native-gesture-handler';

export type Ref = BottomSheetModal;

interface Props {
  comments: CommentDetails[];
  postComment: (comment: string) => void;
  dismissModal: () => void;
  scrollViewRef: React.RefObject<ScrollView>; // Add scrollViewRef prop
}

export default forwardRef<Ref, Props>(function CommentsBottomSheet({ comments, postComment, dismissModal, scrollViewRef }: Props, ref) {
  const isLightTheme = useColorScheme() === 'light';
  const snapPoints = useMemo(() => ['60%'], []);
  const [commentText, setCommentText] = useState<string>('');

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', dismissModal);

    // Clean up the event listener when the component is unmounted
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handlePostMessage = () => {
    postComment(commentText);
    setCommentText('');
  };
  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        backgroundStyle={{ backgroundColor: isLightTheme ? Colors.light.background : Colors.dark.background }}
        handleIndicatorStyle={{ backgroundColor: isLightTheme ? Colors.light.text : Colors.dark.text }}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
          </View>
          {comments.length === 0 ? (
            <View testID={'no-comments'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.title, { fontSize: 20, margin: 5 }]}>No comments for now</Text>
              <Text>Start the conversation!</Text>
            </View>
          ) : (
            <ScrollView testID={'comments'} style={styles.commentsSection} ref={scrollViewRef}>
              {comments &&
                comments.map((comment, index) => (
                  <View key={index} style={[{ marginTop: 10 }, index === comments.length - 1 ? { marginBottom: 40 } : null]}>
                    <Comment comment={comment} />
                  </View>
                ))}
            </ScrollView>
          )}

          <SafeAreaView edges={['bottom']} style={styles.writeSection}>
            <BottomSheetTextInput
              testID='comment-input'
              value={commentText}
              onChangeText={setCommentText}
              returnKeyType='send'
              placeholder='write a comment...'
              style={[styles.textInput, { backgroundColor: useColorScheme() === 'light' ? '#eee' : '#333', color: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text }]}
              placeholderTextColor={useColorScheme() === 'light' ? '#979797' : '#aaaaaa'}
              onSubmitEditing={handlePostMessage}
            />
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentsSection: {
    width: '100%',
    padding: 20,
    flex: 1,
  },
  writeSection: {
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  textInput: {
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
});
