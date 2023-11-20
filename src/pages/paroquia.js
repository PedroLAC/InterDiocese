import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Paroquia({ route }) {
    const [paroquia, setParoquia] = useState();
    const [favoritos, setFavoritos] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [ehFavorito, setEhFavorito] = useState(false);

    function AdicionarFavorito() {
        GetConteudo("favoritos").then(favs => {
            favs.unshift(paroquia);
            SetFavs(favs);
            setEhFavorito(true);
        });
    }

    const GetConteudo = async (nomeVar) => {
        try {
            const jsonValue = await AsyncStorage.getItem(nomeVar);
            const favs = jsonValue ? JSON.parse(jsonValue) : [];
            if (!Array.isArray(favs)) {
                return [];
            }

            return favs;
        } catch (e) {
            console.log("Erro GetConteudo:: ", e);
            return [];
        }
    };

    const SetFavs = async (favs) => {
        try {
            const jsonValue = JSON.stringify(favs);
            await AsyncStorage.setItem('favoritos', jsonValue);
        } catch (e) {
            console.log(e);
        }
    };

    const SetHistorico = async () => {
        try {
            let hist = historico;
            hist = hist.filter(historico => historico.id !== paroquia.id);
            if (hist.length <= 3) {
                hist.unshift(paroquia);
            } else {
                hist.unshift(paroquia);
                hist.pop();
            }

            const jsonValue = JSON.stringify(hist);
            await AsyncStorage.setItem('historico', jsonValue);
        } catch (e) {
            console.log("Erro SetHistorico::", e);
        }
    };

    function RemoverFavorito() {
        GetConteudo("favoritos").then(favs => {
            const novosFavoritos = favs.filter(favorito => favorito.id !== paroquia.id);
            SetFavs(novosFavoritos);
            setEhFavorito(false);
        });
    }

    useEffect(() => {
        const loadFavoritos = async () => {
            const favs = await GetConteudo("favoritos");
            setFavoritos(favs);
        };
        const loadHistorico = async () => {
            const hist = await GetConteudo("historico");
            setHistorico(hist);
        };
        const loadData = async () => {
            if (route.params && route.params.paroquia) {
                setParoquia(route.params.paroquia);
                await loadFavoritos();
                await loadHistorico();
            }
        };
    
        loadData();
    }, [route.params]);
    
    useEffect(() => {
        if (paroquia && historico) {
            SetHistorico();
        }
    }, [historico]);

    useEffect(() => {
        setEhFavorito(paroquia && favoritos.some(item => item.id === paroquia.id));
    }, [paroquia, favoritos]);

    return (
        <View>
            {paroquia?.imagem && (
                <Image
                    source={{ uri: 'https://www.diocesedesantos.com.br/images/paroquias/' + paroquia.imagem }}
                    style={{ width: '100%', height: 230 }}
                    resizeMode="cover"
                />
            )}
            <View style={styles.conteudo}>
                <Text style={{ fontSize: 25, fontWeight: "bold", width: "100%", textAlign: "center", marginTop: 15 }}>{paroquia?.nome}</Text>
                <Text style={[styles.textosMissas, { fontSize: 20, fontWeight: "bold", marginTop: 15, marginBottom: 8 }]}>Missas</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Domingo: {paroquia?.missas.domingo}</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Segunda-feira: {paroquia?.missas.segunda}</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Terça-feira: {paroquia?.missas.terca}</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Quarta-feira: {paroquia?.missas.quarta}</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Quinta-feira: {paroquia?.missas.quinta}</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Sexta-feira: {paroquia?.missas.sexta}</Text>
                <Text style={[styles.missaDia, styles.textosMissas]}>Sábado: {paroquia?.missas.sabado}</Text>
            </View>

            <View style={styles.areaFavorito}>
                {ehFavorito ? (
                    <TouchableOpacity style={[styles.botao, styles.botaoRemover]} onPress={() => RemoverFavorito()}>
                        <Text style={styles.textoBotao}>Remover favorito</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.botao, styles.botaoFavorito]} onPress={() => AdicionarFavorito()}>
                        <Text style={styles.textoBotao}>Favoritar</Text>
                    </TouchableOpacity>
                )}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    missaDia: {
        fontSize: 17,
    },
    textosMissas: {
        marginHorizontal: 18
    },
    areaFavorito: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 10
    },
    botao: {
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        marginBottom: 14,
        padding: 8
    },
    botaoFavorito: {
        backgroundColor: "#392DE9",
        borderRadius: 8
    },
    botaoRemover: {
        backgroundColor: "red",
        borderRadius: 8
    },
    textoBotao: {
        color: "#FFF",
        fontWeight: "bold"
    }
})