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
  profile_trip: {
    role: string;
    profile: Profile;
  }[];
};
