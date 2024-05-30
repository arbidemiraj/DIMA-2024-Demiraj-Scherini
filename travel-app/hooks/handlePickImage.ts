import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// Function to get the categories from the detected labels
const getCategories = (labelAnnotations: any, addCategories: (categories:string[]) => void) => {
    let tripCategories: string[] = [];

    const categories: { [key: string]: string[] } = {
      sport: ['sports', 'sport', 'exercise', 'activity', 'fitness', 'workout', 'gym', 'running', 'swimming', 'yoga', 'cycling'],
      nature: ['nature', 'landscape', 'outdoors', 'scenic', 'wilderness', 'mountain', 'forest', 'beach', 'park', 'waterfall'],
      adventure: ['adventure', 'exploration', 'journey', 'expedition', 'trekking', 'hiking', 'climbing', 'rafting', 'skydiving', 'bungee jumping'],
      luxury: ['luxury', 'lavish', 'opulence', 'exclusive', 'premium', 'high-end', 'fancy', 'elegant', 'champagne', 'limousine'],
      roadTrip: ['road trip', 'journey', 'driving', 'travel', 'car', 'motorcycle', 'campervan', 'route', 'exploring'],
      culture: ['culture', 'tradition', 'heritage', 'cultural', 'customs', 'art', 'music', 'dance', 'festival', 'ceremony'],
      museum: ['museum', 'exhibition', 'artifacts', 'gallery', 'historic', 'painting', 'sculpture', 'archaeology', 'history', 'collection'],
      monuments: ['monuments', 'landmarks', 'historic sites', 'memorial', 'ruins', 'statue', 'castle', 'temple', 'palace', 'tower'],
      wildlife: ['wildlife', 'animals', 'nature reserve', 'wild', 'fauna', 'safari', 'birdwatching', 'zoo', 'national park', 'conservation'],
      food: ['food', 'cuisine', 'restaurant', 'dining', 'gastronomy', 'cooking', 'chef', 'foodie', 'delicious', 'tasting'],
    };

    for (let category in categories) {
      categories[category].forEach((label) => {
        labelAnnotations.forEach((element: { description: string }) => {
          if (element.description.toLowerCase() === label && !tripCategories.includes(category)) {
            tripCategories.push(category);
          }
        });
      });
    }
    
    addCategories(tripCategories);
  };

// Function to detect labels using Google Vision API
const detectLabels = async (imageUri: string, addCategories : (categories : string[]) => void) => {
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
          features: [{ type: 'LABEL_DETECTION', maxResults: 25 }],
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
      getCategories(labelAnnotations, addCategories); // Get the categories from the detected labels
    } catch (error) {
      console.error('Error detecting labels:', error);
    }
  };

// Function to handle image picking
export const handlePickImage = async (setImage: (imageUri: string) => void, addCategories: (categories: string[]) => void) => {
  try {
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });
  
    if (!result.canceled) {
        const compressedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setImage(compressedImage.uri);

        detectLabels(result.assets[0].uri, addCategories); // Detect labels from the picked image
    }
  } catch (error) {
    console.error('Error picking image:', error);
    alert('Error picking image. Please try again.');
  }
};
