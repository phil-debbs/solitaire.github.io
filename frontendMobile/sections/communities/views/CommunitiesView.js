import React, {useState, useEffect} from 'react';

import {View, Button as Btn, Text} from 'react-native';
import styles from '../../../stylesheet';
import {Overlay, Button, Icon} from 'react-native-elements';
import {ManageTeam} from '../../../components/ManageTeam';

import {useCommunities} from '../providers/CommunitiesProvider';
import {CommunityItem} from '../components/CommunityItem';
import {CommunityEntryView} from './CommunityEntryView';

export function CommunitiesView({navigation, route}) {
  const {name} = route.params;

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [visible, setVisible] = useState(false);

  const {communities} = useCommunities();

  useEffect(() => {
    navigation.setOptions({
      headerRight: function Header() {
        return (
          <Button
            type="clear"
            titleStyle={styles.plusButton}
            title="&#x2b;"
            onPress={() => {
              setCurrentCommunity(null);
              setVisible(true);
            }}
          />
        );
      },
      title: `${name}'s Communities`,
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
          <CommunityEntryView
            community={currentCommunity}
            setVisibility={setVisible}
          />
        </>
      </Overlay>
      <View>
        {communities.map(community =>
          community ? (
            <CommunityItem
              key={`${community._id}`}
              community={community}
              sendForEdit={community => {
                setCurrentCommunity(community);
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
