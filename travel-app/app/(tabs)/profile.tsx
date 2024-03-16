import { Alert, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from '@/components/Themed';
import { Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';

export default function Profile() {

  const doLogOut = async () => {
    console.log("logging out")
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
  }

  const user = useAuth().user?.email;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Welcome {user}</Text>
      <Pressable onPress={doLogOut}>
        <Text>Log Out</Text>
      </Pressable>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
