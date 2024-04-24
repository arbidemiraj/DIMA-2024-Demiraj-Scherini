import React, { ReactNode } from 'react';
import { View, Text } from '@/components/Themed';
import { CommentDetails } from '@/types/types';

interface CommentProps {
  comment: CommentDetails;
}

export default function Comment({ comment }: CommentProps): ReactNode {
  return (
    <View style={{ marginVertical: 5 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{comment.user}</Text>
      <Text>{comment.commentContent}</Text>
    </View>
  );
}
