import React, { useState, memo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import {
    Text,
    Button,
    Surface,
    IconButton,
    Divider,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const CheckoutItemCard = memo(({ item, showDivider }: { item: any; showDivider: boolean }) => {
    const theme = useTheme();
    return (
        <View>
            <View style={styles.summaryItem}>
                <Image source={{ uri: item.menuItem.image }} style={styles.itemImageSmall} />
                <View style={styles.itemInfoSmall}>
                    <Text style={[styles.itemNameSmall, { color: theme.colors.onSurface }]}>{item.menuItem.name}</Text>
                    <Text style={[styles.itemDetailSmall, { color: theme.colors.onSurfaceVariant }]}>{item.quantity}x items • RS {item.menuItem.price}</Text>
                </View>
                <Text style={[styles.itemPriceSmall, { color: theme.colors.onSurface }]}>RS {item.menuItem.price * item.quantity}</Text>
            </View>
            {showDivider && <Divider style={[styles.dividerSmall, { backgroundColor: theme.colors.outlineVariant }]} />}
        </View>
    );
}, (prev, next) => prev.item.id === next.item.id && prev.item.quantity === next.item.quantity && prev.showDivider === next.showDivider);

const PaymentMethodItem = memo(({ item, isSelected, onPress }: { item: any; isSelected: boolean; onPress: () => void }) => {
    const theme = useTheme();
    return (
        <TouchableOpacity
            key={item.id}
            onPress={onPress}
            style={[
                styles.paymentOption,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.outlineVariant
                }
            ]}
        >
            <View style={styles.paymentIconBox}>
                <IconButton icon={item.icon} size={24} iconColor={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant} />
            </View>
            <View style={styles.paymentInfo}>
                <Text style={[styles.paymentName, { color: theme.colors.onSurface }]}>{item.name}</Text>
                <Text style={[styles.paymentDetail, { color: theme.colors.onSurfaceVariant }]}>{item.detail}</Text>
            </View>
            <View style={[styles.radio, { borderColor: isSelected ? theme.colors.primary : theme.colors.outlineVariant }]}>
                {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
            </View>
        </TouchableOpacity>
    );
}, (prev, next) => prev.isSelected === next.isSelected);

const CheckoutScreen = memo(() => {
    // Atomic selectors for better performance
    const profile = useStore((state) => state.profile);
    const cart = useStore((state) => state.cart);
    const getCartTotal = useStore((state) => state.getCartTotal);
    const placeOrder = useStore((state) => state.placeOrder);
    const startOrderProgressionTimer = useStore((state) => state.startOrderProgressionTimer);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedPayment, setSelectedPayment] = useState<'COD' | 'Easypaisa' | 'JazzCash' | 'BankTransfer'>('COD');
    const theme = useTheme();

    const deliveryFee = 50;
    const subtotal = React.useMemo(() => getCartTotal(), [getCartTotal, cart]);
    const total = React.useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

    const handlePlaceOrder = useCallback(() => {
        const order = placeOrder(selectedPayment);
        // Start background timer for order status progression
        startOrderProgressionTimer(order.orderId);
        navigation.navigate('OrderDetail', { orderId: order.orderId });
    }, [placeOrder, selectedPayment, startOrderProgressionTimer, navigation]);

    const paymentMethods = [
        { id: 'COD', name: 'Cash on Delivery', detail: 'Pay when you receive', icon: 'cash' },
        { id: 'Easypaisa', name: 'Easypaisa', detail: 'Pay via Easypaisa App', icon: 'wallet' },
        { id: 'JazzCash', name: 'JazzCash', detail: 'Pay via JazzCash App', icon: 'cellphone-nfc' },
        { id: 'BankTransfer', name: 'Bank Transfer', detail: 'Transfer to our bank account', icon: 'bank' },
    ] as const;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Delivery Details */}
                <View style={[styles.section, { marginTop: 10 }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Delivery Details</Text>
                    <Surface style={[styles.deliveryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                        <View style={styles.mapContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=600&auto=format&fit=crop' }}
                                style={styles.mapImage}
                            />
                            <View style={[styles.mapPin, { backgroundColor: theme.colors.primary }]}>
                                <IconButton icon="map-marker" size={24} iconColor={theme.colors.onPrimary} />
                            </View>
                        </View>

                        <View style={styles.detailRows}>
                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>NAME</Text>
                                    <Surface style={[styles.detailInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                                        <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{profile.name || 'ALI Ahmed'}</Text>
                                    </Surface>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>PHONE</Text>
                                    <Surface style={[styles.detailInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                                        <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{profile.phone || '+92 300 1234567'}</Text>
                                    </Surface>
                                </View>
                            </View>

                            <View style={styles.addressContainer}>
                                <View style={styles.addressHeader}>
                                    <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>ADDRESS</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                        <Text style={[styles.changeText, { color: theme.colors.primary }]}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                <Surface style={[styles.detailInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                                    <View style={styles.addressValueRow}>
                                        <IconButton icon="home" size={20} iconColor={theme.colors.onSurfaceVariant} style={{ margin: 0, padding: 0 }} />
                                        <Text style={[styles.detailValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
                                            {profile.address || 'Main Bazaar, Abbottabad, Pakistan'}
                                        </Text>
                                    </View>
                                </Surface>
                            </View>
                        </View>
                    </Surface>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Order Summary</Text>
                    <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                        {cart.map((item, index) => (
                            <CheckoutItemCard
                                key={item.id}
                                item={item}
                                showDivider={index < cart.length - 1}
                            />
                        ))}

                        <View style={[styles.billingTable, { borderTopColor: theme.colors.outlineVariant }]}>
                            <View style={styles.billRow}>
                                <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Subtotal</Text>
                                <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS {subtotal}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Delivery Fee</Text>
                                <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS {deliveryFee}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Tax</Text>
                                <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS 0.00</Text>
                            </View>
                            <Divider style={[styles.billDivider, { backgroundColor: theme.colors.outlineVariant }]} />
                            <View style={styles.billRow}>
                                <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>Total</Text>
                                <Text style={[styles.totalValue, { color: theme.colors.primary }]}>RS {total}</Text>
                            </View>
                        </View>
                    </Surface>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Payment Method</Text>
                    {paymentMethods.map((method) => (
                        <PaymentMethodItem
                            key={method.id}
                            item={method}
                            isSelected={selectedPayment === method.id}
                            onPress={() => setSelectedPayment(method.id as any)}
                        />
                    ))}
                </View>
            </ScrollView>

            <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={theme.dark ? 2 : 5}>
                <View style={styles.footerInfo}>
                    <Text style={[styles.totalToPayLabel, { color: theme.colors.onSurfaceVariant }]}>Total to pay</Text>
                    <Text style={[styles.totalToPayValue, { color: theme.colors.onSurface }]}>RS {total}</Text>
                </View>
                <Button
                    mode="contained"
                    style={[styles.placeOrderBtn, { backgroundColor: theme.colors.primary }]}
                    contentStyle={styles.placeOrderBtnContent}
                    labelStyle={[styles.placeOrderBtnLabel, { color: theme.colors.onPrimary }]}
                    onPress={handlePlaceOrder}
                >
                    Place Order
                </Button>
            </Surface>
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
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    deliveryCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
    },
    mapContainer: {
        height: 120,
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    mapPin: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -20,
        marginLeft: -20,
        backgroundColor: '#F48222',
        borderRadius: 20,
        elevation: 4,
    },
    detailRows: {
        padding: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailItem: {
        width: '48%',
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 5,
    },
    detailInput: {
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
    },
    detailValue: {
        fontWeight: '600',
        color: '#333',
    },
    addressContainer: {
        marginTop: 5,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    changeText: {
        color: '#F48222',
        fontWeight: 'bold',
        fontSize: 12,
    },
    addressValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryCard: {
        borderRadius: 20,
        padding: 15,
        borderWidth: 1,
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    itemImageSmall: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    itemInfoSmall: {
        flex: 1,
        marginLeft: 15,
    },
    itemNameSmall: {
        fontWeight: 'bold',
        color: '#333',
    },
    itemDetailSmall: {
        color: '#999',
        fontSize: 12,
    },
    itemPriceSmall: {
        fontWeight: 'bold',
        color: '#333',
    },
    dividerSmall: {
    },
    billingTable: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    billLabel: {
        color: '#999',
        fontSize: 14,
    },
    billValue: {
        fontWeight: '600',
        color: '#333',
    },
    billDivider: {
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F48222',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
    },
    activePaymentOption: {
        borderColor: '#F48222',
        backgroundColor: '#FFF4EB',
    },
    paymentIconBox: {
        borderRadius: 12,
        marginRight: 15,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentName: {
        fontWeight: 'bold',
        color: '#333',
    },
    paymentDetail: {
        color: '#999',
        fontSize: 11,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        marginRight: 10,
    },
    radioActive: {
        borderColor: '#F48222',
        borderWidth: 6,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerInfo: {
        flex: 1,
    },
    totalToPayLabel: {
        color: '#999',
        fontSize: 12,
    },
    totalToPayValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    placeOrderBtn: {
        backgroundColor: '#F48222',
        borderRadius: 15,
        minWidth: 180,
    },
    placeOrderBtnContent: {
        height: 55,
    },
    placeOrderBtnLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default CheckoutScreen;
