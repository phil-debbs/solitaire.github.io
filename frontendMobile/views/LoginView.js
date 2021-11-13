import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import styles from '../stylesheet';
import TextInput from '../components/TextInput';

export function LoginView({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user, signUp, signIn, signOut} = useAuth();

  // useEffect(() => {
  //   console.log('navigation', navigation);
  //   // If there is a user logged in, go to the Projects page.
  //   if (user != null) {
  //     navigation.navigate('Projects');
  //   }
  // }, [user]);

  // The onPressSignIn method calls AuthProvider.signIn with the
  // email/password in state.
  const onPressSignIn = async () => {
    console.log('Press sign in');
    try {
      await signIn(email, password);
    } catch (error) {
      console.log(error.message);
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };

  // The onPressSignUp method calls AuthProvider.signUp with the
  // email/password in state and then signs in.
  const onPressSignUp = async () => {
    try {
      await signUp(email, password);
      signIn(email, password);
    } catch (error) {
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  return (
    <View>
      <Text>Signup or Signin:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder="password"
          style={styles.inputStyle}
          secureTextEntry
        />
      </View>
      <Button style={{margin: '20'}} onPress={onPressSignIn} title="Sign In" />
      <Button onPress={onPressSignUp} title="Sign Up" />
    </View>
  );
}
