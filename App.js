import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import { Feather } from '@expo/vector-icons';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';

const firebaseConfig = {
  apiKey: 'AIzaSyA7mmUhriC3yiItGUznkCDnNuSzK67YvsM',
  authDomain: 'instagram-dev-226d4.firebaseapp.com',
  projectId: 'instagram-dev-226d4',
  storageBucket: 'instagram-dev-226d4.appspot.com',
  messagingSenderId: '934116795448',
  appId: '1:934116795448:web:2df21caeedd34c0ec8b2cd',
  measurementId: 'G-B4PX2ZCNCF',
};

const store = createStore(rootReducer, applyMiddleware(thunk));

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Feather name='loader' size={24} color='black' />
        </View>
      );
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='로딩'>
            <Stack.Screen
              name='Home'
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Register'
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='main'>
            <Stack.Screen
              name='main'
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Add'
              component={AddScreen}
              navigation={this.props.navigation}
              options={{
                title: false,
                headerBackTitleVisible: false,
                headerTintColor: 'black',
              }}
            />
            <Stack.Screen
              name='Save'
              component={SaveScreen}
              navigation={this.props.navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
