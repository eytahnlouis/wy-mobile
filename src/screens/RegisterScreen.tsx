import React, {useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert, Platform, KeyboardAvoidingView,
} from "react-native";
import {login} from "../api/authService";
import {Checkbox} from "expo-checkbox";
import {useRouter} from "expo-router";
import {useFonts} from "expo-font";

const RegisterScreen = () => {
    const router = useRouter();
    const [register, setRegister] = useState({
        username: "",
        email: "",
        password: "",
        isDriver: false,
        licensePlate: "",
    });
    const [passwordIsValid, isPasswordValid] = useState("");
    const [loading, setLoading] = useState(false);
    const [loaded] = useFonts({
        KonkhmerSleokchher: require("@/assets/fonts/KonkhmerSleokchher-Regular.ttf"),
    });

    const hasUsername = Boolean(register.username);
    const hasEmail = Boolean(register.email);
    const hasPassword = Boolean(register.password);
    const passwordsMatch = passwordIsValid === register.password;

    const isFormValid =
        hasUsername &&
        hasEmail &&
        hasPassword &&
        passwordsMatch;

    const handleRegister = async () => {
        setLoading(true);
        if (!isFormValid) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs correctement.");
            return;
        }

        try {
            await login.register({
                username: register.username,
                email: register.email,
                password: register.password,
                isDriver: register.isDriver,
                license_plate: register.isDriver ? register.licensePlate : "",
            });
            // Navigation vers l'écran principal après une connexion réussie
            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert(
                "Erreur de connexion",
                "Veuillez vérifier vos identifiants et réessayer.",
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.content}>
                <Text style={styles.logo}>wy@</Text>
                <Text style={styles.subtitle}>Votre trajet en temps réel</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom d'utilisateur"
                        placeholderTextColor="#696262"
                        value={register.username}
                        onChangeText={(text) => setRegister({...register, username: text})}
                        autoCapitalize="none"
                        keyboardType="default"
                        autoComplete="username"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#696262"
                        value={register.email}
                        onChangeText={(text) => setRegister({...register, email: text})}
                    />
                    <View style={{flexDirection: "row", alignItems: "center", marginBottom: 20}}>
                        <Text style={{color: "#696262", marginBottom: 5}}>Êtes-vous un conducteur ?</Text>
                        <Checkbox
                            value={register.isDriver}
                            onValueChange={(newValue) => setRegister({...register, isDriver: newValue})}
                            style={{marginBottom: 20}}/>
                    </View>

                    {register.isDriver ? (
                        <TextInput
                            style={styles.input}
                            placeholder="Plaque d'immatriculation"
                            placeholderTextColor="#696262"
                            value={register.licensePlate}
                            onChangeText={(text) => setRegister({...register, licensePlate: text})}
                        />
                    ) : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor="#696262"
                        value={register.password}
                        onChangeText={(text) => setRegister({...register, password: text})}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="#696262"
                        value={passwordIsValid}
                        onChangeText={isPasswordValid}
                        secureTextEntry
                    />
                    {loading && <ActivityIndicator size="large" color="#27AE60"/>}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        !isFormValid && styles.buttonDisabled,
                    ]}
                    onPress={handleRegister}
                    disabled={!isFormValid}
                >
                    <Text style={styles.buttonText}> -{">"} </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.footerText}>
                        Vous avez déjà un compte ?{" "}
                        <Text style={styles.greenText}>Se connecter</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#46A53A",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#46A53A",
    },
    logo: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 40,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
        alignItems: "center",
    },
    input: {
        width: "85%",
        height: 50,
        backgroundColor: "#D9D9D9",
        borderRadius: 26,
        paddingHorizontal: 15,
        alignSelf: "center",
        marginBottom: 50,
        fontSize: 14,
        color: "#696262",
        fontFamily: "KonkhmerSleokchher",

        // iOS
        shadowColor: "#000",
        shadowOffset: {width: 5, height: 2},
        shadowOpacity: 1,
        shadowRadius: 4,

        // Android
        elevation: 4,
    },
    button: {
        width: "25%",
        height: 55,
        backgroundColor: "#ffffff",
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: "#95D5B2",
    },
    buttonText: {
        color: "#000000",
        fontSize: 40,
        fontWeight: "bold",
    },
    footerText: {
        marginTop: 20,
        color: "#e0e3e7",
    },
    greenText: {
        color: "#000000",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
