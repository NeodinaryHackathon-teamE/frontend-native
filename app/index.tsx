import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

const INITIAL_URL = 'http://10.10.151.150:5173';

interface LocationCoords {
  lat: number;
  lng: number;
}

interface ReadyMessage {
  type: 'ready';
}

export default function Index() {
  const webviewRef = useRef<WebView | null>(null);
  const [webviewReady, setWebviewReady] = useState(false);
  const [location, setLocation] = useState<LocationCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (webviewReady && location) {
      const message = JSON.stringify(location);
      webviewRef.current?.postMessage(message);
      console.log('Location sent to WebView:', message);
    }
  }, [webviewReady, location]);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data: ReadyMessage = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        console.log('WebView is ready');
        setWebviewReady(true);
      }
    } catch (error) {
      console.warn('Failed to parse message from WebView:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: INITIAL_URL }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
