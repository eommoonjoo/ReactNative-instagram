import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn() {
    console.log(firebase);
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={container.center}>
        <Image
          style={form.image}
          source={require('../../assets/instalogo.svg.png')}
        />
        <View stye={container.formCenter}>
          <TextInput
            style={form.textInput}
            placeholder='전화번호, 사용자 이름 또는 이메일'
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
            title='로그인'
            onPress={() => this.onSignIn()}
            color='black'>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>로그인</Text>
          </TouchableOpacity>
        </View>
        <View style={[form.bottomButton]}>
          <Text>계정이 없으신가요?</Text>
          <Text
            onPress={() => navigation.navigate('Register')}
            style={{ marginLeft: 5, color: '#2196F3', fontWeight: 'bold' }}>
            가입하기
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default Login;

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
