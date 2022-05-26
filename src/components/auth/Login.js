import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
} from 'react-native';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');

  const handleEmailChange = text => {
    setEmail(text);
  };
  const handlePasswordChange = text => {
    setPassword(text);
  };

  const submit = async () => {
    if (email && password) {
      fetch('http://192.168.0.106:8080/login', {
        method: 'post',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          res
            .json()
            .then(async res => {
              if (
                res.message === 'User not registered' ||
                res.message === "Password didn't match"
              ) {
                ToastAndroid.showWithGravityAndOffset(
                  res?.message,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              } else {
                await AsyncStorage.setItem(
                  'id',
                  JSON.stringify({id: res?.user?._id}),
                );
                props.navigation.navigate('home');
                setEmail('');
                setPassword('');
                ToastAndroid.showWithGravityAndOffset(
                  res?.message,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              }
            })
            .catch(err => {
              console.log('err', err);
            });
        })
        .catch(err => {
          console.log('err', err);
        });
    }
  };

  const data = async () => {
    let user = await AsyncStorage.getItem('id');
    let id = JSON.parse(user)?.id;
    setId(id);
  };

  useEffect(() => {
    data();
  }, [props]);

  if (id) {
    props.navigation.navigate('home');
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.loginHead}>Login</Text>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.textInput}
        value={email}
        onChangeText={text => handleEmailChange(text)}
      />
      <TextInput
        secureTextEntry={true}
        placeholder="Password"
        style={styles.textInputTwo}
        value={password}
        onChangeText={text => handlePasswordChange(text)}
      />
      <View style={styles.dontTxtContainer}>
        <Text style={styles.dontTxt}>Don't have account? </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('signup')}>
          <Text style={styles.dontTxt}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => submit()}>
        <Text style={styles.buttonTxt}>Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginHead: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: StatusBar.currentHeight,
  },
  textInputTwo: {
    width: '90%',
    height: 50,
    marginTop: 20,
    borderWidth: 0.5,
    alignSelf: 'center',
    borderRadius: 5,
    paddingLeft: 15,
  },
  textInput: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    alignSelf: 'center',
    borderRadius: 5,
    paddingLeft: 15,
  },
  buttonTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b3b3b3',
  },
  button: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#f3f3f3',
  },
  dontTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '96%',
  },
  dontTxt: {
    fontSize: 17,
    textAlign: 'right',
    marginHorizontal: 5,
    marginTop: 15,
  },
});
