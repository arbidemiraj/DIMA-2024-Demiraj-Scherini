import {useState} from 'react';
import { Image, View, StyleSheet, Text, TextInput, Pressable, Modal, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { SafeAreaView} from '@/components/Themed';
import { Iconify } from 'react-native-iconify';
import CustomButton from '@/components/CustomButton';

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export default function NewActivityModal({isModalVisible, toggleModal} : Props) {
  const [image, setImage] = useState<string>("");
  const [descriptionText, onChangeDescription] = useState<string>('');
  const [titleText, onChangeTitle] = useState<string>('');


  const colorScheme = useColorScheme();
   
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


  return (
    <Modal visible={isModalVisible} statusBarTranslucent={true}>
      <SafeAreaView style={{flex: 1}}>
      <Pressable onPress={toggleModal}>
        <Iconify icon='mingcute:check-fill' size={28} color={'#000'} style={{marginRight: 10, alignSelf: 'flex-end', marginTop: 20}} />
      </Pressable>
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
      
    
      <View style={styles.container}>
        <Text style={styles.title}>Cover Image</Text>

        {!image ? <View style={styles.picker}>
           <CustomButton func={pickImage} altStyle={false} text='Pick an image from camera' />
        </View>
        : <Image source={{ uri: image }} style={styles.picker} />} 

      </View>
    </SafeAreaView>
    </Modal>    
  );
}

const styles = StyleSheet.create({
  inputContainerDropdown: {
    paddingHorizontal: 5,
    marginLeft: 10,
    borderBottomColor: '#737373',
    marginBottom: 20,
    color: '#000',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    elevation: 3,
    maxHeight: 150,
    marginBottom: 200,
  },
  flatList: {
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
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 20,
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
  score: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  starSelected: {
    marginRight: 5,
    backgroundColor: '#737373'
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
  }
});
