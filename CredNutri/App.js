import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [hasError, setHasError] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);
  const [url, setUrl] = useState('https://tech-developer-test.github.io/test/home.html');
  const [selectedTab, setSelectedTab] = useState(null); // No tab selected by default

 const handleWebViewError = ({ nativeEvent }) => {
  const { code, description } = nativeEvent;
  if (
    code === -2 || // ERR_NAME_NOT_RESOLVED
    code === -6 || // ERR_CONNECTION_ABORTED
    code === -8 || // ERR_CONNECTION_TIMED_OUT
    description.includes('net::ERR_NAME_NOT_RESOLVED') ||
    description.includes('net::ERR_CONNECTION_TIMED_OUT') ||
    description.includes('net::ERR_CONNECTION_ABORTED') ||
    description.includes('net::ERR_TIMED_OUT')
  ) {
    setHasError(true);
  }
};

  const retryWebView = () => {
    setHasError(false);
    setWebViewKey(prevKey => prevKey + 1);
  };

  const handleNavigation = (page) => {
    let newUrl = '';

    if (page === 'home') {
      newUrl = 'https://tech-developer-test.github.io/test/nutrihub.html';
    } else if (page === 'notifications') {
      newUrl = 'https://tech-developer-test.github.io/test/smfashion.html';
    }

    setSelectedTab(page);
    setUrl(newUrl);
    setWebViewKey(prevKey => prevKey + 1);
    setHasError(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewContainer}>
        {hasError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Oops! Something went wrong.</Text>
            <TouchableOpacity onPress={retryWebView} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            key={webViewKey}
            source={{ uri: url }}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onError={handleWebViewError}
            onHttpError={handleWebViewError}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => handleNavigation('home')} style={styles.navItem}>
          <Icon
            name={selectedTab === 'home' ? 'home' : 'home-outline'}
            size={28}
            color={selectedTab === 'home' ? '#ff6600' : '#333'}
          />
          <Text style={[styles.navLabel, { color: selectedTab === 'home' ? '#ff6600' : '#333' }]}>
            Nutrihub
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('notifications')} style={styles.navItem}>
          <Icon
            name={selectedTab === 'notifications' ? 'cart' : 'cart-outline'}
            size={28}
            color={selectedTab === 'notifications' ? '#ff6600' : '#333'}
          />
          <Text
            style={[
              styles.navLabel,
              { color: selectedTab === 'notifications' ? '#ff6600' : '#333' },
            ]}
          >
            Fashion
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webviewContainer: {
    flex: 1,
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
