// pages/index.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';


const Welcome = ({ navigation }: any) => {
    const router = useRouter();

    return (

        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image
                    source={require('../../assets/image.png')} // Replace with your logo/image
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome to MediGo</Text>
                <Text style={styles.subtitle}>
                    Your trusted partner for easy access to medications and health essentials. Get started now!
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonOutline}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEBED',
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 75, // Circular logo
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#006989',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 19,
        color: '#01A7C2',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        width: '70%',
        backgroundColor: '#01A7C2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    buttonOutline: {
        width: '70%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#01A7C2',
        backgroundColor: 'transparent',
        marginVertical: 10,
    },
    buttonOutlineText: {
        color: '#01A7C2',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default Welcome;
