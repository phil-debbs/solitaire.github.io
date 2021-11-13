import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import Button from '../components/Button';
import {useAuth} from '../providers/AuthProvider';
import styles from '../stylesheet';
import {LoginView} from './LoginView';

export function WelcomeView({navigation}) {
  const {user, signOut} = useAuth();

  useEffect(() => {
    // If there is a user logged in, go to the Projects page.
    // if (user != null) {
    //   navigation.navigate('Projects');
    // }
  }, [user]);

  // // The onPressSignUp method calls AuthProvider.signUp with the
  // // email/password in state and then signs in.
  // const onPressProjects = async () => {
  //   if (user != null) {
  //     navigation.navigate('Projects');
  //   }
  // };
  // // The onPressSignUp method calls AuthProvider.signUp with the
  // // email/password in state and then signs in.
  // const onPressLogout = async () => {
  //   try {
  //     await signOut();
  //   } catch (error) {
  //     Alert.alert(`Failed to signout: ${error.message}`);
  //   }
  // };

  return (
    <View>
      {!user ? (
        <LoginView />
      ) : (
        <>
          <View>
            <Button
              style={styles.buttonStyle}
              onPress={async () => {
                if (user != null) {
                  navigation.navigate('Projects');
                }
              }}
              label="Projects"
            />
            <Button
              style={styles.buttonStyle}
              onPress={() => {
                if (user != null) {
                  navigation.navigate('Setup');
                }
              }}
              label="Setup"
            />
            <Button
              style={styles.buttonStyle}
              onPress={async () => {
                try {
                  await signOut();
                } catch (error) {
                  Alert.alert(`Failed to signout: ${error.message}`);
                }
              }}
              label="Logout"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginVertical: 5,
  },
});
