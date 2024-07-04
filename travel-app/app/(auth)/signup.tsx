import React, { useState } from 'react';
import { StyleSheet, AppState, Pressable, ImageBackground, useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Text, View, SafeAreaView, TextInput } from '@/components/Themed';
import { View as DefaultView, Text as DefaultText, Image } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Iconify } from 'react-native-iconify';
import { StatusBar } from 'expo-status-bar';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const textColor = useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text;

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    //console.log("sign up");
    setLoading(false);
    if (error) {
      //console.log(error.message);
      alert(error.message);
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.backgroundImage}>
      <StatusBar style='light' />
      <View style={{ backgroundColor: 'rgba(0,0,0,0.25)', flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: 'transparent', flex: 1 }} edges={['top']}>
          <View style={{ flex: 0.6, backgroundColor: 'transparent' }}>
            <DefaultView style={{ padding: 30 }}>
              <Image source={require('../../assets/images/icon.png')} style={{ width: 64, height: 64, borderRadius: 10, marginBottom: 20 }} />
              <DefaultText style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Travel Buds </DefaultText>
              <DefaultText style={{ color: 'white', fontSize: 32, fontWeight: '600' }}>Find Inspiration for your trips</DefaultText>
            </DefaultView>
          </View>
          <View style={styles.container}>
            <DefaultView style={{ padding: 30, justifyContent: 'flex-start', flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Create an Account</Text>
              <DefaultView style={{ marginVertical: 30 }}>
                <DefaultView style={{ marginVertical: 10 }}>
                  <Text style={{ fontWeight: '500', fontSize: 15 }}>Email</Text>
                  <View style={{ borderBottomWidth: 1, marginTop: 5, flexDirection: 'row', gap: 8, paddingVertical: 10 }}>
                    <Iconify icon='ic:outline-email' size={22} color={useColorScheme() === 'light' ? Colors.light.separator : Colors.dark.separator} />
                    <TextInput onChangeText={(text) => setEmail(text)} value={email} placeholder='Type in your email...' placeholderTextColor={textColor} autoCapitalize={'none'} editable={true} style={{ flex: 1 }} />
                  </View>
                </DefaultView>
                <DefaultView style={{ marginVertical: 10 }}>
                  <Text style={{ fontWeight: '500', fontSize: 15 }}>Password</Text>
                  <View style={{ borderBottomWidth: 1, marginTop: 5, flexDirection: 'row', gap: 8, paddingVertical: 10 }}>
                    <Iconify icon='carbon:password' size={22} color={useColorScheme() === 'light' ? Colors.light.separator : Colors.dark.separator} />
                    <TextInput onChangeText={(text) => setPassword(text)} value={password} secureTextEntry={true} placeholder='Password' placeholderTextColor={textColor} autoCapitalize={'none'} style={{ flex: 1 }} />
                  </View>
                </DefaultView>
              </DefaultView>
              <CustomButton text='SignUp' altStyle={false} func={signUpWithEmail} />
              <DefaultView style={{ marginVertical: 25, justifyContent: 'center', flexDirection: 'row', gap: 5 }}>
                <Text style={{ fontSize: 16 }}>Already have an account?</Text>
                <Link style={{ fontSize: 16, fontWeight: 'bold', color: useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint }} href={{ pathname: '/(auth)/login' }} replace>
                  Login
                </Link>
              </DefaultView>
            </DefaultView>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 12,
    height: '50%',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  mt20: {
    marginTop: 20,
  },
});
