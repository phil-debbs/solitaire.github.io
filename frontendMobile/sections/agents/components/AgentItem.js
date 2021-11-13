import React, {useState} from 'react';
import {ListItem, Text} from 'react-native-elements';
import {useAgents} from '../providers/AgentsProvider';
import {ActionSheet} from '../../../components/ActionSheet';
// import {Agent} from '../schemas/AgentSchema';

export function AgentItem({agent, sendForEdit}) {
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const {deleteAgent} = useAgents();
  const actions = [
    {
      title: 'Edit',
      action: () => {
        sendForEdit && sendForEdit(agent);
      },
    },
    {
      title: 'Delete',
      action: () => {
        deleteAgent(agent);
      },
    },
  ];

  // For each possible status other than the current status, make an action to
  // move the agent into that status. Rather than creating a generic method to
  // avoid repetition, we split each status to separate each case in the code
  // below for demonstration purposes.
  // TODO

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => {
          // if (agent.isActive) {
          setActionSheetVisible(false);
          // }
        }}
        actions={actions}
      />
      <ListItem
        key={agent.id}
        onPress={() => {
          setActionSheetVisible(true);
        }}
        bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{agent.name}</ListItem.Title>
        </ListItem.Content>
        {!agent.isActive && agent.isActive}
      </ListItem>
    </>
  );
}
