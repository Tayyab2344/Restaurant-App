import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ name }: { name: string }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{name} Screen</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20, fontWeight: 'bold' },
});

export const ProfileScreen = () => <PlaceholderScreen name="Profile" />;
export const MenuScreen = () => <PlaceholderScreen name="Menu" />;
export const CartScreen = () => <PlaceholderScreen name="Cart" />;
export const CheckoutScreen = () => <PlaceholderScreen name="Checkout" />;
export const OrdersListScreen = () => <PlaceholderScreen name="Orders" />;
export const OrderDetailScreen = () => <PlaceholderScreen name="Order Detail" />;
