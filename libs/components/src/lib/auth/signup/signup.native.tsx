import React, { Dispatch, SetStateAction, memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import Background from '../../core.native/Background';
import Logo from '../../core.native/Logo';
import Header from '../../core.native/Header';
import Button from '../../core.native/Button';
import TextInput from '../../core.native/TextInput';
import BackButton from '../../core.native/BackButton';
import { theme } from '../../styles/theme';
import { Navigation, FormType, signupFormData } from '@libs/shared-types';

import useForm from '../../hooks/useForm';
interface SignupProps {
  navigation: Navigation;
  setFormType: Dispatch<SetStateAction<FormType>>;
}
const SignupNative = ({ navigation }: SignupProps) => {
  const { handlers, onSubmit, errors } = useForm(
    {
      name: '',
      email: '',
      password: '',
    },
    signupFormData,
    'signup',
    'native'
  );

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('Home')} />

      <Logo />

      <Header>Create Account</Header>

      <TextInput
        label="Username"
        onChangeText={handlers.name as (text: string) => void}
        error={!!errors.name}
        errorText={errors.name}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        returnKeyType="next"
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={handlers.email as (text: string) => void}
        error={!!errors.email}
        errorText={errors.email}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        onChangeText={handlers.password as (text: string) => void}
        error={!!errors.password}
        errorText={errors.password}
        secureTextEntry
      />

      <Button mode="contained" onPress={onSubmit} style={styles.button}>
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    position: 'relative',
    top: -13,
    left: -12,
  },
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default SignupNative;
