import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {Community} from '../schemas/CommunitySchema';
import {useAuth} from '../../../providers/AuthProvider';

const CommunitiesContext = React.createContext(null);

const CommunitiesProvider = ({children, areaPartition}) => {
  const [communities, setCommunities] = useState([]);
  const {user} = useAuth();

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    // Enables offline-first: opens a local realm immediately without waiting
    // for the download of a synchronized realm to be completed.
    const OpenRealmBehaviorConfiguration = {
      type: 'openImmediately',
    };
    const config = {
      schema: [Community.schema],
      sync: {
        user: user,
        partitionValue: areaPartition,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };
    // TODO: Open the company realm with the given configuration and store
    // it in the realmRef. Once opened, fetch the Community objects in the realm,
    // sorted by name, and attach a listener to the Community collection. When the
    // listener fires, use the setCommunities() function to apply the updated Communities
    // list to the state.
    // open a realm for this particular company
    Realm.open(config).then(companyRealm => {
      realmRef.current = companyRealm;
      const syncCommunities = companyRealm.objects('Community');
      let sortedCommunities = syncCommunities.sorted('name');
      setCommunities([...sortedCommunities]);
      sortedCommunities.addListener(() => {
        setCommunities([...sortedCommunities]);
      });
    });

    return () => {
      // cleanup function
      const companyRealm = realmRef.current;
      if (companyRealm) {
        companyRealm.close();
        realmRef.current = null;
        setCommunities([]);
      }
    };
  }, [user, areaPartition]);

  const createCommunity = community => {
    const companyRealm = realmRef.current;
    companyRealm.write(() => {
      // Create a new community in the same partition -- that is, in the same company.
      companyRealm.create(
        'Community',
        new Community({
          ...community,
          partition: areaPartition,
        }),
      );
    });
  };

  const editCommunity = communityData => {
    const companyRealm = realmRef.current;
    companyRealm.write(() => {
      // Create a new community in the same partition -- that is, in the same company.
      let community = companyRealm.objectForPrimaryKey(
        'Community',
        communityData._id,
      );
      //loop and update fields in the community with values in communityData
      for (const key in community) {
        //skip undating the _id property
        if (key === '_id') continue;
        const value = communityData[key];
        if (value) {
          community[key] = value;
        }
      }
    });
  };

  const setCommunityStatus = (community, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    const companyRealm = realmRef.current;

    companyRealm.write(() => {
      community.isActive = status;
    });
  };

  // Define the function for deleting a community.
  const getCommunity = communityid => {
    const companyRealm = realmRef.current;
    // let community = companyRealm.objects('Community').filtered(`_id == ${communityid}`);
    //https://stackoverflow.com/a/40023996/5367889
    let community = companyRealm.objectForPrimaryKey('Community', communityid); //https://stackoverflow.com/a/35757953/5367889
    // let community = companyRealm.objects('Community').filtered('_id == $0', communityid); //https://stackoverflow.com/a/35757953/5367889
    return community;
    // companyRealm.write(() => {
    //   companyRealm.delete(community);
    //   setCommunities([...companyRealm.objects('Community').sorted('name')]);
    // });
  };

  // Define the function for deleting a community.
  const deleteCommunity = community => {
    const companyRealm = realmRef.current;
    companyRealm.write(() => {
      companyRealm.delete(community);
      setCommunities([...companyRealm.objects('Community').sorted('name')]);
    });
  };
  // Render the children within the CommunityContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useCommunities hook.
  return (
    <CommunitiesContext.Provider
      value={{
        createCommunity,
        editCommunity,
        deleteCommunity,
        setCommunityStatus,
        getCommunity,
        communities,
      }}>
      {children}
    </CommunitiesContext.Provider>
  );
};

// The useCommunities hook can be used by any descendant of the CommunitiesProvider. It
// provides the communities of the CommunitiesProvider's company and various functions to
// create, update, and delete the communities in that company.
const useCommunities = () => {
  const community = useContext(CommunitiesContext);
  if (community == null) {
    throw new Error(
      'useCommunities() called outside of a CommunitiesProvider?',
    ); // an alert is not placed because this is an error for the developer not the user
  }
  return community;
};

export {CommunitiesProvider, useCommunities};
