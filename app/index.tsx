import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const INITIAL_URL = 'https://www.naver.com';
export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: INITIAL_URL }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
