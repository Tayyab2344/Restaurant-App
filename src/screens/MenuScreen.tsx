import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native';
import {
    Text,
    Searchbar,
    IconButton,
    Surface,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { AppTheme } from '../theme';
import { MenuItem } from '../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
const allCategories = ['All', 'Fast Food', 'Desi Special', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'];

// Memoized menu item card component
const MenuItemCard = memo(({ item, onPress, onAddToCart }: {
    item: MenuItem;
    onPress: () => void;
    onAddToCart: () => void;
}) => {
    const theme = useTheme<AppTheme>();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}
        >
            <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.name}</Text>
                <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.colors.onSurface }]}>RS {item.price}</Text>
            </View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                    onPress={onAddToCart}
                >
                    <IconButton icon="plus" size={20} iconColor={theme.colors.onPrimary} style={{ margin: 0 }} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => prevProps.item.id === nextProps.item.id);

const MenuScreen = memo(() => {
    // Atomic selectors - only subscribe to specific parts of state
    const menu = useStore((state) => state.menu);
    const loadMenu = useStore((state) => state.loadMenu);
    const addToCart = useStore((state) => state.addToCart);
    const cart = useStore((state) => state.cart);
    const getCartTotal = useStore((state) => state.getCartTotal);

    // Theme
    const theme = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadMenu();
    }, []);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = getCartTotal();

    const filteredMenu = React.useMemo(() => menu.filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }), [menu, selectedCategory, searchQuery]);

    // Grouping for SectionList
    const categoriesToShow = selectedCategory === 'All'
        ? allCategories.filter(c => c !== 'All')
        : [selectedCategory];

    const sections = React.useMemo(() => categoriesToShow.map(cat => ({
        title: cat,
        data: filteredMenu.filter(item => item.category === cat)
    })).filter(section => section.data.length > 0), [categoriesToShow, filteredMenu]);

    // Memoized callbacks
    const handleNavigateToItem = useCallback((itemId: string) => {
        navigation.navigate('MenuItemDetail', { itemId });
    }, [navigation]);

    const handleAddToCart = useCallback((item: MenuItem) => {
        addToCart(item, 1);
    }, [addToCart]);

    const renderItem = useCallback(({ item }: { item: MenuItem }) => (
        <MenuItemCard
            item={item}
            onPress={() => handleNavigateToItem(item.id)}
            onAddToCart={() => handleAddToCart(item)}
        />
    ), [handleNavigateToItem, handleAddToCart]);

    const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{title}</Text>
        </View>
    ), [theme]);

    const keyExtractor = useCallback((item: MenuItem) => item.id, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <IconButton
                    icon="account-circle-outline"
                    size={28}
                    onPress={() => navigation.navigate('Profile')}
                    iconColor={theme.colors.onSurface}
                    style={styles.headerIcon}
                />
                <View style={styles.headerTitleContainer}>
                    <Text variant="titleLarge" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Abbottabad Eats</Text>
                </View>
                <View style={styles.headerRight}>
                    <IconButton
                        icon="clipboard-text-outline"
                        size={26}
                        onPress={() => navigation.navigate('OrdersList')}
                        iconColor={theme.colors.onSurface}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cart')}
                        style={styles.cartIconContainer}
                    >
                        <IconButton icon="cart-outline" size={26} iconColor={theme.colors.onSurface} style={{ margin: 0 }} />
                        {cartCount > 0 && <View style={[styles.headerBadge, { backgroundColor: theme.colors.primary }]} />}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                <Searchbar
                    placeholder="Search for dishes..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={[styles.searchBar, { backgroundColor: theme.dark ? theme.colors.elevation.level2 : '#F3F3F3' }]}
                    inputStyle={[styles.searchInput, { color: theme.colors.onSurface }]}
                    iconColor={theme.colors.onSurfaceVariant}
                    placeholderTextColor={theme.colors.onSurfaceVariant}
                    elevation={0}
                />
            </View>

            {/* Categories */}
            <View style={[styles.categoriesContainer, { backgroundColor: theme.colors.surface }]}>
                <SectionList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    sections={[{ data: allCategories }]}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item)}
                            style={[
                                styles.categoryChip,
                                { backgroundColor: selectedCategory === item ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.outlineVariant },
                            ]}
                        >
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === item ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.categoriesContent}
                />
            </View>

            {/* Menu List - Optimized */}
            <SectionList
                sections={sections}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
                updateCellsBatchingPeriod={50}
            />

            {/* Floating Cart Bar */}
            {cartCount > 0 && (
                <View style={styles.bottomBarContainer}>
                    <TouchableOpacity
                        style={[styles.bottomBar, { backgroundColor: theme.colors.primary, elevation: theme.dark ? 2 : 5 }]}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <View style={styles.itemsBadge}>
                            <Text style={styles.itemsBadgeText}>{cartCount}</Text>
                        </View>
                        <Text style={styles.itemsText}>items</Text>

                        <Text style={styles.viewCartText}>View Cart</Text>

                        <Text style={styles.totalText}>RS {cartTotal}</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#000',
    },
    headerIcon: {
        width: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartIconContainer: {
        marginLeft: -5,
    },
    headerBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F48222',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    searchBar: {
        backgroundColor: '#F3F3F3',
        borderRadius: 15,
        height: 50,
    },
    searchInput: {
        fontSize: 15,
    },
    categoriesContainer: {
        paddingBottom: 15,
    },
    categoriesContent: {
        paddingHorizontal: 15,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    selectedCategoryChip: {
        backgroundColor: '#F48222',
        borderColor: '#F48222',
    },
    categoryText: {
        fontWeight: 'bold',
        color: '#666',
    },
    selectedCategoryText: {
        color: '#FFF',
    },
    listContent: {
        paddingBottom: 120,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    card: {
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    itemInfo: {
        flex: 1,
        paddingRight: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    itemDescription: {
        color: '#999',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    imageContainer: {
        position: 'relative',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    addButton: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#F48222',
        borderRadius: 12,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    bottomBarContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    bottomBar: {
        backgroundColor: '#F48222',
        borderRadius: 20,
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    itemsBadge: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    itemsBadgeText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    itemsText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
    viewCartText: {
        flex: 1,
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    totalText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
export default MenuScreen;
