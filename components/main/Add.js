import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Feather, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Add({ navigation }) {
  const [hasGalleryPermission, setGalleryHasPermission] = useState(null);
  const [hasCameraPermission, setCameraHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setCameraHasPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryHasPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (image !== null) {
    return (
      <View style={container.container}>
        <View style={container.camera}>
          <Image source={{ uri: image }} style={{ flex: 1 }} />
        </View>
        <View
          style={[
            container.horizontal,
            utils.centerHorizontal,
            utils.justifyCenter,
            utils.margin15,
          ]}>
          <Feather
            style={utils.margin15}
            name='trash-2'
            size={30}
            color='black'
            onPress={() => setImage(null)}
          />
          <FontAwesome
            style={utils.margin15}
            name='check-square-o'
            size={30}
            color='black'
            onPress={() => navigation.navigate('Save', { image })}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={container.container}>
      <View style={container.camera}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={container.container}
          type={type}
          ratio={'1:1'}
        />
      </View>
      <View
        style={[
          container.horizontal,
          utils.centerHorizontal,
          utils.justifyCenter,
          utils.marginBottom,
        ]}>
        <MaterialCommunityIcons
          style={[utils.margin15]}
          name='rotate-3d-variant'
          size={30}
          color='black'
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}></MaterialCommunityIcons>
        <Feather
          style={[utils.margin15]}
          name='camera'
          size={30}
          color='black'
          onPress={() => takePicture()}
        />
        <Feather
          style={[utils.margin15]}
          name='image'
          size={30}
          color='black'
          onPress={() => pickImage()}
        />
      </View>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

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
