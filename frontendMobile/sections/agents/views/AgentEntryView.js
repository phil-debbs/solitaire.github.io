import React from 'react';
import {View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';

import {useAgents} from '../providers/AgentsProvider';
import {AgentFields} from '../components/AgentFields';

//https://dev.to/benjamindaniel/react-native-forms-with-formik-804
export function AgentEntryView({agent, setVisibility}) {
  const {createAgent, editAgent} = useAgents();
  const {name, phone, address} = AgentFields;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}>
      <Formik
        enableReinitialize
        initialValues={agent || {}}
        initialTouched={true}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          if (agent) {
            editAgent({...values, _id: agent._id});
          } else {
            createAgent(values);
          }
          setVisibility && setVisibility(false);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isSubmitting,
          dirty,
        }) => {
          return (
            <>
              <View
                style={{
                  paddingHorizontal: 32,
                  // marginTop: 16,
                  // marginBottom: 16,
                  width: '100%',
                }}>
                <TextInput
                  onChangeText={handleChange(name.id)}
                  value={values.name}
                  label={name.label}
                  placeholder={name.placeholder}
                  returnKeyType="next"
                  returnKeyLabel="next"
                  error={errors.name}
                  touched={touched.name}
                  autoFocus={true}
                />
                <TextInput
                  onChangeText={handleChange(phone.id)}
                  value={values.phone}
                  label={phone.label}
                  placeholder={phone.placeholder}
                  returnKeyType="next"
                  returnKeyLabel="next"
                  error={errors.phone}
                  touched={touched.phone}
                />
                <TextInput
                  onChangeText={handleChange(address.id)}
                  value={values.address}
                  label={address.label}
                  placeholder={address.placeholder}
                  returnKeyType="done"
                  returnKeyLabel="done"
                  multiline
                  numberOfLines={3}
                  error={errors.address}
                  touched={touched.address}
                />
                <Button
                  label="Save"
                  onPress={() => {
                    //handle submit only if dirty. ie something has changed
                    if (dirty) {
                      handleSubmit();
                    } else {
                      //if agent is null, then it's a new entry and closing the save button shouldn't close the form unless there's valid entry
                      if (!agent) {
                        if (Object.keys(values).length === 0) {
                          return;
                        }
                      }
                      //hide the modal form
                      setVisibility && setVisibility(false);
                    }
                  }}
                  isSubmitting={isSubmitting}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  phone: Yup.string().required('Required'),
  // address: Yup.string().required('Required'),
});
