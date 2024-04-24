import { Tables } from './schema';

export type Trip = Tables<'trip'>;
export type Visit = Tables<'visit'>;
export type Comment = Tables<'comment'>;
export type Image = Tables<'image'>;
export type Profile = Tables<'profile'>;
export type ProfileTrip = Tables<'profile_trip'>;
export type TripCategory = Tables<'trip_category'>;
export type Category = Tables<'category'>;

export type TripDetails = Trip & {
  categories: Category[];
  partecipants: {
    role: string;
    profile: Profile;
  }[];
};

export type VisitDetails = Visit & {
  images: Image[];
};

export type CommentDetails = {
  commentID: Comment['id'];
  commentContent: Comment['comment'];
  user: Profile['username'];
};
