import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  useWindowDimensions, 
  StyleSheet, 
  AppState 
} from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const Tab = createBottomTabNavigator();
const HOME_URL = 'https://tech-developer-test.github.io/test/index.html';

function HomeScreen({ reloadTrigger }) {
  const [webviewKey, setWebviewKey] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setWebviewKey(prevKey => prevKey + 1);
  }, [reloadTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWebviewKey(prevKey => prevKey + 1);
    }, 9000000); // ~2.5 hours
    return () => clearInterval(interval);
  }, []);

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;

    const isNameNotResolvedError =
      nativeEvent.code === -2 ||
      nativeEvent.description?.includes('net::ERR_NAME_NOT_RESOLVED');

    const isTimeoutError =
      nativeEvent.code === -8 ||
      nativeEvent.description?.includes('net::ERR_CONNECTION_TIMED_OUT') ||
      nativeEvent.description?.includes('net::ERR_TIMED_OUT');

    if (isNameNotResolvedError || isTimeoutError) {
      console.warn(`WebView error ${nativeEvent.code}: ${nativeEvent.description}`);
      setTimeout(() => {
        setWebviewKey(prevKey => prevKey + 1);
      }, 1000);
    }
  };

  const handleHttpError = ({ nativeEvent }) => {
    if (nativeEvent.statusCode >= 500) {
      console.warn(`Server error ${nativeEvent.statusCode}. Reloading WebView...`);
      setTimeout(() => {
        setWebviewKey(prevKey => prevKey + 1);
      }, 1000);
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.centered}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setWebviewKey(prevKey => prevKey + 1);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <WebView
      key={webviewKey}
      source={{ uri: HOME_URL }}
      style={{ flex: 1 }}
      onError={handleWebViewError}
      onHttpError={handleHttpError}
      startInLoadingState={true}
      renderError={(errorName) => (
        <View style={styles.centered}>
          <Text style={styles.offlineText}>Error loading page: {errorName}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setWebviewKey(prevKey => prevKey + 1);
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

function ReloadScreen({ setReloadTrigger, navigation }) {
  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        setReloadTrigger(prev => prev + 1);
        navigation.navigate('Home');
      }, 300);
      return () => clearTimeout(timeout);
    }, [navigation, setReloadTrigger])
  );
  return <View />;
}

function MyTabs() {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: isLandscape ? { display: 'none' } : { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        headerShown: !isLandscape,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: 'Home',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              color="#008000"
              size={24}
            />
          ),
        }}
      >
        {() => <HomeScreen reloadTrigger={reloadTrigger} />}
      </Tab.Screen>
      <Tab.Screen
        name="Back"
        options={{
          title: 'Back',
          tabBarIcon: () => (
            <Ionicons name="arrow-back-circle" color="#008000" size={26} />
          ),
        }}
      >
        {({ navigation }) => (
          <ReloadScreen setReloadTrigger={setReloadTrigger} navigation={navigation} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  offlineText: {
    fontSize: 18,
    marginBottom: 16,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#008000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
});
