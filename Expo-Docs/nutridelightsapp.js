import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  View,
  Text,
  Button,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [hasError, setHasError] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);

  const handleWebViewError = ({ nativeEvent }) => {
    console.warn('WebView error:', nativeEvent);
    const { code, description } = nativeEvent;

    if (
      code === -2 || code === -8 ||
      description.includes('net::ERR_NAME_NOT_RESOLVED') ||
      description.includes('net::ERR_CONNECTION_TIMED_OUT') ||
      description.includes('net::ERR_TIMED_OUT')
    ) {
      setHasError(true);
    }
  };

  const retryWebView = () => {
    setHasError(false);
    setWebViewKey(prevKey => prevKey + 1); // Force reload
  };

  return (
    <SafeAreaView style={styles.container}>
      {hasError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            Oops! Something went wrong.
          </Text>
          <Button title="Retry" onPress={retryWebView} />
        </View>
      ) : (
        <WebView
          key={webViewKey}
          source={{ uri: 'https://tech-developer-test.github.io/test/nutrihub.html' }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
});
