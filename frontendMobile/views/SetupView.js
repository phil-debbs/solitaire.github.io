import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {ListItem} from 'react-native-elements';

export function SetupView({navigation}) {
  // const {companyData} = useAuth();

  // // the onClickProject navigates to the Task List with the company name
  // // and company partition value
  const onClickProject = async company => {
    navigation.navigate('Communities', {
      name: company.name,
      areaPartition: company.partition,
    });
  };

  return (
    <View>
      <Button
        style={styles.buttonStyle}
        onPress={company => {
          if (user != null) {
            navigation.navigate('Communities', {
              name: company.name,
              areaPartition: company.partition,
            });
          }
        }}
        label="Communities"
      />
      <Button
        style={styles.buttonStyle}
        onPress={() => {
          if (user != null) {
            navigation.navigate('Agents');
          }
        }}
        label="Agents"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginVertical: 5,
  },
});
