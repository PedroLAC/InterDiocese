import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export function Paroquia({ route }) {
    const [paroquia, setParoquia] = useState();

    useEffect(() => {
        if (route.params && route.params.paroquia) {
            setParoquia(route.params.paroquia);
        }
    }, [route.params]);

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

        </View>
    )
}

const styles = StyleSheet.create({
    missaDia: {
        fontSize: 17,
    },
    textosMissas:{
        marginHorizontal: 18
    }
})