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
import axios from 'axios';

interface InputFieldProps {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon, placeholder, value, onChange, secureTextEntry, error }) => (
    <>
        <View style={styles.inputContainer}>
            {icon}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#757575"
            />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </>
);

const Register = ({ navigation }: any) => {
    const [UserName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('Weak');
    const [passwordProgress, setPasswordProgress] = useState(0);
    const [errors, setErrors] = useState({ UserName: '', email: '', password: '', confirmPassword: '' });

    const validatePassword = (input: any) => {
        setPassword(input);
        let strength = 'Weak';
        let progress = 0;

        if (input.length > 8) progress += 25;
        if (/[A-Z]/.test(input)) progress += 25;
        if (/\d/.test(input)) progress += 25;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(input)) progress += 25;

        if (progress === 100) strength = 'Strong';
        else if (progress >= 66) strength = 'Medium';

        setPasswordStrength(strength);
        setPasswordProgress(progress);
    };

    const handleRegister = async () => {
        let tempErrors = { UserName: '', email: '', password: '', confirmPassword: '' };
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!UserName) tempErrors.UserName = 'User Name is required.';
        if (!email) tempErrors.email = 'Email is required.';
        else if (!emailRegex.test(email)) tempErrors.email = 'Invalid email format.';
        if (!password) tempErrors.password = 'Password is required.';
        else if (passwordStrength === 'Weak') tempErrors.password = 'Password must be at least Medium strength.';
        if (!confirmPassword) tempErrors.confirmPassword = 'Confirm Password is required.';
        else if (password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match.';

        setErrors(tempErrors);

        if (Object.values(tempErrors).some((error) => error !== '')) return;

        try {
            const response = await axios.post('http://192.168.1.7:5000/api/signup', {
                username: UserName,
                email,
                password,
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Account created successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setTimeout(() => {
                                navigation.navigate('Login');
                            }, 500);
                        },
                    },
                ]);
            }
        } catch (error: any) {
            if (error.response) {
                Alert.alert('Error', 'Username or email already exists.');
            } else {
                Alert.alert('Error', 'Unable to connect to the server.');
            }
        }
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Get started with your account.</Text>

                <Text style={styles.label}>User Name</Text>
                <InputField
                    icon={<FontAwesome name="user" size={20} color="#007090" style={styles.icon} />}
                    placeholder="User Name"
                    value={UserName}
                    onChange={setUserName}
                    error={errors.UserName} />

                <Text style={styles.label}>Email Address</Text>
                <InputField
                    icon={<FontAwesome name="envelope" size={20} color="#007090" style={styles.icon} />}
                    placeholder="Email Address"
                    value={email}
                    onChange={setEmail}
                    error={errors.email} secureTextEntry={undefined} />

                <Text style={styles.label}>Password</Text>
                <InputField
                    icon={<FontAwesome name="lock" size={20} color="#007090" style={styles.icon} />}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChange={validatePassword}
                    error={errors.password}
                />
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            {
                                width: `${passwordProgress}%`,
                                backgroundColor:
                                    passwordStrength === 'Strong' ? '#4CAF50' : passwordStrength === 'Medium' ? '#FFEB3B' : '#FF7043',
                            },
                        ]}
                    />
                </View>
                <Text style={styles.passwordStrength}>Password strength: {passwordStrength}</Text>

                <Text style={styles.label}>Confirm Password</Text>
                <InputField
                    icon={<FontAwesome name="lock" size={20} color="#007090" style={styles.icon} />}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    error={errors.confirmPassword}
                />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Let's Start</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.signInText}>
                    Already have an account?{' '}
                    <Text
                        style={styles.signInLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        Sign In
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
        justifyContent: 'center',
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
    },
    progressBarContainer: {
        height: 8,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginTop: 5,
    },
    progressBar: {
        height: 8,
        borderRadius: 5,
    },
    passwordStrength: {
        fontSize: 14,
        marginTop: 5,
        color: '#006989',
    },
    errorText: {
        color: '#D9534F',
        fontSize: 14,
        marginTop: 5,
    },
    button: {
        width: '60%',
        backgroundColor: '#01A7C2',
        padding: 15,
        borderRadius: 8,
        marginTop: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    signInText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    signInLink: {
        color: '#4BA3C3',
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 10,
    },
});


export default Register;
