import React from 'react';
import {View, Text} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {ListItem} from 'react-native-elements';

export function ProjectsView({navigation}) {
  const {companyData} = useAuth();

  // the onClickProject navigates to the Task List with the company name
  // and company partition value
  const onClickProject = async company => {
    navigation.navigate('Communities', {
      name: company.name,
      areaPartition: company.partition,
    });
  };

  return (
    <View>
      {companyData.map(company => (
        <View key={company.name}>
          <ListItem
            onPress={() => onClickProject(company)}
            bottomDivider
            key={company.name}>
            <ListItem.Content>
              <ListItem.Title>{company.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      ))}
    </View>
  );
}
