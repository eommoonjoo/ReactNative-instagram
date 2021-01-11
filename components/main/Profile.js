import React, { Component, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase';
require('firebase/firestore');
require('firebase/firebase-storage');
import { connect } from 'react-redux';

export function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [followingUser, setFollowingUser] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts, following } = props;
    console.log('결과>>>>>>>>게시물 개수', posts);

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
      setFollowingUser(following);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log('없어');
          }
        });
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.posts, props.following, props.currentUser]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return (
      <View style={container.form}>
        <Text style={text.notAvailable}>User Not Found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[container.container, utils.backgroundWhite]}>
      <View style={[navbar.custom, utils.justifyCenter]}>
        <Text style={navbar.title}>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>
      <View style={[container.profileInfo]}>
        <View style={[utils.noPadding, container.row]}>
          <FontAwesome5
            style={[utils.profileImageBig, utils.marginBottomSmall]}
            name='user-circle'
            size={80}
            color='black'
          />
          <View
            style={[
              container.container,
              container.horizontal,
              utils.justifyCenter,
              utils.padding10Sides,
            ]}>
            <View
              style={[
                utils.justifyCenter,
                text.center,
                container.containerImage,
              ]}>
              <Text style={[text.bold, text.large, text.center]}>
                {userPosts.length}
              </Text>
              <Text style={[text.center]}>게시물</Text>
            </View>
            <View
              style={[
                utils.justifyCenter,
                text.center,
                container.containerImage,
              ]}>
              <Text style={[text.bold, text.large, text.center]}>
                {followingUser.length}
              </Text>
              <Text style={[text.center]}>팔로워</Text>
            </View>
            <View
              style={[
                utils.justifyCenter,
                text.center,
                container.containerImage,
              ]}>
              <Text style={[text.bold, text.large, text.center]}>
                {followingUser.length}
              </Text>
              <Text style={[text.center]}>팔로잉</Text>
            </View>
          </View>
        </View>

        <View>
          {props.route.params.uid !== firebase.auth().currentUser.uid ? (
            <View style={[container.horizontal]}>
              {following ? (
                <TouchableOpacity
                  style={[
                    utils.buttonOutlined,
                    container.container,
                    utils.margin15Right,
                  ]}
                  title='Following'
                  onPress={() => onUnfollow()}>
                  <Text style={[text.bold, text.center]}>팔로잉</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    utils.buttonOutlined,
                    container.container,
                    utils.margin15Right,
                  ]}
                  title='Follow'
                  onPress={() => onFollow()}>
                  <Text style={[text.bold, text.center]}>팔로우</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[utils.buttonOutlined, container.container]}
                title='Follow'>
                <Text style={[text.bold, text.center]}>메세지</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={utils.buttonOutlined}
              onPress={() => onLogout()}>
              <Text style={[text.bold, text.center]}>로그아웃</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[utils.borderTopGray]}>
        <FlatList
          style={utils.marginBottomBar}
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[container.containerImage, utils.borderWhite]}>
              <Image
                style={container.image}
                source={{ uri: item.downloadURL }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});
export default connect(mapStateToProps, null)(Profile);

const utils = StyleSheet.create({
  centerHorizontal: {
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: 20,
  },
  marginBottomBar: {
    marginBottom: 330,
  },
  marginBottomSmall: {
    marginBottom: 10,
  },
  profileImageBig: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  profileImage: {
    marginRight: 15,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  profileImageSmall: {
    marginRight: 15,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  searchBar: {
    backgroundColor: 'whitesmoke',
    color: 'grey',
    paddingLeft: 10,
    borderRadius: 8,
    height: 40,
    marginTop: -5,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  padding15: {
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  padding10Top: {
    paddingTop: 10,
  },
  padding10: {
    padding: 10,
  },
  margin15: {
    margin: 15,
  },
  padding10Sides: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  margin15Left: {
    marginLeft: 15,
  },
  margin15Right: {
    marginRight: 15,
  },
  margin5Bottom: {
    marginBottom: 5,
  },
  backgroundWhite: {
    backgroundColor: 'white',
  },
  borderTopGray: {
    borderTopWidth: 1,
    borderColor: 'lightgrey',
  },
  borderWhite: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'white',
  },
  buttonOutlined: {
    padding: 8,
    color: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
    textAlign: 'center',
  },

  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
const navbar = StyleSheet.create({
  image: {
    padding: 20,
  },
  custom: {
    marginTop: 30,
    height: 60,
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },

  title: {
    fontWeight: '700',
    fontSize: 20, //'larger',
  },
});
const container = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    flexDirection: 'row',
  },
  input: {
    flexWrap: 'wrap',
  },
  containerPadding: {
    flex: 1,
    padding: 15,
  },
  center: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    display: 'flex',
  },
  form: {
    flex: 1,
    margin: 25,
  },
  profileInfo: {
    padding: 25,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
  },
  formCenter: {
    justifyContent: 'center',
    flex: 1,
    margin: 25,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    aspectRatio: 1 / 1,
  },
  fillHorizontal: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  imageSmall: {
    aspectRatio: 1 / 1,
    height: 70,
  },
  gallery: {
    borderWidth: 1,
    borderColor: 'gray',
  },
  splash: {
    padding: 200,
    height: '100%',
    width: '100%',
  },
  chatRight: {
    margin: 10,
    marginBottom: 10,
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  chatLeft: {
    margin: 10,
    marginBottom: 10,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 8,
    alignItems: 'flex-end',
    textAlign: 'right',
    alignSelf: 'flex-start',
  },
});

const form = StyleSheet.create({
  textInput: {
    marginBottom: 10,
    borderColor: 'gray',
    backgroundColor: 'whitesmoke',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  bottomButton: {
    alignContent: 'center',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
  roundImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
});

const text = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  notAvailable: {
    textAlign: 'center',
    fontWeight: '700', //'bolder',
    fontSize: 20, //'large',
  },
  profileDescription: {
    fontWeight: '300',
  },
  changePhoto: {
    marginTop: 5,
    color: 'deepskyblue',
  },
  deepskyblue: {
    color: 'deepskyblue',
  },
  username: {
    fontWeight: '600',
    color: 'black',
  },
  name: {
    color: 'grey',
  },
  bold: {
    fontWeight: '700',
  },
  large: {
    fontSize: 20, //'large'
  },
  small: {
    fontSize: 10, //'large'
  },
  medium: {
    fontSize: 15, //'large'
    marginBottom: 10,
  },
  grey: {
    color: 'grey',
  },
  green: {
    color: 'lightgreen',
  },
  white: {
    color: 'white',
  },
  whitesmoke: {
    color: 'whitesmoke',
  },
});
