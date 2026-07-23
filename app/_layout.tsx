import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {View, StyleSheet} from "react-native";

export default function RootLayout() {
    return (
        <View style={styles.container}>
            {/* Configure la barre de statut système (heure, batterie) en blanc */}
            <StatusBar style="light"/>

            <Stack
                screenOptions={{
                    headerShown: false, // Masque le header par défaut
                    contentStyle: {backgroundColor: "#46A53A"}, // 👈 Force tout l'arrière-plan en vert
                    animation: "fade", // Animation fluide entre les écrans
                }}
            >
                {/* Tes écrans de navigation */}
                <Stack.Screen name="index"/>
                <Stack.Screen name="login"/>
                <Stack.Screen name="register"/>
                <Stack.Screen name="(tabs)"/>
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#46A53A", // Assure qu'aucun flash blanc n'apparaît lors des transitions
    },
});