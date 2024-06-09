import { SafeAreaView, Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { supabase } from '@/lib/supabase';
import ParticipantChipWithRemove from '@/components/ParticipantChipWithRemove';
import { useAuth } from '@/provider/AuthProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Add Participants component, used to display the modal
 * that handles the addition of participants to a trip
 */

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  participants: User[];
  removeParticipant: (index: number) => void;
  addParticipant: (user: User) => void;
}

interface User {
  id: string;
  username: string | null;
  role: string;
}

export default function AddParticipantsModal({ isModalVisible, toggleModal, participants, removeParticipant, addParticipant }: Props) {
  const colorScheme = useColorScheme();
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [userText, OnChangeUser] = useState<string>('');
  const userID = useAuth().user?.id;

  const topPadding = useSafeAreaInsets().top;

  const iconColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;
  const backgroundColor = useColorScheme() === 'light' ? Colors.light.background : Colors.dark.background;
  const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;

  useEffect(() => {
    if (userText == '') setSearchResults([]);
  }, [userText]);

  const handleSearch = async (text: string) => {
    try {
      OnChangeUser(text);

      if (text !== '') {
        const { data, error } = await supabase.from('profile').select('id, username').neq('id', userID).ilike('username', `${text}%`).limit(10);

        if (error) throw error;

        // map response data to TripData type
        const userData: User[] = data.map((user) => ({
          id: user.id,
          username: user.username,
          role: 'participant',
        }));

        if (error) {
          console.error('Error fetching search results:', error);
        } else {
          setSearchResults(userData);
        }
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.log('add part: ', err);
      alert('There was an error while fetching data from the server');
    }
  };

  return (
    <Modal visible={isModalVisible} statusBarTranslucent={true}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? topPadding : topPadding + 20,
          backgroundColor: 'white',
          paddingBottom: 10,
        }}
      >
        <Pressable onPress={toggleModal}>
          <Iconify testID='close-button' icon='ion:chevron-back-outline' size={28} color={textColor} style={{ marginLeft: 15, flex: 1 }} />
        </Pressable>

        <Pressable onPress={toggleModal}>
          <Iconify icon='ic:round-check' size={28} color={textColor} style={{ marginRight: 15, flex: 1 }} />
        </Pressable>
      </View>
      <View style={{ flex: 1, paddingTop: 10 }}>
        <View style={styles.modalInputContainer}>
          <TextInput onChangeText={handleSearch} placeholder='Search for a user' value={userText} style={styles.modalTextInput} />
        </View>

        <View style={styles.modalDropdown}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
                <Iconify icon='iconoir:user' size={28} color={iconColor} />
                <Pressable
                  onPress={() => {
                    if (item.username) OnChangeUser(item.username);
                  }}
                >
                  <Text>{item.username}</Text>
                </Pressable>
                {/* Display other user information as needed */}
                <Pressable onPress={() => addParticipant(item)}>
                  <Iconify testID='add-button' icon='gala:add' size={22} color={iconColor} style={{ alignSelf: 'flex-end' }} />
                </Pressable>
              </View>
            )}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.title, styles.sectionHeader]}>Partecipants</Text>
          <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', marginTop: 10, marginLeft: 10 }}>
            <View style={{ marginLeft: 10, gap: 10 }}>
              {participants.length === 0 && <Text>No other participants added yet...</Text>}
              {participants.map((participant, index) => (
                <ParticipantChipWithRemove userID={participant.id} key={index} username={participant.username ?? ''} index={index} removeParticipants={removeParticipant} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  modalDropdown: {
    marginLeft: 20,
    display: 'flex',
  },
  modalInputContainer: {
    backgroundColor: 'white',
    marginVertical: 20,
    paddingHorizontal: 5,
    flexDirection: 'row',
    marginLeft: 10,
    height: 40,
    marginRight: 10,
    borderBottomColor: '#737373',
    alignItems: 'center',
    borderRadius: 30,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTextInput: {
    paddingHorizontal: 10,
    flex: 1,
  },
  sectionHeader: {
    paddingBottom: 20,
  },
  section: {
    marginVertical: 20,
  },
});
