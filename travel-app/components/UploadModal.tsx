import { StyleSheet, Modal, useColorScheme, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { View, Text } from '@/components/Themed';

interface Props {
    loading: boolean;
    isModalVisible: boolean;
}


export default function UploadModal({ loading, isModalVisible }: Props) {

    return (
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
            <View style={styles.container}>
                <View style={styles.modalView}>
                    {loading ? (
                        <>
                            <ActivityIndicator testID='activity-indicator' size='large' color={useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint} style={{ marginTop: 15 }} />
                            <Text>Creating journal...</Text>
                        </>
                    ) : (
                        <Text style={styles.text}>Journal created successfully</Text>
                    )}
                </View>
                
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Adding a background color with opacity for the overlay effect
    },
    text: {
        fontSize: 18,
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});
