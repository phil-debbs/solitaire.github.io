/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthProvider} from './providers/AuthProvider';
import {CommunitiesProvider} from './sections/communities/providers/CommunitiesProvider';
import {AgentsProvider} from './sections/agents/providers/AgentsProvider';

import {WelcomeView} from './views/WelcomeView';
import {ProjectsView} from './views/ProjectsView';
import {CommunitiesView} from './sections/communities/views/CommunitiesView';
import {AgentsView} from './sections/agents/views/AgentsView';
import {SetupView} from './views/SetupView';

const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome View"
            component={WelcomeView}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen name="Projects" component={ProjectsView} />
          <Stack.Screen name="Setup" component={SetupView} />
          {/* Using a render callback */}
          <Stack.Screen name="Communities">
            {props => {
              const {navigation, route} = props;
              const {user, areaPartition} = route.params;
              return (
                <CommunitiesProvider user={user} areaPartition={areaPartition}>
                  <CommunitiesView navigation={navigation} route={route} />
                </CommunitiesProvider>
              );
            }}
          </Stack.Screen>
          <Stack.Screen name="Agents">
            {props => {
              const {navigation, route} = props;
              const {user, areaPartition} = route.params;
              return (
                <AgentsProvider user={user} areaPartition={areaPartition}>
                  <AgentsView navigation={navigation} route={route} />
                </AgentsProvider>
              );
            }}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
