import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

export function Atalhos({ navigation, favoritos, location, historico }) {
    const [atalho, setAtalho] = useState(1);
    
    return (
        <View style={styles.atalhosArea}>
            <View style={styles.opcoes}>
                <TouchableOpacity style={[styles.botaoOpcoes, atalho === 1 && styles.botaoPressionado]} onPress={() => { setAtalho(1) }}>
                    <Text style={styles.textoAtalhos}>Favoritos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.botaoOpcoes, atalho === 2 && styles.botaoPressionado]} onPress={() => setAtalho(2)} >
                    <Text style={styles.textoAtalhos}>Histórico</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollAreaFavoritos}>
                <View style={styles.areaFavoritos}>
                    {
                        atalho === 1
                            ?
                            favoritos.map(paroquia => (
                                <TouchableOpacity
                                    style={styles.botao}
                                    key={paroquia.id}
                                    onPress={() => navigation.navigate('Paroquia', { paroquia, favoritos, historico, location })}
                                >
                                    <Text style={styles.nomeParoquia} numberOfLines={1}>{paroquia.nome}</Text>
                                    <Text style={styles.endParoquia} numberOfLines={1}>{paroquia.enderecos}</Text>
                                </TouchableOpacity>
                            ))
                            :
                            historico.map(paroquia => (
                                <TouchableOpacity
                                    style={styles.botao}
                                    key={paroquia.id}
                                    onPress={() => navigation.navigate('Paroquia', { paroquia, favoritos, historico, location })}
                                >
                                    <Text style={styles.nomeParoquia} numberOfLines={1}>{paroquia.nome}</Text>
                                    <Text style={styles.endParoquia} numberOfLines={1}>{paroquia.enderecos}</Text>
                                </TouchableOpacity>
                            ))
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    atalhosArea: {
        backgroundColor: '#808080',
        width: "100%",
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    opcoes: {
        height: "12%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    botaoOpcoes: {
        flex: 1,
        backgroundColor: "#737373",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    botaoPressionado: {
        backgroundColor: '#2980b9', // Cor mais escura quando pressionado
    },
    areaFavoritos: {
        width: "100%",
        backgroundColor: "#878787"
    },
    scrollAreaFavoritos: {
        height: "90%",
        backgroundColor: "white",
        width: "100%"
    },
    botao: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        borderBottomStyle: 'solid',
        backgroundColor: "#B3B3B3"
    },
    textoAtalhos: {
        color: "#FFF",
        fontWeight: "bold"
    },
    nomeParoquia: {
        color: "#000",
        width: "100%",
        fontSize: 15,
        textAlign: "left",
        fontWeight: "bold"
    },
    endParoquia: {
        width: "100%",
        textAlign: "left",
        color: "#FFF",
        flexWrap: "nowrap"
    }
})