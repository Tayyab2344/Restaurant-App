import React, { useState, useCallback, memo, useMemo } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import {
    Text,
    IconButton,
    Surface,
    Divider,
    ProgressBar,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { AppTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Order } from '../types';

const { width } = Dimensions.get('window');

// Memoized Active Order Card
const ActiveOrderCard = memo(({ item, onTrack }: { item: Order; onTrack: () => void }) => {
    const theme = useTheme<AppTheme>();
    return (
        <Surface style={[styles.currentOrderCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={styles.currentOrderHeader}>
                <View>
                    <View style={[styles.inProgressBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.primary }]}>IN PROGRESS</Text>
                    </View>
                    <Text style={[styles.restaurantName, { color: theme.colors.onSurface }]}>Foodie's Best</Text>
                    <Text style={[styles.itemCountText, { color: theme.colors.onSurfaceVariant }]}>{item.items.length} items • RS {item.totalPrice}</Text>
                </View>
                <Image
                    source={{ uri: item.items[0]?.menuItem.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200' }}
                    style={styles.currentOrderImage}
                />
            </View>

            <View style={[styles.trackingSection, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : '#F8F8F8' }]}>
                <View style={styles.trackingStatusRow}>
                    <Text style={[styles.arrivingText, { color: theme.colors.onSurface }]}>Arriving in 15 mins</Text>
                    <Text style={[styles.onTheWayText, { color: theme.colors.primary }]}>On the way</Text>
                </View>
                <ProgressBar progress={0.6} color={theme.colors.primary} style={styles.progressBar} />
            </View>

            <View style={styles.currentOrderActions}>
                <TouchableOpacity style={[styles.trackOrderBtn, { backgroundColor: theme.colors.primary }]} onPress={onTrack}>
                    <IconButton icon="map-marker" size={18} iconColor={theme.colors.onPrimary} style={{ margin: 0 }} />
                    <Text style={[styles.trackOrderBtnText, { color: theme.colors.onPrimary }]}>Track Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.callBtn, { borderColor: theme.colors.outlineVariant }]}>
                    <IconButton icon="phone" size={20} iconColor={theme.colors.onSurface} />
                </TouchableOpacity>
            </View>
        </Surface>
    );
}, (prev, next) => prev.item.orderId === next.item.orderId && prev.item.status === next.item.status);

// Memoized History Order Card
const HistoryOrderCard = memo(({ item }: { item: Order }) => {
    const theme = useTheme<AppTheme>();
    return (
        <Surface style={[styles.historyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
            <View style={styles.historyHeader}>
                <Image
                    source={{ uri: item.items[0]?.menuItem.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200' }}
                    style={styles.historyImage}
                />
                <View style={styles.historyInfo}>
                    <View style={styles.historyTopRow}>
                        <Text style={[styles.historyTitle, { color: theme.colors.onSurface }]}>Foodie's Kitchen</Text>
                        <Text style={[styles.historyDate, { color: theme.colors.onSurfaceVariant }]}>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    </View>
                    <Text style={[styles.historyItems, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {item.items.map(i => i.menuItem.name).join(', ')}
                    </Text>
                    <View style={styles.historyBottomRow}>
                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'CANCELLED' ? theme.colors.errorContainer : theme.colors.successContainer }]}>
                            <Text style={[styles.statusBadgeText, { color: item.status === 'CANCELLED' ? theme.colors.error : theme.colors.success }]}>
                                {item.status}
                            </Text>
                        </View>
                        <Text style={[styles.historyPrice, { color: theme.colors.onSurface }]}>RS {item.totalPrice}</Text>
                    </View>
                </View>
            </View>

            <Divider style={[styles.historyDivider, { backgroundColor: theme.colors.outlineVariant }]} />

            <View style={styles.historyActions}>
                <View style={styles.paymentMethodRow}>
                    <IconButton icon={item.paymentType === 'Digital' ? 'credit-card' : 'cash'} size={18} iconColor={theme.colors.onSurfaceVariant} style={{ margin: 0 }} />
                    <Text style={[styles.paymentText, { color: theme.colors.onSurfaceVariant }]}>{item.paymentType === 'Digital' ? 'Paid Online' : 'Cash'}</Text>
                </View>
                <TouchableOpacity style={styles.actionLinkRow}>
                    <IconButton icon="reload" size={18} iconColor={theme.colors.primary} style={{ margin: 0 }} />
                    <Text style={[styles.actionLinkText, { color: theme.colors.primary }]}>Reorder</Text>
                </TouchableOpacity>
            </View>
        </Surface>
    );
}, (prev, next) => prev.item.orderId === next.item.orderId);

const OrdersListScreen = memo(() => {
    // Atomic selector - only subscribe to orders
    const orders = useStore((state) => state.orders);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');

    // Theme
    const theme = useTheme<AppTheme>();

    // Memoize filtered lists
    const activeOrders = useMemo(() =>
        orders.filter(o => ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status)),
        [orders]
    );

    const historyOrders = useMemo(() =>
        orders.filter(o => ['COMPLETED', 'CANCELLED'].includes(o.status)),
        [orders]
    );

    const handleTrackOrder = useCallback((orderId: string) => {
        navigation.navigate('OrderDetail', { orderId });
    }, [navigation]);

    const renderCurrentOrder = useCallback(({ item }: { item: Order }) => (
        <ActiveOrderCard item={item} onTrack={() => handleTrackOrder(item.orderId)} />
    ), [handleTrackOrder]);

    const renderHistoryItem = useCallback(({ item }: { item: Order }) => (
        <HistoryOrderCard item={item} />
    ), []);

    const keyExtractor = useCallback((item: Order) => item.orderId, []);

    const ListHeader = useMemo(() => (
        <View style={styles.listHeader}>
            <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    {activeTab === 'Active' ? 'Current Order' : 'Past Orders'}
                </Text>
                {activeTab === 'History' && (
                    <TouchableOpacity>
                        <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    ), [activeTab, theme]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            {/* Premium Tab Bar */}
            <View style={[styles.tabBarContainer, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.tabBar, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : '#F3F3F3' }]}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Active' && [styles.activeTab, { backgroundColor: theme.colors.surface }]]}
                        onPress={() => setActiveTab('Active')}
                    >
                        <Text style={[styles.tabText, { color: theme.colors.onSurfaceVariant }, activeTab === 'Active' && [styles.activeTabText, { color: theme.colors.onSurface }]]}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'History' && [styles.activeTab, { backgroundColor: theme.colors.surface }]]}
                        onPress={() => setActiveTab('History')}
                    >
                        <Text style={[styles.tabText, { color: theme.colors.onSurfaceVariant }, activeTab === 'History' && [styles.activeTabText, { color: theme.colors.onSurface }]]}>History</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={activeTab === 'Active' ? activeOrders : historyOrders}
                renderItem={activeTab === 'Active' ? renderCurrentOrder : renderHistoryItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <IconButton icon="package-variant" size={80} iconColor={theme.colors.onSurfaceDisabled} />
                        <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>No orders here yet</Text>
                    </View>
                }
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
            />
        </View>
    );
});

export default OrdersListScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#FFF',
        paddingBottom: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    tabBarContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F3F3F3',
        borderRadius: 15,
        padding: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: '#FFF',
        elevation: 2,
    },
    tabText: {
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#000',
    },
    listContent: {
        paddingBottom: 40,
    },
    listHeader: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        color: '#F48222',
        fontWeight: 'bold',
    },
    currentOrderCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 20,
    },
    currentOrderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inProgressBadge: {
        backgroundColor: '#FFF4EB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    badgeText: {
        color: '#F48222',
        fontSize: 10,
        fontWeight: 'bold',
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCountText: {
        color: '#666',
        marginTop: 2,
    },
    currentOrderImage: {
        width: 70,
        height: 70,
        borderRadius: 15,
    },
    trackingSection: {
        marginTop: 20,
    },
    trackingStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    arrivingText: {
        fontWeight: '600',
        color: '#333',
    },
    onTheWayText: {
        color: '#F48222',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F3F3F3',
    },
    currentOrderActions: {
        flexDirection: 'row',
        marginTop: 25,
    },
    trackOrderBtn: {
        flex: 1,
        backgroundColor: '#F48222',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
    },
    trackOrderBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    callBtn: {
        backgroundColor: '#F3F3F3',
        width: 55,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    historyCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    historyHeader: {
        flexDirection: 'row',
    },
    historyImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },
    historyInfo: {
        flex: 1,
        marginLeft: 15,
    },
    historyTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    historyDate: {
        fontSize: 12,
        color: '#999',
    },
    historyItems: {
        color: '#666',
        fontSize: 13,
        marginTop: 2,
    },
    historyBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    historyPrice: {
        fontWeight: 'bold',
        color: '#333',
    },
    historyDivider: {
        marginVertical: 12,
        backgroundColor: '#F8F8F8',
    },
    historyActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentMethodRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentText: {
        fontSize: 12,
        color: '#666',
    },
    actionLinkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionLinkText: {
        color: '#F48222',
        fontWeight: 'bold',
        fontSize: 13,
    },
    emptyContainer: {
        padding: 80,
        alignItems: 'center',
    },
    emptyText: {
        color: '#CCC',
        marginTop: 10,
    },
});
