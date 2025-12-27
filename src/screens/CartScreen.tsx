import React, { useState, useCallback, memo, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import {
    Text,
    IconButton,
    Button,
    Surface,
    Divider,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const CartItemCard = memo(({ item, onUpdateQuantity }: { item: any; onUpdateQuantity: (id: string, qty: number) => void }) => {
    const theme = useTheme();
    return (
        <Surface style={[styles.itemCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
            <Image source={{ uri: item.menuItem.image }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                    <Text variant="titleMedium" style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.menuItem.name}</Text>
                    <Text variant="titleMedium" style={[styles.itemPrice, { color: theme.colors.onSurface }]}>RS {item.menuItem.price}</Text>
                </View>
                <Text variant="bodySmall" style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant }]}>Extra cheese, no onions</Text>

                <View style={[styles.quantityControls, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : '#F8F8F8' }]}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                        <IconButton icon="minus" size={16} iconColor={theme.colors.onSurface} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, { color: theme.colors.onSurface }]}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={[styles.qtyBtn, styles.qtyPlusBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        <IconButton icon="plus" size={16} iconColor={theme.colors.onPrimary} />
                    </TouchableOpacity>
                </View>
            </View>
        </Surface>
    );
}, (prev, next) => prev.item.id === next.item.id && prev.item.quantity === next.item.quantity);

const CartScreen = memo(() => {
    // Atomic selectors for better performance
    const cart = useStore((state) => state.cart);
    const updateCartQuantity = useStore((state) => state.updateCartQuantity);
    const getCartTotal = useStore((state) => state.getCartTotal);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Theme
    const theme = useTheme();

    const deliveryFee = 50;
    const subtotal = useMemo(() => getCartTotal(), [getCartTotal, cart]);
    const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

    const handleCheckout = useCallback(() => {
        navigation.navigate('Checkout');
    }, [navigation]);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <CartItemCard item={item} onUpdateQuantity={updateCartQuantity} />
    ), [updateCartQuantity]);

    const ListHeader = useMemo(() => (
        <View style={styles.itemsSection} />
    ), []);

    const ListFooter = useMemo(() => (
        <View style={styles.billSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Bill Details</Text>
            <Surface style={[styles.billCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                <View style={styles.billRow}>
                    <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Subtotal</Text>
                    <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS {subtotal}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Delivery Fee</Text>
                    <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS {deliveryFee}</Text>
                </View>
                <Divider style={[styles.billDivider, { backgroundColor: theme.colors.outlineVariant }]} />
                <View style={styles.billRow}>
                    <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>Total</Text>
                    <Text style={[styles.totalValue, { color: theme.colors.primary }]}>RS {total}</Text>
                </View>
            </Surface>
        </View>
    ), [theme, subtotal, total, deliveryFee]);

    if (cart.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                <IconButton icon="cart-off" size={80} iconColor={theme.colors.onSurfaceDisabled} />
                <Text variant="headlineSmall" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>Your cart is empty</Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Menu')}
                    style={[styles.shopButton, { backgroundColor: theme.colors.primary }]}
                    buttonColor={theme.colors.primary}
                >
                    Browse Menu
                </Button>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={ListFooter}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
            />

            <View style={styles.footer}>
                <Surface style={[styles.checkoutBtn, { backgroundColor: theme.colors.primary }]} elevation={theme.dark ? 2 : 5}>
                    <TouchableOpacity style={styles.checkoutBtnLeft} disabled>
                        <Text style={[styles.checkoutTotalText, { color: theme.colors.onPrimary }]}>RS {total}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.checkoutBtnRight} onPress={handleCheckout}>
                        <Text style={[styles.checkoutText, { color: theme.colors.onPrimary }]}>Proceed to Checkout</Text>
                        <View style={[styles.arrowCircle, { backgroundColor: theme.colors.onPrimary }]}>
                            <IconButton icon="arrow-right" size={20} iconColor={theme.colors.primary} />
                        </View>
                    </TouchableOpacity>
                </Surface>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    itemsSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    itemCard: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#000',
    },
    itemDescription: {
        color: '#999',
        marginTop: 2,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginTop: 10,
        paddingHorizontal: 2,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyPlusBtn: {
        backgroundColor: '#F48222',
        borderRadius: 10,
    },
    qtyText: {
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    billSection: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    billCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    billLabel: {
        color: '#999',
        fontSize: 15,
    },
    billValue: {
        fontWeight: '700',
        color: '#000',
    },
    billDivider: {
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#F48222',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: 'transparent',
    },
    checkoutBtn: {
        backgroundColor: '#F48222',
        borderRadius: 25,
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    checkoutBtnLeft: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    checkoutTotalText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    checkoutBtnRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginRight: 10,
    },
    arrowCircle: {
        backgroundColor: '#FFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        marginTop: 10,
        marginBottom: 20,
    },
    shopButton: {
        borderRadius: 15,
        paddingHorizontal: 20,
    },
});

export default CartScreen;
