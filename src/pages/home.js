import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Callout } from 'react-native-maps';
import {
  StyleSheet, Text, View, Modal, TextInput, ScrollView, FlatList,
  TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image
} from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync } from 'expo-location';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { ModalParoquia } from '../components/modalParoquia';
import { Atalhos } from '../components/atalhos';
import { MaterialIcons } from '@expo/vector-icons';
import { parseHtml } from './apiParsing';

export function Home({ navigation }) {
  const [location, setLocation] = useState(null);
  const [paroquias, setParoquias] = useState();
  const [paroquia, setParoquia] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [paroquiasApi, setParoquiasApi] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredParoquias, setFilteredParoquias] = useState([]);
  const mapRef = useRef(null);
  //testando api

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      GetFavoritos();
      GetHistorico();
    }, [])
  );

  const removeAccents = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  async function registerForPushNotifications() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("=======TOKEN===========")
    console.log(token);

    return token;
  }

  const GetFavoritos = async () => {
    try {
      let value = await AsyncStorage.getItem("favoritos");
      if (value != null) {
        value = JSON.parse(value);
        setFavoritos(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const GetHistorico = async () => {
    try {
      let value = await AsyncStorage.getItem("historico");
      if (value != null) {
        value = JSON.parse(value);
        setHistorico(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async () => {
    const chaveAPI = "c2hhMjU2OjMxNzo1NTU4MTkyN2FlNWViZjY4ZDA5NTZjMmYwZDZmMmJiMjcxYTM2MDViNWFjODk4YjQ0NzliMWRjNzg5NTJlNmM";
    const response = await fetch('https://nunescarlos.online/api/index.php/v1/mini/paroquias', {
      method: 'GET',
      headers: {
        'Authorization': chaveAPI,
      },
    })
    const data = await response.json();
    //console.log(data)
    let parsedHtml = [];
    let paroquias = [];

    for (const item of data['data']) {
      if (!paroquias.includes(item['alias'])) {
        if (!item['fulltext']) {
          parsedHtml.push(parseHtml(item['id'], item['alias'], item['images'], item['introtext']))

        } else {
          parsedHtml.push(parseHtml(item['id'], item['alias'], item['images'], item['fulltext']))
        }
        paroquias.push(item['alias'])
      }
    }

    return parsedHtml;

  }
  const fetchCoord = async (address) => {
    //Testando o fetch
    const apiKey = "";
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' +
      apiKey, { method: 'GET' }
    );

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng
      };
    } else {
      return {
        latitude: 0,
        longitude: 0
      };
    }
  };

  const fetchParoquias = async () => {
    // let dados = require('../../public/paroquias.json');

    const parsedData = await fetchData();

    for (const item of parsedData) {
      const aux = await fetchCoord(item.enderecos);
      item.latitude = aux.latitude;
      item.longitude = aux.longitude;
    }

    if (parsedData) {
      setParoquias(parsedData);
    }
  };

  function ListenerPosition() {
    watchPositionAsync({
      accuracy: Location.LocationAccuracy.Highest,
      timeInterval: 10,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        center: response.coords
      })
    });
  }

  function AbrirModal(item) {
    setModalVisible(true);
    setParoquia(item);
  }
  //Teste

  useEffect(() => {
    const fetchActions = async () => {
      await requestLocationPermissions();
      await registerForPushNotifications();
      ListenerPosition();
      await fetchParoquias();
      await GetFavoritos();
      await GetHistorico();
    };

    fetchActions();
  }, []);


  const handleSearchInputChange = (text) => {
    setSearchInput(text);
    filterParoquias(text);
  };

  const filterParoquias = (text) => {
    const normalizedText = removeAccents(text); // Remova a acentuação
    const filtered = paroquias
      ? paroquias.filter((paroquia) =>
        removeAccents(paroquia.nome).toLowerCase().includes(normalizedText)
      )
      : [];
    setFilteredParoquias(filtered);
  };

  // const arrumarEndereco = (end) => {
  //   let palavras = end.split(' ');

  //   // Capitaliza a primeira letra de cada palavra
  //   for (let i = 0; i < palavras.length; i++) {
  //     palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1).toLowerCase();
  //   }

  //   // Junta as palavras de volta em uma string
  //   let endFormatado = palavras.join(' ');

  //   console.log("end:: ", endFormatado);
  //   return endFormatado;
  // }

  const handlePressOutside = () => {
    setFilteredParoquias([]); // Limpar a lista de opções ao pressionar fora
    Keyboard.dismiss(); // Esconder o teclado ao pressionar fora
  };

  const onCenterMap = () => {
    ListenerPosition();
  };


  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar Paróquias"
          value={searchInput}
          onChangeText={handleSearchInputChange}
        />
        <ScrollView style={styles.optionsList}>
          {filteredParoquias.map((paroquia) => (
            <TouchableOpacity
              key={paroquia.id}
              onPress={() => navigation.navigate('Paroquia', { paroquia, location })}
              style={styles.optionItem}
            >
              <Text numberOfLines={1}>{paroquia.nome} - <Text style={styles.textoEndeco}>{paroquia.enderecos}</Text></Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {
          location &&
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={false}
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
                  icon={require('../../assets/markerIcon.png')}
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
        <TouchableOpacity
          style={{
            position: 'absolute', top: 100, right: 16, backgroundColor: 'white',
            padding: 6, borderRadius: 5, borderWidth: 1, borderColor: 'black',
            borderBottomStyle: 'solid'
          }}
          onPress={onCenterMap}
        >
          <MaterialIcons name="center-focus-strong" size={24} color="black" />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <ModalParoquia navigation={navigation} paroquia={paroquia} location={location} fecharModal={() => setModalVisible(false)} />
        </Modal>

        <Atalhos navigation={navigation} favoritos={favoritos} location={location} historico={historico} />
      </View>
    </TouchableWithoutFeedback>
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
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    zIndex: 1,
    position: 'absolute',
    top: 33,
    left: 10,
    right: 10,
  },
  optionsList: {
    maxHeight: 150,
    backgroundColor: 'white',
    zIndex: 2,
    position: 'absolute',
    marginHorizontal: 10,
    top: 84,
    left: 10,
    right: 10,
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  textoEndeco: {
    fontSize: 12,
    color: "gray"
  }

});
