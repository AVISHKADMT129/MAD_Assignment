import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const Login = ({ navigation }: any) => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const validateFields = () => {
        let valid = true;
        const newErrors = { username: '', password: '' };

        if (!username) {
            newErrors.username = 'User Name is required';
            valid = false;
        } else if (!/^[a-zA-Z0-9_]*$/.test(username)) {
            newErrors.username = 'Enter a valid User Name';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (validateFields()) {
            try {
                const response = await axios.post('http://192.168.1.7:5000/api/login', {
                    username,
                    password,
                });

                if (response.status === 200) {
                    const { token } = response.data;
                    dispatch(login({ username, token }));
                    Alert.alert('Success', 'Logged in successfully!', [
                        {
                            text: 'OK',
                            onPress: () => {
                                setTimeout(() => {
                                    navigation.navigate('Home');
                                }, 500);
                            },
                        },
                    ]);
                }
            } catch (error: any) {
                if (error.response) {
                    setErrors({ username: '', password: error.response.data.message });
                } else {
                    setErrors({ username: '', password: 'An error occurred. Please try again later.' });
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>Welcome back! Please log in to your account.</Text>

                <Text style={styles.label}>User Name</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={20} color="#007090" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="User Name"
                        value={username}
                        onChangeText={setusername}
                    />
                </View>
                {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={20} color="#007090" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.signUpText}>
                    Don't have an account?{' '}
                    <Text
                        style={styles.signUpLink}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        Sign Up
                    </Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEBED',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20
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
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 10,
        color: '#01A7C2',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C1D0D7',
        borderRadius: 8,
        marginTop: 5,
        paddingHorizontal: 10,
        backgroundColor: '#C1D0D7'
    },
    input: {
        flex: 1,
        height: 45,
        paddingLeft: 10,
        color: '#1F4037',
    },
    errorText: {
        color: '#D9534F',
        fontSize: 14,
        marginTop: 5,
    },
    button: {
        width: "60%",
        backgroundColor: '#01A7C2',
        padding: 15,
        borderRadius: 8,
        marginTop: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signUpText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    signUpLink: {
        color: '#4BA3C3',
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 10,
    },
});

export default Login;
