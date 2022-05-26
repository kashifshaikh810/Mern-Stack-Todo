import React, {useState} from 'react';
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

const SignUp = props => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErr, setShowErr] = useState('');

  const handleUserNameChange = text => {
    setUserName(text);
    setShowErr('');
  };
  const handleEmailChange = text => {
    setEmail(text);
    setShowErr('');
  };
  const handlePasswordChange = text => {
    setPassword(text);
    setShowErr('');
  };

  const submit = () => {
    if (userName && email && password) {
      fetch('http://192.168.0.106:8080/signUp', {
        method: 'post',
        body: JSON.stringify({
          userName: userName,
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
            .then(res => {
              if (res?.message === 'User already registered') {
                ToastAndroid.showWithGravityAndOffset(
                  res?.message,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              } else {
                setUserName('');
                setEmail('');
                setPassword('');
                ToastAndroid.showWithGravityAndOffset(
                  res?.message,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
                props.navigation.navigate('login');
              }
            })
            .catch(err => {
              console.log('err', err);
            });
        })
        .catch(err => {
          console.log('err', err);
        });
    } else {
      setShowErr('All Feilds are required');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.loginHead}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        style={styles.textInput}
        value={userName}
        onChangeText={text => handleUserNameChange(text)}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.textInputTwo}
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
        <Text style={styles.dontTxt}>Have an account? </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('login')}>
          <Text style={styles.dontTxt}>Sign In</Text>
        </TouchableOpacity>
      </View>
      {showErr ? <Text style={styles.err}>{showErr}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={() => submit()}>
        <Text style={styles.buttonTxt}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignUp;

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
  err: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
