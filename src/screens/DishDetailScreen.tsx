import React, { useState, memo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import {
    Text,
    Button,
    IconButton,
    Surface,
    useTheme,
    Divider,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import { AppTheme } from '../theme';

const { width } = Dimensions.get('window');

type DishDetailRouteProp = RouteProp<RootStackParamList, 'MenuItemDetail'>;

const DishDetailScreen = memo(() => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<DishDetailRouteProp>();

    // Atomic selectors for better performance
    const menu = useStore((state) => state.menu);
    const addToCart = useStore((state) => state.addToCart);
    const theme = useTheme<AppTheme>();

    const item = menu.find((m) => m.id === route.params.itemId);
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    const handleAddToCart = useCallback(() => {
        if (!item) return;
        // Calculate total including addons (mock logic for now)
        const addonTotal = selectedAddons.length * 150; // Mock price per addon
        addToCart(item, quantity); // Note: Store needs update to handle addons, pushing base item for now
        navigation.goBack();
    }, [item, quantity, selectedAddons, addToCart, navigation]);

    const toggleAddon = (addon: string) => {
        if (selectedAddons.includes(addon)) {
            setSelectedAddons(selectedAddons.filter(a => a !== addon));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    const addons = [
        { name: 'Extra Cheese Slice', price: 150 },
        { name: 'Double Patty', price: 400 },
        { name: 'Spicy Sauce on side', price: 0 },
    ];

    if (!item) {
        return (
            <View style={styles.errorContainer}>
                <Text>Item not found</Text>
                <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.goBack()}
                        >
                            <IconButton icon="arrow-left" size={24} iconColor="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.rightIcons}>
                            <TouchableOpacity style={styles.iconButton}>
                                <IconButton icon="heart-outline" size={24} iconColor="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconButton, { marginLeft: 10 }]}>
                                <IconButton icon="cart-outline" size={24} iconColor="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={[styles.detailsSection, { backgroundColor: theme.colors.surface }]}>
                    <Text variant="displaySmall" style={[styles.itemName, { color: theme.colors.onSurface }]}>
                        {item.name}
                    </Text>

                    <View style={styles.priceRow}>
                        <Text style={[styles.priceText, { color: theme.colors.primary }]}>RS {item.price}</Text>
                        <View style={[styles.availableBadge, { backgroundColor: theme.colors.successContainer }]}>
                            <IconButton icon="check-circle" size={16} iconColor={theme.colors.success} style={styles.checkIcon} />
                            <Text style={[styles.availableText, { color: theme.colors.success }]}>Available</Text>
                        </View>
                    </View>

                    <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                        {item.description || "Our signature beef burger is crafted with a juicy, perfectly seasoned beef patty for ultimate flavor and tenderness. Topped with fresh, crisp lettuce, ripe tomatoes, and tangy pickles, all nestled within a toasted sesame seed bun."}
                    </Text>

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                    <View style={styles.addonSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Addons</Text>
                        {addons.map((addon) => (
                            <TouchableOpacity
                                key={addon.name}
                                style={styles.addonRow}
                                onPress={() => toggleAddon(addon.name)}
                            >
                                <Surface
                                    style={[
                                        styles.checkbox,
                                        { borderColor: theme.colors.outlineVariant },
                                        selectedAddons.includes(addon.name) && [styles.checkboxChecked, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
                                    ]}
                                    elevation={0}
                                >
                                    {selectedAddons.includes(addon.name) && <IconButton icon="check" size={14} iconColor="#FFF" />}
                                </Surface>
                                <Text style={[styles.addonName, { color: theme.colors.onSurface }]}>{addon.name}</Text>
                                <Text style={[styles.addonPrice, { color: theme.colors.onSurfaceVariant }]}>+RS {addon.price}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <Surface style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]} elevation={theme.dark ? 1 : 4}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={[styles.qtyBtn, { backgroundColor: theme.colors.surfaceVariant }]}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <IconButton icon="minus" size={20} iconColor={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyLabel, { color: theme.colors.onSurface }]}>{quantity}</Text>
                    <TouchableOpacity
                        style={[styles.qtyBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <IconButton icon="plus" size={20} iconColor={theme.colors.onPrimary} />
                    </TouchableOpacity>
                </View>
                <Button
                    mode="contained"
                    onPress={handleAddToCart}
                    style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
                    contentStyle={styles.addBtnContent}
                    labelStyle={[styles.addBtnLabel, { color: theme.colors.onPrimary }]}
                >
                    Add to Cart
                </Button>
            </Surface>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        height: 400,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerButtons: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    rightIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 25,
    },
    detailsSection: {
        marginTop: -30,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        flex: 1,
    },
    itemName: {
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F48222',
    },
    availableBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingRight: 12,
        borderRadius: 10,
    },
    checkIcon: {
        margin: 0,
    },
    availableText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
        marginBottom: 25,
    },
    divider: {
        height: 1,
        marginBottom: 25,
    },
    addonSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    addonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    checkboxChecked: {
        backgroundColor: '#F48222',
        borderColor: '#F48222',
    },
    addonName: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    addonPrice: {
        color: '#999',
        fontWeight: '500',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    qtyBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F3F3',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
        color: '#333',
    },
    addBtn: {
        flex: 1,
        backgroundColor: '#F48222',
        borderRadius: 15,
    },
    addBtnContent: {
        height: 55,
    },
    addBtnLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DishDetailScreen;
