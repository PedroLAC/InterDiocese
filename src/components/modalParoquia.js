import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function ModalParoquia({ navigation, paroquia, location, fecharModal }) {
    return (
        <View style={styles.container}>
            <View style={styles.modalConteudo}>
                <Text style={styles.nomeParoquia}>{paroquia.nome}</Text>

                <View style={styles.botaoArea}>
                    <TouchableOpacity style={styles.botao} onPress={fecharModal}>
                        <Text style={styles.textoBotao}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.botao, styles.botaoMais]} onPress={() => navigation.navigate('Paroquia', { paroquia, location })}>
                        <Text style={styles.textoBotaoMais}>Mais informações</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(24, 24, 24, 0.6)",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalConteudo:{
        backgroundColor: '#FFF',
        width: "85%",
        height: '20%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nomeParoquia:{
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000",
        marginBottom: 24
    },
    botaoArea:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "85%",
        marginTop: 8,
    },
    botao:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        marginBottom: 14,
        padding: 8
    },
    botaoMais:{
        backgroundColor: "#392DE9",
        borderRadius: 8
    },
    textoBotaoMais:{
        color: "#FFF",
        fontWeight: "bold"
    }
})