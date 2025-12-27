import React, { memo } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersListScreen from '../screens/OrdersListScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import ReportProblemScreen from '../screens/ReportProblemScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import OrderFeedbackScreen from '../screens/OrderFeedbackScreen';

import AuthScreen from '../screens/AuthScreen';
import SplashScreen from '../screens/SplashScreen';
import DishDetailScreen from '../screens/DishDetailScreen';
import { RootStackParamList } from './types';
import { IconButton, useTheme } from 'react-native-paper';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = memo(() => {
    const theme = useTheme();

    const navigationTheme = React.useMemo(() => ({
        dark: theme.dark,
        colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.onSurface,
            border: theme.colors.outlineVariant,
            notification: theme.colors.error,
        },
        fonts: DefaultTheme.fonts,
    }), [theme]);

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator id="root" initialRouteName="Splash" screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: theme.colors.surface },
                headerTintColor: theme.colors.onSurface,
                cardStyle: { backgroundColor: theme.colors.background },
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
            }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile', headerShown: true, headerTitleAlign: 'center' }} />
                <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart', headerShown: true, headerTitleAlign: 'center' }} />
                <Stack.Screen
                    name="Checkout"
                    component={CheckoutScreen}
                    options={({ navigation }: any) => ({
                        title: 'Checkout',
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <IconButton
                                icon="arrow-left"
                                onPress={() => navigation.navigate('Cart')}
                                size={24}
                                iconColor={theme.colors.onSurface}
                            />
                        ),
                    })}
                />
                <Stack.Screen
                    name="OrdersList"
                    component={OrdersListScreen}
                    options={({ navigation }: any) => ({
                        title: 'My Orders',
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <IconButton
                                icon="arrow-left"
                                onPress={() => navigation.navigate('Menu')}
                                size={24}
                                iconColor={theme.colors.onSurface}
                            />
                        ),
                    })}
                />
                <Stack.Screen
                    name="OrderDetail"
                    component={OrderDetailScreen}
                    options={({ navigation }: any) => ({
                        title: 'Order Details',
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <IconButton
                                icon="arrow-left"
                                onPress={() => navigation.navigate('Menu')}
                                size={24}
                                iconColor={theme.colors.onSurface}
                            />
                        ),
                    })}
                />
                <Stack.Screen name="MenuItemDetail" component={DishDetailScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications', headerShown: true, headerTitleAlign: 'center' }} />
                <Stack.Screen name="Security" component={SecurityScreen} options={{ title: 'Security', headerShown: true, headerTitleAlign: 'center' }} />
                <Stack.Screen name="ReportProblem" component={ReportProblemScreen} options={{ title: 'Report a Problem', headerShown: true, headerTitleAlign: 'center' }} />
                <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: 'Help Center', headerShown: true, headerTitleAlign: 'center' }} />
                <Stack.Screen name="OrderFeedback" component={OrderFeedbackScreen} options={{ title: 'Feedback', headerShown: true, headerTitleAlign: 'center' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
});

export default RootNavigator;

