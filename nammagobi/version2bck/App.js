import React, { useEffect, useState } from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import RetailScreen from './screens/RetailScreen';
import ManufacturerScreen from './screens/ManufacturerScreen';
import PreOwnedScreen from './screens/PreOwnedScreen';
import ServiceScreen from './screens/ServiceScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [address, setAddress] = useState('Fetching location...');

  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Location permission denied');
        Alert.alert('Permission to access location was denied');
        return;
      }

      // Watch and update location in real-time
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // every 10 seconds
          distanceInterval: 100, // or every 100 meters
        },
        async (loc) => {
          try {
            const geocode = await Location.reverseGeocodeAsync(loc.coords);
            if (geocode.length > 0) {
              const { city, district, region, country } = geocode[0];
              setAddress(`${district || city}, ${region}, ${country}`);
            } else {
              setAddress('Location not found');
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            setAddress('Location error');
          }
        }
      );
    })();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View style={styles.locationBar}>
          <Ionicons name="location-outline" size={16} color="#007bff" />
          <Text style={styles.locationText}>{address}</Text>
        </View>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Manufacturer') iconName = 'business';
              else if (route.name === 'Retail') iconName = 'cart';
              else if (route.name === 'Service') iconName = 'construct';
              else if (route.name === 'Pre-Owned') iconName = 'cube';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Retail" component={RetailScreen} />
          <Tab.Screen name="Manufacturer" component={ManufacturerScreen} />
          <Tab.Screen name="Service" component={ServiceScreen} />
          <Tab.Screen name="Pre-Owned" component={PreOwnedScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
});
