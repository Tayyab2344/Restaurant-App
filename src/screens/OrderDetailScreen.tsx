import React, { useEffect, useRef, memo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import {
    Text,
    Surface,
    Divider,
    IconButton,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { AppTheme } from '../theme';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderStatus } from '../types';

const { width } = Dimensions.get('window');
const statusSteps: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];

const StepItem = memo(({ step, index, currentIndex, scaleAnim, opacityAnim, pulseAnim, lineAnim }: any) => {
    const theme = useTheme();
    return (
        <React.Fragment>
            <Animated.View
                style={[
                    styles.stepWrapper,
                    {
                        transform: [
                            { scale: index === currentIndex ? Animated.multiply(scaleAnim, pulseAnim) : scaleAnim }
                        ],
                        opacity: opacityAnim,
                    }
                ]}
            >
                <View style={[
                    styles.stepIcon,
                    index <= currentIndex ? [styles.stepIconActive, { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }] : [styles.stepIconInactive, { backgroundColor: theme.colors.surfaceDisabled, borderColor: theme.colors.outlineVariant }],
                    index === currentIndex && [styles.stepIconCurrent, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
                ]}>
                    <IconButton
                        icon={
                            index < currentIndex ? 'check' :
                                index === 0 ? 'check' :
                                    index === 1 ? 'silverware-fork-knife' :
                                        index === 2 ? 'chef-hat' :
                                            index === 3 ? 'package-variant-closed' : 'truck-delivery'
                        }
                        size={index === currentIndex ? 24 : 18}
                        iconColor={index <= currentIndex ? (index === currentIndex ? theme.colors.onPrimary : theme.colors.primary) : theme.colors.onSurfaceDisabled}
                        style={{ margin: 0 }}
                    />
                </View>
                <Text style={[
                    styles.stepLabel,
                    { color: theme.colors.onSurfaceVariant },
                    index === currentIndex && [styles.activeStepLabel, { color: theme.colors.onSurface }]
                ]}>
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                </Text>
            </Animated.View>
            {index < statusSteps.length - 1 && lineAnim && (
                <View style={styles.stepLineContainer}>
                    <View style={[styles.stepLine, styles.stepLineInactive, { backgroundColor: theme.colors.surfaceDisabled }]} />
                    <Animated.View
                        style={[
                            styles.stepLine,
                            styles.stepLineActive,
                            styles.stepLineOverlay,
                            {
                                backgroundColor: theme.colors.primary,
                                width: lineAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            }
                        ]}
                    />
                </View>
            )}
        </React.Fragment>
    );
}, (prev, next) => prev.currentIndex === next.currentIndex);

const OrderItemCard = memo(({ item, showDivider }: { item: any; showDivider: boolean }) => {
    const theme = useTheme();
    return (
        <View>
            <View style={styles.orderItem}>
                <View style={[styles.qtyBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text style={[styles.qtyText, { color: theme.colors.onSurfaceVariant }]}>{item.quantity}x</Text>
                </View>
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.menuItem.name}</Text>
                    <Text style={[styles.itemSubText, { color: theme.colors.onSurfaceVariant }]}>No onions, Extra cheese</Text>
                </View>
                <Text style={[styles.itemPrice, { color: theme.colors.onSurface }]}>RS {item.totalPrice}</Text>
            </View>
            {showDivider && <Divider style={[styles.itemDivider, { backgroundColor: theme.colors.outlineVariant }]} />}
        </View>
    );
}, (prev, next) => prev.item.id === next.item.id && prev.item.quantity === next.item.quantity && prev.showDivider === next.showDivider);

const OrderDetailScreen = memo(() => {
    const route = useRoute<RouteProp<RootStackParamList, 'OrderDetail'>>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;

    // Theme
    const theme = useTheme<AppTheme>();

    // Atomic selectors for better performance
    const orders = useStore((state) => state.orders);
    const order = orders.find((o) => o.orderId === orderId);

    // Animation values for each step
    const scaleAnims = useRef(statusSteps.map(() => new Animated.Value(1))).current;
    const opacityAnims = useRef(statusSteps.map(() => new Animated.Value(0.5))).current;
    const lineAnims = useRef(statusSteps.slice(0, -1).map(() => new Animated.Value(0))).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Animate on status change
    useEffect(() => {
        const currentIndex = statusSteps.indexOf(order?.status || 'PLACED');

        // Animate completed steps
        statusSteps.forEach((_, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            Animated.parallel([
                Animated.spring(scaleAnims[index], {
                    toValue: isCurrent ? 1.15 : 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnims[index], {
                    toValue: isActive ? 1 : 0.4,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        });

        // Animate progress lines
        lineAnims.forEach((lineAnim, index) => {
            Animated.timing(lineAnim, {
                toValue: index < currentIndex ? 1 : 0,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        });

        // Pulse animation for current step
        if (currentIndex < statusSteps.length - 1) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [order?.status]);

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PLACED': return 'Order placed';
            case 'ACCEPTED': return 'Order accepted';
            case 'PREPARING': return 'Preparing your order...';
            case 'READY': return 'Order ready';
            case 'COMPLETED': return 'Order delivered';
            default: return status;
        }
    };

    const renderStepper = () => {
        const currentIndex = statusSteps.indexOf(order?.status || 'PLACED');
        return (
            <View style={styles.stepperContainer}>
                {statusSteps.map((step, index) => (
                    <StepItem
                        key={step}
                        step={step}
                        index={index}
                        currentIndex={currentIndex}
                        scaleAnim={scaleAnims[index]}
                        opacityAnim={opacityAnims[index]}
                        pulseAnim={pulseAnim}
                        lineAnim={lineAnims[index]}
                    />
                ))}
            </View>
        );
    };

    if (!order) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.onSurface }}>Order not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: theme.colors.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Status Section */}
                <Surface style={[styles.statusCard, { backgroundColor: theme.colors.surface }]} elevation={0}>
                    <Text style={[styles.mainStatusText, { color: theme.colors.onSurface }]}>{getStatusText(order.status)}</Text>
                    <Text style={[styles.etaText, { color: theme.colors.primary }]}>Estimated arrival: 7:45 PM</Text>
                    {renderStepper()}
                </Surface>

                {/* Restaurant Info Card */}
                <Surface style={[styles.restaurantCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <View style={styles.restaurantInfo}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.restaurantName, { color: theme.colors.onSurface }]}>Burger Bistro</Text>
                            <Text style={[styles.restaurantAddress, { color: theme.colors.onSurfaceVariant }]}>Main Bazaar, Abbottabad</Text>
                            <View style={[styles.etaPill, { backgroundColor: theme.colors.primaryContainer }]}>
                                <IconButton icon="clock-outline" size={14} iconColor={theme.colors.primary} style={{ margin: 0 }} />
                                <Text style={[styles.etaPillText, { color: theme.colors.primary }]}>~25 min delivery</Text>
                            </View>
                        </View>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200' }}
                            style={styles.restaurantImage}
                        />
                    </View>
                    <TouchableOpacity style={[styles.callButton, { backgroundColor: theme.colors.primary }]}>
                        <IconButton icon="phone" size={20} iconColor={theme.colors.onPrimary} style={{ margin: 0 }} />
                        <Text style={[styles.callButtonText, { color: theme.colors.onPrimary }]}>Call Restaurant</Text>
                    </TouchableOpacity>
                </Surface>

                {/* Order Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Order Details</Text>
                    <Surface style={[styles.detailsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                        {order.items.map((item, index) => (
                            <OrderItemCard
                                key={item.id}
                                item={item}
                                showDivider={index < order.items.length - 1}
                            />
                        ))}
                    </Surface>
                </View>

                {/* Overall Billing */}
                <View style={styles.section}>
                    <Surface style={[styles.billingCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Subtotal</Text>
                            <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS {order.totalPrice}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Tax (10%)</Text>
                            <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS {(order.totalPrice * 0.1).toFixed(0)}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, { color: theme.colors.onSurfaceVariant }]}>Delivery Fee</Text>
                            <Text style={[styles.billValue, { color: theme.colors.onSurface }]}>RS 50</Text>
                        </View>
                        <Divider style={[styles.billDivider, { backgroundColor: theme.colors.outlineVariant }]} />
                        <View style={styles.billRow}>
                            <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>Total</Text>
                            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>RS {order.totalPrice + 50 + parseInt((order.totalPrice * 0.1).toFixed(0))}</Text>
                        </View>
                    </Surface>
                </View>

                {/* Feedback Button - Show only for completed orders without feedback */}
                {order.status === 'COMPLETED' && !order.feedback && (
                    <TouchableOpacity
                        style={[styles.feedbackButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => navigation.navigate('OrderFeedback', { orderId: order.orderId })}
                    >
                        <IconButton icon="star-outline" size={20} iconColor={theme.colors.onPrimary} style={{ margin: 0 }} />
                        <Text style={[styles.feedbackButtonText, { color: theme.colors.onPrimary }]}>Give Feedback</Text>
                    </TouchableOpacity>
                )}

                {/* Show feedback submitted message */}
                {order.feedback && (
                    <View style={[styles.feedbackSubmitted, { backgroundColor: theme.colors.successContainer }]}>
                        <IconButton icon="check-circle" size={20} iconColor={theme.colors.success} style={{ margin: 0 }} />
                        <Text style={[styles.feedbackSubmittedText, { color: theme.colors.success }]}>
                            Thanks for your {order.feedback.rating}-star rating!
                        </Text>
                    </View>
                )}

                {/* Footer Action */}
                <TouchableOpacity style={styles.reportIssue}>
                    <IconButton icon="help-circle-outline" size={20} iconColor={theme.colors.onSurfaceDisabled} />
                    <Text style={[styles.reportText, { color: theme.colors.onSurfaceVariant }]}>Report an issue</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
});

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
    scrollContent: {
        paddingBottom: 40,
    },
    statusCard: {
        backgroundColor: '#FFF',
        padding: 25,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    mainStatusText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    etaText: {
        color: '#F48222',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 25,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    stepWrapper: {
        alignItems: 'center',
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    stepIconActive: {
        backgroundColor: '#FFF4EB',
        borderColor: '#F48222',
    },
    stepIconCurrent: {
        transform: [{ scale: 1.2 }],
        elevation: 4,
        backgroundColor: '#F48222',
        borderColor: '#F48222',
    },
    stepIconInactive: {
        backgroundColor: '#F3F3F3',
        borderColor: '#EEE',
    },
    stepLine: {
        height: 3,
        zIndex: -1,
    },
    stepLineContainer: {
        flex: 1,
        marginHorizontal: -5,
        position: 'relative',
    },
    stepLineActive: {
        backgroundColor: '#F48222',
    },
    stepLineInactive: {
        backgroundColor: '#EEE',
        width: '100%',
    },
    stepLineOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    stepLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    activeStepLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    restaurantCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    restaurantInfo: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    restaurantAddress: {
        color: '#999',
        fontSize: 13,
        marginTop: 2,
    },
    etaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF4EB',
        borderRadius: 10,
        paddingRight: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    etaPillText: {
        color: '#FF8C29',
        fontSize: 12,
        fontWeight: 'bold',
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
    },
    callButton: {
        backgroundColor: '#F48222',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    callButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
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
    detailsCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
        paddingHorizontal: 15,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    qtyBox: {
        backgroundColor: '#F3F3F3',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    qtyText: {
        fontWeight: 'bold',
        color: '#333',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
    },
    itemSubText: {
        color: '#999',
        fontSize: 12,
        marginTop: 2,
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#333',
    },
    itemDivider: {
        backgroundColor: '#F8F8F8',
    },
    billingCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    billLabel: {
        color: '#999',
    },
    billValue: {
        fontWeight: '600',
        color: '#333',
    },
    billDivider: {
        marginVertical: 12,
        backgroundColor: '#F8F8F8',
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
    reportIssue: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    reportText: {
        color: '#999',
        fontWeight: '600',
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F48222',
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 15,
    },
    feedbackButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    feedbackSubmitted: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F5E9',
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 15,
    },
    feedbackSubmittedText: {
        color: '#4CAF50',
        fontWeight: '600',
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OrderDetailScreen;
