import React from 'react';
import {View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';

import {useCommunities} from '../providers/CommunitiesProvider';
import {CommunityFields} from '../components/CommunityFields';

const ValidationSchema = Yup.object().shape({
  // email: Yup.string().required('Required'), //.email('Invalid email'),
  name: Yup.string().required('Required'), //.email('Invalid email'),
  // password: Yup.string()
  //   .min(2, 'Too Short!')
  //   .max(10, 'Too Long!')
  //   .required('Required'),
});

//https://dev.to/benjamindaniel/react-native-forms-with-formik-804
export function CommunityEntryView({community, setVisibility}) {
  const {createCommunity, editCommunity} = useCommunities();
  const {name} = CommunityFields;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}>
      <Formik
        enableReinitialize
        initialValues={community || {}}
        initialTouched={true}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          if (community) {
            editCommunity({...values, _id: community._id});
          } else {
            createCommunity(values);
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
                <Button
                  label="Save"
                  onPress={() => {
                    //handle submit only if dirty. ie something has changed
                    if (dirty) {
                      handleSubmit();
                    } else {
                      //if community is null, then it's a new entry and closing the save button shouldn't close the form unless there's valid entry
                      if (!community) {
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
