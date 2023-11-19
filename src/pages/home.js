import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync } from 'expo-location';
import * as Location from 'expo-location';
import { ModalParoquia } from '../components/modalParoquia';
import { Atalhos } from '../components/atalhos';

export function Home({ navigation }) {
  const [location, setLocation] = useState(null);
  const [paroquias, setParoquias] = useState();
  const [paroquia, setParoquia] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
    }, [])
  );

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

  function AbrirModal(item){
    setModalVisible(true);
    setParoquia(item);
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
          minZoomLevel={16}
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
                  onPress={() => AbrirModal(item)}
                  coordinate={{
                  latitude: Number(item.latitude),
                  longitude: Number(item.longitude)
                }}>
              </Marker>
            ))
          }
        </MapView>
      }

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalParoquia navigation={navigation} paroquia={paroquia} fecharModal={ () => setModalVisible(false) } />
      </Modal>

      <Atalhos navigation={navigation} paroquias={paroquias}/>
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
  },
  modalParoquia: {
    height: '80%'
  }

});
