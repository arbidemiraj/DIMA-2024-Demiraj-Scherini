import { Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';
import { Profile } from '@/types/types';

export default function ProfilePage() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Profile>();
  const userID = useAuth().user?.id;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      if (userID === undefined) {
        Alert.alert('No user logged-in');
        return;
      }
      const { data, error } = await supabase.from('profile').select('*').eq('id', userID).single();

      if (error) throw error;
      setUser(data);
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const doLogOut = async () => {
    console.log('logging out');
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Displayed Name</Text>
        <Text> {user?.username}</Text>
      </View>
      <Pressable onPress={doLogOut}>
        <Text>Log Out</Text>
      </Pressable>
      <View style={styles.section}>
        <Text style={styles.title}>Biography</Text>
        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur doloremque quisquam ipsum accusamus laudantium placeat at, qui reiciendis provident quis consequatur natus, mollitia iure sequi. Consectetur perferendis expedita atque velit at alias voluptates est minus totam quod. Sint, iure adipisci rerum doloribus nesciunt quia eligendi distinctio natus ullam voluptates. Vel.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 20,
  },
});
