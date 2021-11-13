import React, {useState, useEffect} from 'react';

import {View, Button as Btn, Text} from 'react-native';
import styles from '../../../stylesheet';
import {Overlay, Button, Icon} from 'react-native-elements';
import {ManageTeam} from '../../../components/ManageTeam';

import {useAgents} from '../providers/AgentsProvider';
import {AgentItem} from '../components/AgentItem';
import {AgentEntryView} from './AgentEntryView';

export function AgentsView({navigation, route}) {
  const {name} = route.params;

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [visible, setVisible] = useState(false);

  const {agents} = useAgents();

  useEffect(() => {
    navigation.setOptions({
      headerRight: function Header() {
        return (
          <Button
            type="clear"
            titleStyle={styles.plusButton}
            title="&#x2b;"
            onPress={() => {
              setCurrentAgent(null);
              setVisible(true);
            }}
          />
        );
      },
      title: `${name}'s Agents`,
    });
  }, []);

  return (
    <>
      <Overlay
        isVisible={visible}
        overlayStyle={{width: '100%', height: '100%'}}
        onBackdropPress={() => setVisible(false)}>
        <>
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <Icon
              // raised
              // reverse
              iconStyle={{right: 0, width: 20}}
              name="arrow-left"
              type="font-awesome"
              size={15}
              // color="#f50"
              onPress={() => setVisible(false)}
            />
          </View>
          {/* <Button
            type="clear"
            titleStyle={styles.plusButton}
            title="&#8592;"
            onPress={() => {
              setVisible(false);
            }}
          /> */}
          <AgentEntryView agent={currentAgent} setVisibility={setVisible} />
        </>
      </Overlay>
      <View>
        {agents.map(agent =>
          agent ? (
            <AgentItem
              key={`${agent._id}`}
              agent={agent}
              sendForEdit={agent => {
                setCurrentAgent(agent);
                setVisible(true);
              }}
            />
          ) : null,
        )}

        {name === 'Project1' ? (
          <>
            <View style={styles.manageTeamButtonContainer}>
              <Btn
                title="Manage Team"
                onPress={() => setOverlayVisible(true)}
              />
            </View>
            <Overlay
              isVisible={overlayVisible}
              onBackdropPress={() => setOverlayVisible(false)}>
              <ManageTeam />
            </Overlay>
          </>
        ) : null}
      </View>
    </>
  );
}
