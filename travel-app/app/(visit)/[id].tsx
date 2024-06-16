import React, { ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Image, useColorScheme, Pressable, Animated, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { CommentDetails, VisitDetails } from '@/types/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth } from '@/provider/AuthProvider';
import PagerView from 'react-native-pager-view';
import Colors from '@/constants/Colors';
import CommentsBottomSheet from '@/components/CommentsBottomSheet';
import Comment from '@/components/Comment';
import { ScrollView } from 'react-native-gesture-handler';
import { useFontSize } from '@/hooks/useFontSize';

export default function Visit() {
  const { id } = useLocalSearchParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [visit, setVisit] = useState<VisitDetails>();
  const [comments, setComments] = useState<CommentDetails[]>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const userID = useAuth().user?.id;

  useEffect(() => {
    getVisit();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getComments();
    }, [])
  );

  const getVisit = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('visit').select(`*, image(*)`).eq('id', id).single();

      if (error) throw error;
      if (visit === null) throw error;

      // map response data to TripData type
      const visitData: VisitDetails = {
        id: data.id,
        description: data.description,
        lat: data.lat,
        long: data.long,
        name: data.name,
        trip_id: data.trip_id,
        images: data.image,
      };

      if (data !== undefined) setVisit(visitData);
    } catch (err) {
      console.log('visit [id] get visit: ', err);
      alert('There was an error while retriving data from the server');
    } finally {
      setLoading(false);
    }
  };

  const getComments = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase.from('comment').select(`*, profile(*)`).eq('visit_id', id);

      if (error) throw error;
      if (visit === null) throw error;

      const commentsData: CommentDetails[] = data.map((x) => ({
        commentID: x.id,
        commentContent: x.comment,
        user: x.profile?.username!,
      }));
      setComments(commentsData);

      console.log(data);
      console.log(commentsData);
    } catch (err) {
      console.log('comments: ', err);
      alert('Error while fetching the comments');
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const postComment = async (comment: string) => {
    if (!visit || !comments || !userID || !comment || comment === '') return;
    try {
      const { data, error } = await supabase.from('comment').insert({ profile_id: userID, comment: comment, visit_id: visit?.id });
      if (error) throw error;
      scrollViewRef.current?.scrollToEnd();
    } catch (err) {
      console.log('visit [id] post comment: ', err);
      alert('There was an error with posting your comment, please try again later');
    } finally {
      getComments();
    }
  };

  const onKeyBoardDismissModal = () => {
    bottomSheetModalRef.current?.snapToIndex(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{visit?.name}</Text>
      </View>
      {!visit ? (
        <View style={styles.carousel}></View>
      ) : (
        <PagerView style={styles.carousel} initialPage={0} scrollEnabled={visit.images.length > 1}>
          {visit.images.map((item, index) => (
            <View style={styles.page} key={index}>
              <Image source={{ uri: item.url! }} style={{ resizeMode: 'cover', width: '100%', height: '100%' }} />
            </View>
          ))}
        </PagerView>
      )}

      <View style={{ flex: 0.5 }}>
        <View style={[styles.section, { marginTop: 0 }]}>
          <Text style={[styles.title, styles.sectionHeader, { fontSize: useFontSize() * 1.1 }]}>Description</Text>
          {visit && <Text>{visit?.description}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={[styles.title, styles.sectionHeader, { fontSize: useFontSize() * 1.1 }]}>Comments</Text>
          <Pressable onPress={toggleModal}>
            <Text style={{ color: useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tabIconDefault }}>Show all the comments</Text>
          </Pressable>
          {comments &&
            comments.slice(0, 2).map((comment, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                <Comment comment={comment} />
              </View>
            ))}
          {comments && <CommentsBottomSheet dismissModal={onKeyBoardDismissModal} postComment={postComment} ref={bottomSheetModalRef} scrollViewRef={scrollViewRef} comments={comments} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    flex: 0.45,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingBottom: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
