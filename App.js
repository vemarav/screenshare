import React, {useState} from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
  View,
  StyleSheet,
  StatusBar,
  findNodeHandle,
  NativeModules,
  TouchableOpacity,
  Text,
} from 'react-native';
import { 
  mediaDevices, 
  RTCView, 
  ScreenCapturePickerView,
} from 'react-native-webrtc';

const App = () => {
  const screenCaptureView = React.useRef(null);
  const [stream, setStream] = useState(null);

  const startBroadcast = async () => {
    const reactTag = findNodeHandle(screenCaptureView.current);
    return NativeModules.ScreenCapturePickerViewManager.show(reactTag);
  }

  const startStream = async () => {
    const _stream = await mediaDevices.getDisplayMedia({ video: true });
    setStream(_stream);
  }

  const start = async () => {
    try {
      await startBroadcast();
      await startStream();
    } catch (error) {
      console.error(error);
      alert('Failed to start!'); 
    }
  };

  const stop = () => {
    stream?.release();
    setStream(null);
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.body}>
        <View style={styles.stream}>
          {stream ?
            ( 
              <RTCView
                objectFit={'contain'}
                streamURL={stream.toURL()}
                style={styles.stream}
              />
            ) : null
          }
          <ScreenCapturePickerView ref={screenCaptureView}/>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={start}>
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>Start</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={stop}>
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>Stop</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {backgroundColor: Colors.dark, ...StyleSheet.absoluteFill},
  stream: { flex: 1, padding: 44 },
  footer: {width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 30},
  btn: {paddingHorizontal: 50, paddingVertical: 10, backgroundColor: '#0275d8', borderRadius: 5},
  btnTxt: {color: Colors.white, textAlign: 'center', fontSize: 20}
});

export default App;