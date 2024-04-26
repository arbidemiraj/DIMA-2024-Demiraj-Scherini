import { StyleSheet, Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/provider/AuthProvider';
import { Profile, TripDetails } from '@/types/types';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';

export default function Settings() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Profile>();
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const userID = useAuth().user?.id;

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
    if (error) alert(error.message);
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
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Modify Profile</Text>
        <View style={styles.settingsGroup}>
          <Text style={styles.inputHeader}>Full name</Text>
          <Text>{user?.username}</Text>
        </View>
        <View>
          <Text style={styles.inputHeader}>Biography</Text>
          <Text>{user?.biography}</Text>
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
            labelStyle={{ color: useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text }}
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
    </View>
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
    paddingVertical: 20,
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
