import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Paroquia({ route }) {
    const [paroquia, setParoquia] = useState();
    
    useEffect(() => {
        if (route.params && route.params.item) {
            setParoquia(route.params.item);
        }
    }, [route.params]);

    return(
        <View>
            <Text>{paroquia?.nome}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

})