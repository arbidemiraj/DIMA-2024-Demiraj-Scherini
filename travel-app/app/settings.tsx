import { StyleSheet, Appearance, ColorSchemeName, useColorScheme, Pressable } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';
import { Profile, TripDetails } from '@/types/types';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import { TextInput } from 'react-native-gesture-handler';
import { Iconify } from 'react-native-iconify';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

export default function Settings() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Profile>();
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const userID = useAuth().user?.id;
  const [username, setUsername] = useState<string>();
  const [bio, setBio] = useState<string>();

  const tintColor = useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint;
  const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;

  useEffect(() => {
    getUser();
    getPreferences();
  }, []);

  const getPreferences = async () => {
    try {
      const value = await AsyncStorage.getItem('appearenceId');
      if (value !== null) {
        setSelectedId(value);
      } else {
        setSelectedId('1');
      }
    } catch (error) {
      alert('Could not load user preferences');
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      if (userID === undefined) {
        alert('No user logged-in');
        return;
      }
      const { data, error } = await supabase.from('profile').select('*').eq('id', userID).single();

      if (data?.username) setUsername(data?.username);
      if (data?.biography) setBio(data.biography);

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
    if (error) alert('Impossible to logout');
  };

  const handleUpdateUsername = async () => {
    if (username === '' || !user) return;

    const { data, error } = await supabase.from('profile').update({ username: username }).eq('id', user?.id).select();
    if (error) alert('There was an error while updating the username');

    alert('You have successfully updated your name!');
  };

  const handleUpdateBio = async () => {
    if (bio === '' || !user) return;

    if (bio?.length && bio?.length > 400) {
      alert('The bio is too long');
      return;
    }

    const { data, error } = await supabase.from('profile').update({ biography: bio }).eq('id', user?.id).select();
    if (error) alert('There was an error while updating the username');

    alert('You have successfully updated your bio!');
  };

  const radioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'System Default',
        value: 'system',
      },
      {
        id: '2',
        label: 'Light Theme',
        value: 'light',
      },
      {
        id: '3',
        label: 'Dark Theme',
        value: 'dark',
      },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const changeColorTheme = async (id: string) => {
    const value = radioButtons.filter((x) => x.id === id)[0].value;

    setSelectedId(id);

    try {
      await AsyncStorage.setItem('appearenceId', id);
    } catch (error) {
      console.log(error);
      alert('Could not save user preference');
    }

    if (value === 'light') Appearance.setColorScheme('light');
    else if (value === 'dark') Appearance.setColorScheme('dark');
    else Appearance.setColorScheme(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.section, { borderBottomWidth: 0 }]}>
        <Text style={styles.title}>Modify Profile</Text>
        <View style={styles.settingsGroup}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.inputHeader}>Full name</Text>
            <TouchableOpacity>
              <Pressable onPress={handleUpdateUsername}>{({ pressed }) => <Iconify style={{ opacity: pressed ? 0.5 : 1 }} icon='material-symbols:send' size={26} color={tintColor} />}</Pressable>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomWidth: 1, marginVertical: 10, paddingVertical: 10 }}>{user && <TextInput style={{ color: textColor }} value={username} onChangeText={setUsername} />}</View>
        </View>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.inputHeader}>Biography (max 400 characters)</Text>
            <Pressable onPress={handleUpdateBio}>{({ pressed }) => <Iconify style={{ opacity: pressed ? 0.5 : 1 }} icon='material-symbols:send' size={26} color={tintColor} />}</Pressable>
          </View>
          <View style={{ borderBottomWidth: 1, marginVertical: 10, paddingVertical: 10 }}>{user && <TextInput style={{ color: textColor }} multiline value={bio} onChangeText={setBio} />}</View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Settings</Text>
        <View style={{ marginVertical: 10 }}>
          <Text style={[styles.inputHeader, { marginVertical: 10 }]}>Change Color Theme</Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={(id) => changeColorTheme(id)}
            selectedId={selectedId}
            labelStyle={{ color: textColor }}
            containerStyle={{ display: 'flex', alignItems: 'flex-start' }}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.title, { marginBottom: 10 }]}>Access</Text>
        <View style={styles.settingsGroup}>
          <CustomButton func={doLogOut} altStyle={false} text='Logout from your Account' />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 15,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingsGroup: {
    marginVertical: 15,
  },
  inputHeader: {
    fontWeight: 'bold',
  },
});
