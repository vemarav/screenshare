import React, {useState} from 'react';
import {
  Button,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { mediaDevices, RTCView } from 'react-native-webrtc';

const App = () => {
  const [stream, setStream] = useState(null);
  const start = async () => {
    console.log('start');
    if (!stream) {
      let s;
      try {
        s = await mediaDevices.getDisplayMedia({ video: true });
        console.log (s.toURL ());
        setStream(s);
      } catch(e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log('stop');
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
                streamURL={stream.toURL()}
                style={styles.stream}
              />
            ) : null
          }
        </View>
        <View style={styles.footer}>
          <Button
            title = "Start"
            onPress = {start} />
          <Button
            title = "Stop"
            onPress = {stop} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  stream: { flex: 1 },
  footer: {
    backgroundColor: Colors.lighter,
    paddingBottom: 30,
  },
});

export default App;