import React, {useEffect, useState} from 'react';
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
import { useIsCaptured } from 'react-native-is-captured';

const App = () => {
  const screenCaptureView = React.useRef(null);
  const [stream, setStream] = useState(null);
  const isCaptured = useIsCaptured ();

  useEffect(() => {
    if (!isCaptured) {
      setStream (null);
    }
  }, [isCaptured]);

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

  const stop = async () => {
    await startBroadcast();
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
          <TouchableOpacity onPress={() => isCaptured ? stop() : start() }>
            <View style={[styles.btn, isCaptured ? styles.active : styles.inactive]}>
              <Text style={styles.btnTxt}>{isCaptured ? 'Stop' : 'Start'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {backgroundColor: '#1c1c1c', ...StyleSheet.absoluteFill},
  stream: { flex: 1, padding: 44 },
  footer: {width: '100%', padding: 30},
  btn: {paddingHorizontal: 50, paddingVertical: 10, borderRadius: 5},
  btnTxt: {color: Colors.white, textAlign: 'center', fontSize: 20},
  active: {backgroundColor: '#FC3d39'},
  inactive: {backgroundColor: '#454545'}
});

export default App;