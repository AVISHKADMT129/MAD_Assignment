import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from './src/store/store';
import { Button, Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { logout } from './src/store/authSlice';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/homeScreen';
import SignupScreen from './src/screens/signupScreen';
import LandingScreen from './src/screens/Landing';

const Stack = createStackNavigator();

function LogoutButton() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
            navigation.navigate('Landing' as never);
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

function WelcomeMessage() {
  const username = useSelector((state: RootState) => state.auth.username);

  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
    </View>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerLeft: () => <WelcomeMessage />, // Welcome message
              headerRight: () => <LogoutButton />, // Logout button
              headerTitle: '',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    marginLeft: 15,
    justifyContent: 'center',
    width: '100%',
  },
  welcomeText: {
    color: '#006989', 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  button: {
    backgroundColor: '#01A7C2', 
    padding: 8, 
    borderRadius: 8,
    marginRight: 10, 
    alignItems: 'center',
    width:"50%"
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});


export default App;
