import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync } from 'expo-location';
import * as Location from 'expo-location';

export function Home({ navigation }) {
  const [location, setLocation] = useState(null);
  const [paroquias, setParoquias] = useState();

  const mapRef = useRef(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  const fetchParoquias = () => {
    let dados = require('../../public/paroquias.json');
    setParoquias(dados);
  };

  function ListenerPosition() {
    watchPositionAsync({
      accuracy: Location.LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        center: response.coords
      })
    });
  }

  useEffect(() => {
    fetchParoquias();
  }, []);

  useEffect(() => {
    requestLocationPermissions();
    ListenerPosition();
  }, []);

  return (
    <View style={styles.container}>
      {
        location &&
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          minZoomLevel={17}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>

          {
            paroquias && paroquias.map(item => (
              <Marker
                  key={item.id}
                  onPress={() => navigation.navigate('Paroquia', { item })}
                  coordinate={{
                  latitude: Number(item.latitude),
                  longitude: Number(item.longitude)
                }}>
                  <Callout>
                    <View>
                      <Text>{item.nome}</Text>
                    </View>
                  </Callout>
              </Marker>
            ))
          }
        </MapView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%'
  }
});
