import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {Agent} from '../schemas/AgentSchema';
import {useAuth} from '../../../providers/AuthProvider';

const AgentsContext = React.createContext(null);

const AgentsProvider = ({children, areaPartition}) => {
  const [agents, setAgents] = useState([]);
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
      schema: [Agent.schema],
      sync: {
        user: user,
        partitionValue: areaPartition,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };
    // TODO: Open the company realm with the given configuration and store
    // it in the realmRef. Once opened, fetch the Agent objects in the realm,
    // sorted by name, and attach a listener to the Agent collection. When the
    // listener fires, use the setAgents() function to apply the updated Agents
    // list to the state.
    // open a realm for this particular company
    Realm.open(config).then(companyRealm => {
      realmRef.current = companyRealm;
      const syncAgents = companyRealm.objects('Agent');
      let sortedAgents = syncAgents.sorted('name');
      setAgents([...sortedAgents]);
      sortedAgents.addListener(() => {
        setAgents([...sortedAgents]);
      });
    });

    return () => {
      // cleanup function
      const companyRealm = realmRef.current;
      if (companyRealm) {
        companyRealm.close();
        realmRef.current = null;
        setAgents([]);
      }
    };
  }, [user, areaPartition]);

  const createAgent = agent => {
    const companyRealm = realmRef.current;
    companyRealm.write(() => {
      // Create a new agent in the same partition -- that is, in the same company.
      companyRealm.create(
        'Agent',
        new Agent({
          ...agent,
          partition: areaPartition,
        }),
      );
    });
  };

  const editAgent = agentData => {
    const companyRealm = realmRef.current;
    companyRealm.write(() => {
      // Create a new agent in the same partition -- that is, in the same company.
      let agent = companyRealm.objectForPrimaryKey('Agent', agentData._id);
      //loop and update fields in the agent with values in agentData
      for (const key in agent) {
        //skip undating the _id property
        if (key === '_id') continue;
        const value = agentData[key];
        if (value) {
          agent[key] = value;
        }
      }
    });
  };

  const setAgentStatus = (agent, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    const companyRealm = realmRef.current;

    companyRealm.write(() => {
      agent.isActive = status;
    });
  };

  // Define the function for deleting a agent.
  const getAgent = agentid => {
    const companyRealm = realmRef.current;
    // let agent = companyRealm.objects('Agent').filtered(`_id == ${agentid}`);
    //https://stackoverflow.com/a/40023996/5367889
    let agent = companyRealm.objectForPrimaryKey('Agent', agentid); //https://stackoverflow.com/a/35757953/5367889
    // let agent = companyRealm.objects('Agent').filtered('_id == $0', agentid); //https://stackoverflow.com/a/35757953/5367889
    return agent;
    // companyRealm.write(() => {
    //   companyRealm.delete(agent);
    //   setAgents([...companyRealm.objects('Agent').sorted('name')]);
    // });
  };

  // Define the function for deleting a agent.
  const deleteAgent = agent => {
    const companyRealm = realmRef.current;
    companyRealm.write(() => {
      companyRealm.delete(agent);
      setAgents([...companyRealm.objects('Agent').sorted('name')]);
    });
  };
  // Render the children within the AgentContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useAgents hook.
  return (
    <AgentsContext.Provider
      value={{
        createAgent,
        editAgent,
        deleteAgent,
        setAgentStatus,
        getAgent,
        agents,
      }}>
      {children}
    </AgentsContext.Provider>
  );
};

// The useAgents hook can be used by any descendant of the AgentsProvider. It
// provides the agents of the AgentsProvider's company and various functions to
// create, update, and delete the agents in that company.
const useAgents = () => {
  const agent = useContext(AgentsContext);
  if (agent == null) {
    throw new Error('useAgents() called outside of a AgentsProvider?'); // an alert is not placed because this is an error for the developer not the user
  }
  return agent;
};

export {AgentsProvider, useAgents};
