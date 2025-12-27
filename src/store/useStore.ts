import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, MenuItem, CartItem, Order, OrderStatus, Settings, OrderFeedback } from '../types';
import menuData from '../data/menu.json';
import uuid from 'react-native-uuid';

interface AppState {
    // Profile
    profile: Profile;
    updateProfile: (profile: Profile) => void;

    // Settings
    settings: Settings;
    updateSettings: (settings: Partial<Settings>) => void;

    // Menu
    menu: MenuItem[];
    loadMenu: () => void;

    // Cart
    cart: CartItem[];
    addToCart: (item: MenuItem, quantity: number) => void;
    removeFromCart: (cartItemId: string) => void;
    updateCartQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;

    // Orders
    orders: Order[];
    placeOrder: (paymentType: 'COD' | 'Easypaisa' | 'JazzCash' | 'BankTransfer' | 'Digital') => Order;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    startOrderProgressionTimer: (orderId: string) => void;
    submitOrderFeedback: (orderId: string, feedback: Omit<OrderFeedback, 'submittedAt'>) => void;
}

// Store active timers outside of zustand state to prevent serialization issues
const activeTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
const statusSteps: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];

const initialProfile: Profile = {
    name: 'ALI Ahmed',
    phone: '+92 300 1234567',
    address: 'Abbottabad, Pakistan',
    email: 'ali.ahmed@gmail.com',
};

const initialSettings: Settings = {
    darkMode: false,
    notificationsEnabled: true,
    orderUpdates: true,
    promotions: true,
    biometricEnabled: false,
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            profile: initialProfile,
            updateProfile: (profile) => set({ profile }),

            settings: initialSettings,
            updateSettings: (newSettings) => set({ settings: { ...get().settings, ...newSettings } }),

            menu: [],
            loadMenu: () => {
                // Simple mock load, could be an API call
                set({ menu: menuData as MenuItem[] });
            },

            cart: [],
            addToCart: (menuItem, quantity) => {
                const cart = get().cart;
                const existingItem = cart.find((item) => item.menuItem.id === menuItem.id);

                if (existingItem) {
                    const updatedCart = cart.map((item) =>
                        item.menuItem.id === menuItem.id
                            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * menuItem.price }
                            : item
                    );
                    set({ cart: updatedCart });
                } else {
                    set({
                        cart: [
                            ...cart,
                            {
                                id: menuItem.id, // using menuItem.id for simplicity here
                                menuItem,
                                quantity,
                                totalPrice: menuItem.price * quantity,
                            },
                        ],
                    });
                }
            },
            removeFromCart: (cartItemId) => {
                set({ cart: get().cart.filter((item) => item.id !== cartItemId) });
            },
            updateCartQuantity: (cartItemId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(cartItemId);
                    return;
                }
                const updatedCart = get().cart.map((item) =>
                    item.id === cartItemId ? { ...item, quantity, totalPrice: quantity * item.menuItem.price } : item
                );
                set({ cart: updatedCart });
            },
            clearCart: () => set({ cart: [] }),
            getCartTotal: () => get().cart.reduce((sum, item) => sum + item.totalPrice, 0),

            orders: [],
            placeOrder: (paymentType) => {
                const { profile, cart, getCartTotal } = get();
                const newOrder: Order = {
                    orderId: uuid.v4() as string,
                    customerName: profile.name,
                    phone: profile.phone,
                    address: profile.address,
                    items: [...cart],
                    totalPrice: getCartTotal(),
                    paymentType,
                    status: 'PLACED',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set({
                    orders: [newOrder, ...get().orders],
                    cart: [],
                });
                return newOrder;
            },
            updateOrderStatus: (orderId, status) => {
                set({
                    orders: get().orders.map((order) =>
                        order.orderId === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
                    ),
                });
            },
            startOrderProgressionTimer: (orderId) => {
                // Clear any existing timer for this order
                if (activeTimers.has(orderId)) {
                    clearTimeout(activeTimers.get(orderId));
                }

                const progressOrder = () => {
                    const order = get().orders.find((o) => o.orderId === orderId);
                    if (!order || order.status === 'COMPLETED' || order.status === 'CANCELLED') {
                        activeTimers.delete(orderId);
                        return;
                    }

                    const currentIndex = statusSteps.indexOf(order.status);
                    if (currentIndex >= 0 && currentIndex < statusSteps.length - 1) {
                        get().updateOrderStatus(orderId, statusSteps[currentIndex + 1]);
                        // Schedule next progression
                        const timer = setTimeout(progressOrder, 3000);
                        activeTimers.set(orderId, timer);
                    } else {
                        activeTimers.delete(orderId);
                    }
                };

                // Start the first timer
                const timer = setTimeout(progressOrder, 3000);
                activeTimers.set(orderId, timer);
            },
            submitOrderFeedback: (orderId, feedback) => {
                set({
                    orders: get().orders.map((order) =>
                        order.orderId === orderId
                            ? {
                                ...order,
                                feedback: {
                                    ...feedback,
                                    submittedAt: new Date().toISOString(),
                                },
                            }
                            : order
                    ),
                });
            },
        }),
        {
            name: 'restaurant-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
