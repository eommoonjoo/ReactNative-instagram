import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
    };
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, name } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({ name, email });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={container.center}>
        <Image
          style={form.image}
          source={require('../../assets/instalogo.svg.png')}
        />
        <View stye={container.formCenter}>
          <TextInput
            style={form.textInput}
            placeholder='이름'
            onChangeText={(name) => this.setState({ name })}
          />
          <TextInput
            style={form.textInput}
            placeholder='이메일'
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            style={form.textInput}
            placeholder='비밀번호'
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
          />

          <TouchableOpacity
            style={form.button}
            title='회원가입'
            onPress={() => this.onSignUp()}
            color='black'>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>회원가입</Text>
          </TouchableOpacity>
        </View>
        <View style={form.bottomButton}>
          <Text>이미 계정이 있으신가요?</Text>
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{ marginLeft: 5, color: '#2196F3', fontWeight: 'bold' }}>
            로그인
          </Text>
        </View>
      </View>
    );
  }
}

export default Register;

const container = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCenter: {
    justifyContent: 'center',
    flex: 1,
  },
});

const form = StyleSheet.create({
  textInput: {
    width: 350,
    marginBottom: 10,
    borderColor: 'gray',
    backgroundColor: 'whitesmoke',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  bottomButton: {
    padding: 10,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  image: {
    height: 70,
    marginBottom: 30,
    resizeMode: 'contain',
  },

  button: {
    marginTop: 40,
    marginBottom: 100,
    backgroundColor: '#2196F3',
    opacity: 0.8,
    width: 350,
    marginBottom: 10,
    padding: 10,
    // borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
});
