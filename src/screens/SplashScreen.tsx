import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const bottomFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.timing(bottomFadeAnim, {
                toValue: 1,
                duration: 800,
                delay: 1500,
                useNativeDriver: true,
            })
        ]).start();

        // Navigate after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('Auth');
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <LinearGradient
                colors={['#F48222', '#2D1400']}
                style={styles.gradient}
            >
                <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.iconCircle}>
                        <IconButton icon="silverware-fork-knife" size={60} iconColor="#F48222" />
                    </View>
                    <Text variant="displaySmall" style={styles.title}>Abbottabad Eats</Text>
                    <Text variant="titleMedium" style={styles.subtitle}>Premium Flavors. Delivered.</Text>
                </Animated.View>

                <Animated.View style={[styles.bottomContainer, { opacity: bottomFadeAnim }]}>
                    <Text style={styles.poweredBy}>Powered by</Text>
                    <Text style={styles.agencyName}>Nexus Digital</Text>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    title: {
        color: '#FFF',
        fontWeight: '900',
        letterSpacing: 1,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 5,
        fontWeight: '500',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    poweredBy: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    agencyName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        letterSpacing: 1,
    },
});

export default SplashScreen;
