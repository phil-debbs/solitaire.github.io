import React, {useState} from 'react';
import {ListItem, Text} from 'react-native-elements';
import {useCommunities} from '../providers/CommunitiesProvider';
import {ActionSheet} from '../../../components/ActionSheet';
// import {Community} from '../schemas/CommunitySchema';

export function CommunityItem({community, sendForEdit}) {
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const {deleteCommunity} = useCommunities();
  const actions = [
    {
      title: 'Edit',
      action: () => {
        sendForEdit && sendForEdit(community);
      },
    },
    {
      title: 'Delete',
      action: () => {
        deleteCommunity(community);
      },
    },
  ];

  // For each possible status other than the current status, make an action to
  // move the community into that status. Rather than creating a generic method to
  // avoid repetition, we split each status to separate each case in the code
  // below for demonstration purposes.
  // TODO

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => {
          // if (community.isActive) {
          setActionSheetVisible(false);
          // }
        }}
        actions={actions}
      />
      <ListItem
        key={community.id}
        onPress={() => {
          setActionSheetVisible(true);
        }}
        bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{community.name}</ListItem.Title>
        </ListItem.Content>
        {!community.isActive && community.isActive}
      </ListItem>
    </>
  );
}
