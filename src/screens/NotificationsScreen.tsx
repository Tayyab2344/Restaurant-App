import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
    Text,
    Switch,
    Surface,
    Divider,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';

export default function NotificationsScreen() {
    const { settings, updateSettings } = useStore();
    const theme = useTheme();

    const toggleItems = [
        {
            key: 'notificationsEnabled',
            title: 'Push Notifications',
            description: 'Receive push notifications on your device',
            value: settings.notificationsEnabled,
        },
        {
            key: 'orderUpdates',
            title: 'Order Updates',
            description: 'Get notified about your order status changes',
            value: settings.orderUpdates,
        },
        {
            key: 'promotions',
            title: 'Promotions & Offers',
            description: 'Receive notifications about deals and discounts',
            value: settings.promotions,
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>NOTIFICATION PREFERENCES</Text>
                <Surface style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    {toggleItems.map((item, index) => (
                        <View key={item.key}>
                            <View style={styles.toggleItem}>
                                <View style={styles.toggleInfo}>
                                    <Text style={[styles.toggleTitle, { color: theme.colors.onSurface }]}>{item.title}</Text>
                                    <Text style={[styles.toggleDescription, { color: theme.colors.onSurfaceVariant }]}>{item.description}</Text>
                                </View>
                                <Switch
                                    value={item.value}
                                    onValueChange={(value) => updateSettings({ [item.key]: value })}
                                    color={theme.colors.primary}
                                />
                            </View>
                            {index < toggleItems.length - 1 && <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />}
                        </View>
                    ))}
                </Surface>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>EMAIL NOTIFICATIONS</Text>
                <Surface style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <View style={styles.toggleItem}>
                        <View style={styles.toggleInfo}>
                            <Text style={[styles.toggleTitle, { color: theme.colors.onSurface }]}>Weekly Newsletter</Text>
                            <Text style={[styles.toggleDescription, { color: theme.colors.onSurfaceVariant }]}>Get weekly updates about new menu items</Text>
                        </View>
                        <Switch value={false} onValueChange={() => { }} color={theme.colors.primary} />
                    </View>
                </Surface>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    scrollContent: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        marginBottom: 10,
        marginTop: 10,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 5,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    toggleInfo: {
        flex: 1,
        marginRight: 15,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    toggleDescription: {
        fontSize: 13,
        color: '#999',
        marginTop: 3,
    },
    divider: {
        backgroundColor: '#F0F0F0',
        marginHorizontal: 15,
    },
});
