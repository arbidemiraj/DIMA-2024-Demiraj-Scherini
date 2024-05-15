import { ReactNode, useEffect, useState} from 'react';
import { Image, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ScrollView, Text, View, TextInput} from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import CustomButton from '@/components/CustomButton';
import ParticipantChip from '@/components/ParticipantChip';
import AddParticipantsModal from '@/components/AddParticipantsModal';
import NewActivityModal from '@/components/NewActivityModal';
import Tooltip from 'react-native-walkthrough-tooltip';

interface User {
  id: string;
  username: string|null;
}

interface Activity {
  title: string,
  description: string,
  photos: string[],
}

interface TooltipContentProps {
  index: number;
}

export default function NewJournal() {
  const [image, setImage] = useState<string>('');
  const [descriptionText, onChangeDescription] = useState<string>('');
  const [titleText, onChangeTitle] = useState<string>('');
  const [givenStar, onChangeGivenStar] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isActivityModalVisible, setActivityModalVisible] = useState<boolean>(false);
  const [isNewActivityModalVisible, setNewActivityModalVisible] = useState<boolean>(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>({title: '', description: '', photos: []});
  const [tooltipHandlers, setTooltipHandlers] = useState<boolean[]>(Array(activities.length).fill(false));
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;

  //Handles the addition of a new activity by adding the state variable for the associated tooltip 
  useEffect(() => {
    const updated = [...tooltipHandlers];
    updated[activities.length - 1] = false;

    setTooltipHandlers(updated);
  }, [activities]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleActivityModal = () => {
    setActivityModalVisible(!isActivityModalVisible);
  };

  const toggleNewActivityModal = () => {
    setNewActivityModalVisible(!isNewActivityModalVisible);
  };
  
  const handleStar = (index: number) => {
    if(index == givenStar) onChangeGivenStar(0);
    else onChangeGivenStar(index);
  }

  const addParticipant = (user: User) => {
    if(user.username !== null && !participants.includes(user)) setParticipants((prevParticipants) => {
      if (user.username) {
        return [...prevParticipants, user];
      } else {
        return prevParticipants; // Return previous state if username is falsy
      }
    })}
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      detectLabels(result.assets[0].uri);
    }
  };

  /*const uploadImage = async (imageUri:string) => {
    try {
        const { data, error } = await supabase.storage
            .from('images')
            .upload(`image_${Date.now()}`, imageUri);

        if (error) {
            console.error('Error uploading image:', error.message);

            return;
        }

        setImage(imageUri);
        detectLabels(imageUri);
    } catch (error) {
        console.log(error);
    }
  };*/

  const toggleOptionModal = (index: number) => {
    const updated = [...tooltipHandlers];
    updated[index] = !updated[index];

    setTooltipHandlers(updated);
  }

  const removeParticipant = (indexToRemove:number) => {
    setParticipants(participants => participants.filter((_, index) => index !== indexToRemove));
  }

  const deleteActivity = (index: number) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1); // Remove the activity at the specified index
    setActivities(updatedActivities);

    const updated = [...tooltipHandlers];
    updated.splice(index, 1); // Remove the activity at the specified index
    setTooltipHandlers(updated);

  };

  // Function to detect labels using Google Vision API
  const detectLabels = async (imageUri:string) => {
    const apiKey = 'AIzaSyCa4-rskhmT6sUv9uab7be_pI8Lw9jmHyI'; // Replace with your API key
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestData = {
      requests: [
        {
          image: {
            content: base64ImageData,
          },
          features: [{ type: 'LABEL_DETECTION', maxResults: 25}],
        },
      ],
    };

    try {
      const response = await fetch(apiURL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
      });

      const data = await response.json();
      const labelAnnotations = data.responses[0].labelAnnotations;
      console.log(labelAnnotations);
      console.log(getCategories(labelAnnotations));

    } catch (error) {
        console.error('Error detecting labels:', error);
    }
  };

  const getCategories = (labelAnnotations:any) => {
    let tripCategories: string[] = [];

    const categories: { [key: string]: string[] } = {
      sport: ['sports', 'exercise', 'activity', 'fitness', 'workout'],
      nature: ['nature', 'landscape', 'outdoors', 'scenic', 'wilderness'],
      adventure: ['adventure', 'exploration', 'journey', 'expedition', 'trekking'],
      luxury: ['luxury', 'lavish', 'opulence', 'exclusive', 'premium'],
      roadTrip: ['road', 'trip', 'journey', 'driving', 'travel'],
      culture: ['culture', 'tradition', 'heritage', 'cultural', 'customs'],
      museum: ['museum', 'exhibition', 'artifacts', 'gallery', 'historic'],
      monuments: ['monuments', 'landmarks', 'historic sites', 'memorial', 'ruins'],
      wildlife: ['wildlife', 'animals', 'nature reserve', 'wild', 'fauna'],
      food: ['food', 'cuisine', 'restaurant', 'dining', 'gastronomy'],
  };
  
    for (let category in categories) {
      categories[category].forEach(label => {
        labelAnnotations.forEach((element: { description: string; }) => {
          if (element.description.toLowerCase() === label) {
            tripCategories.push(category);
          }
        });
      })
    };

    return tripCategories;
  };

  function TooltipContent({index}: TooltipContentProps): ReactNode {
    return (
      <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
        {/*TODO DELETE ACTIVITY*/ }
        <Pressable onPress={() => deleteActivity(index)}>
          <Iconify icon='material-symbols:delete' size={34} color={iconColor} style={{ flex: 1, marginRight: 30}} />
        </Pressable> 

        <Pressable  onPress={() => {
        toggleOptionModal(index);
        setSelectedActivity(activities[index]); 
        toggleActivityModal();
        }}>
          <Iconify icon='flowbite:edit-outline' size={34} color={iconColor} style={{ flex: 1,}} />
        </Pressable> 
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.item} snapToAlignment={'start'} scrollEventThrottle={1}>
      <View style={styles.container}>

        <Text style={styles.title}>Title</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Type in a title'
            onChangeText={onChangeTitle}
            value={titleText}
            style={styles.textInput}
          />
        </View>
      </View>
      
      <View style={styles.container}>

        <Text style={styles.title}>Description</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Add a description'
            onChangeText={onChangeDescription}
            value={descriptionText}
            style={styles.textInput}
          />
        </View>
      </View>
      
      <View style={styles.scores}>

        <Text style={styles.title}>Score</Text>

        <View style={styles.stars}>
          {[
            ...Array(givenStar),
          ].map((none: any, index: number) => (
            <Pressable key={index} style={styles.star} onPress={() => handleStar(index+1)}>
              <Iconify icon='fa-solid:star' size={28} color={colorScheme === 'light' ? Colors.light.tint : Colors.dark.tint}/>
            </Pressable>
          ))}
          {[
            ...Array(5-givenStar),
          ].map((none: any, index: number) => (
            <Pressable key={index} style={styles.star} onPress={() => handleStar(index+givenStar+1)}>
              <Iconify icon='fa-regular:star' size={28} color={iconColor}/>
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.container}>
        <Text style={styles.title}>Cover Image</Text>

        {!image 
        ? <View style={styles.picker}>
           <CustomButton func={pickImage} altStyle={false} text='Pick an image from camera' />
          </View>

        : <Image source={{ uri: image }} style={styles.picker} />} 

      </View>


      <View style={styles.container}>

        <Text style={styles.title}>Activities</Text>

        <ScrollView horizontal={true} style={styles.activityContainer}>
        {activities.map((activity, index) => {
          return (            
            <View>     
              <Tooltip
                key={index}
                closeOnContentInteraction={true}
                isVisible={tooltipHandlers[index]}
                content={<TooltipContent index={index}></TooltipContent>}
                placement="center"
                onClose={() => toggleOptionModal(index)}
              >
                <Pressable key={index} onLongPress={() => {
                toggleOptionModal(index);}}>
                  <Image key={index} source={{ uri: activity.photos[0] }} style={styles.activityImage} />
                </Pressable>
              </Tooltip>       
            </View>
          );
        })}
          <View style={styles.activity}>
            <Pressable onPress={() => toggleNewActivityModal()}>
              <Iconify icon='basil:add-solid' size={34} color={iconColor} />
            </Pressable> 
          </View>
        </ScrollView>
      </View>

      <View style={styles.container}>

        <Text style={styles.title}>Participants</Text>

        <View style={{marginVertical: 20}}>
          <CustomButton func={toggleModal} altStyle={false} text='Add participants' />
          <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', marginVertical:20,}}>
            {participants.map((participant, index) => (
              <ParticipantChip userID={participant.id} key={index} username={participant.username??''} role={''}/>
            ))}
          </View>
        </View>
      </View>
      
      <AddParticipantsModal isModalVisible={isModalVisible} toggleModal={toggleModal} participants={participants} removeParticipant={removeParticipant} addParticipant={addParticipant}></AddParticipantsModal>
      <NewActivityModal isModalVisible={isActivityModalVisible} toggleModal={toggleActivityModal} index={activities.indexOf(selectedActivity)} activityInfos={selectedActivity} setActivities={setActivities}/>
      <NewActivityModal isModalVisible={isNewActivityModalVisible} toggleModal={toggleNewActivityModal} index={activities.length} activityInfos={null} setActivities={setActivities}/>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  activityImage: {
    height: 100,
    width: 100,
    marginRight: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10, 
  },
  item: {
    flex: 1,
    width: '100%',
  },
  activity: {
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    height: 100,
    width: 100,
    marginRight: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    padding: 10,
   
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // for Android shadow
  },
  picker: {
    marginTop: 10,
    backgroundColor: '#D9D9D9',
    height: 300,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  textInput: {
    flex: 1,
    borderRadius: 30,
    height: 30,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  inputContainer: {
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    marginLeft: 10,
    borderBottomColor: '#737373',
    marginBottom: 20,
  },
  star: {
    marginRight: 5,
  },
  stars:{
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
  },
  scores: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
