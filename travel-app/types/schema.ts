export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      category: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      comment: {
        Row: {
          comment: string;
          id: number;
          profile_id: string;
          visit_id: number;
        };
        Insert: {
          comment: string;
          id?: number;
          profile_id: string;
          visit_id: number;
        };
        Update: {
          comment?: string;
          id?: number;
          profile_id?: string;
          visit_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_visit_id_fkey';
            columns: ['visit_id'];
            isOneToOne: false;
            referencedRelation: 'visit';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_comment_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          }
        ];
      };
      image: {
        Row: {
          id: number;
          url: string | null;
          visit_id: number | null;
        };
        Insert: {
          id?: number;
          url?: string | null;
          visit_id?: number | null;
        };
        Update: {
          id?: number;
          url?: string | null;
          visit_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'image_visit_id_fkey';
            columns: ['visit_id'];
            isOneToOne: false;
            referencedRelation: 'visit';
            referencedColumns: ['id'];
          }
        ];
      };
      profile: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      profile_trip: {
        Row: {
          profile_id: string;
          role: string | null;
          trip_id: number;
        };
        Insert: {
          profile_id: string;
          role?: string | null;
          trip_id: number;
        };
        Update: {
          profile_id?: string;
          role?: string | null;
          trip_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_trip_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trip';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_profile_trip_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          }
        ];
      };
      trip: {
        Row: {
          cover_url: string;
          description: string | null;
          end_date: string | null;
          id: number;
          name: string | null;
          score: number | null;
          start_date: string | null;
        };
        Insert: {
          cover_url: string;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          name?: string | null;
          score?: number | null;
          start_date?: string | null;
        };
        Update: {
          cover_url?: string;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          name?: string | null;
          score?: number | null;
          start_date?: string | null;
        };
        Relationships: [];
      };
      trip_category: {
        Row: {
          category_id: number;
          created_at: string;
          trip_id: number;
        };
        Insert: {
          category_id: number;
          created_at?: string;
          trip_id: number;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          trip_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'public_trip_category_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'category';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_trip_category_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trip';
            referencedColumns: ['id'];
          }
        ];
      };
      visit: {
        Row: {
          description: string | null;
          id: number;
          name: string;
          score: number | null;
          trip_id: number;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name: string;
          score?: number | null;
          trip_id: number;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
          score?: number | null;
          trip_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'visit_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trip';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database }, TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views']) : never = never> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database }, TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions['schema']]['Tables'] : never = never> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database }, TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions['schema']]['Tables'] : never = never> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database }, EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums'] : never = never> = PublicEnumNameOrOptions extends { schema: keyof Database } ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName] : PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] ? PublicSchema['Enums'][PublicEnumNameOrOptions] : never;
