import { Camera, CameraType } from 'expo-camera';
import { setStatusBarTranslucent } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

export default function App() {

  const [type, settype] = useState(CameraType.back)
  const [camera, setcamera] = useState()
  const [cameraStatus,setcameraStatus] = useState({})
  const [micStatus,setmicStatus] = useState({})
  const [mediaStatus,setmediaStatus] = useState({})
  const [startRecording, setstartRecording] = useState(false)
  const [timer, settimer] = useState(0)

  async function permission(){
    await Camera.requestCameraPermissionsAsync().then(setcameraStatus)
    await Camera.requestMicrophonePermissionsAsync().then(setmicStatus)
    await MediaLibrary.requestPermissionsAsync().then(setmediaStatus)
  }

  useEffect(() => {
    permission()
    setStatusBarTranslucent(true)
  },[])

  useEffect(() => {
    let interval = null
    if(startRecording){
      interval = setInterval(() => {
        settimer( prev => prev + 1)
      }, 1000);

    }else{
      clearInterval(interval)
      settimer(0)
    }

    return () => {
      clearInterval(interval)
    }

  },[startRecording])

  const toggleCameraType = () => {
    setstartRecording(false)
    settype( current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  const stopRecording = () => {
    camera.stopRecording()
    setstartRecording(false)
  }

  const record = () => {
    camera.recordAsync()
    .then(video => {
      MediaLibrary.saveToLibraryAsync(video.uri)
    })
    setstartRecording(true)
  }

  return (
    <Camera
      ref={(ref) => {
        setcamera(ref)
      }}
      style={{flex: 1, aspectRatio: 9/16}}
      ratio={'16:9'}
      type={type}
      onCameraReady={record}
      >
        <View style={{position: 'absolute', flexDirection: 'row', bottom: 0, padding: 48, justifyContent: 'space-between', width: Dimensions.get('window').width}}>
          <View
           style={{
            width: 61, 
            height: 61, 
            borderWidth: 3, 
            borderColor: 'white', 
            borderRadius: 100, 
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
            }}>
            <Text
             style={{
              color: 'white',
              fontSize: 34,
              fontWeight: 'bold'
              }}>{timer}</Text>
          </View>
          <TouchableOpacity onPress={startRecording ? () => stopRecording() : () => record()}>
            <Fontisto name="record" size={64} color={ startRecording ? "red" : "white"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraType}>
            <MaterialIcons name="flip-camera-android" size={64} color="white" />
          </TouchableOpacity>
        </View>
        
    </Camera>      
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  }
});
