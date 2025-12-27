import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    Text,
    Switch,
    Surface,
    Divider,
    IconButton,
    TextInput,
    Button,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { AppTheme } from '../theme';

export default function SecurityScreen() {
    const { settings, updateSettings } = useStore();
    const theme = useTheme<AppTheme>();
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        Alert.alert('Success', 'Password changed successfully');
        setShowPasswordSection(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>AUTHENTICATION</Text>
                <Surface style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setShowPasswordSection(!showPasswordSection)}
                    >
                        <View style={styles.menuLeft}>
                            <IconButton icon="lock-outline" size={24} iconColor={theme.colors.primary} />
                            <Text style={[styles.menuTitle, { color: theme.colors.onSurface }]}>Change Password</Text>
                        </View>
                        <IconButton icon={showPasswordSection ? "chevron-up" : "chevron-down"} size={24} iconColor={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>

                    {showPasswordSection && (
                        <View style={[styles.passwordSection, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : '#FAFAFA' }]}>
                            <TextInput
                                label="Current Password"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                mode="outlined"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                                textColor={theme.colors.onSurface}
                            />
                            <TextInput
                                label="New Password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                mode="outlined"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                                textColor={theme.colors.onSurface}
                            />
                            <TextInput
                                label="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                mode="outlined"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                                textColor={theme.colors.onSurface}
                            />
                            <Button
                                mode="contained"
                                onPress={handleChangePassword}
                                style={[styles.changeButton, { backgroundColor: theme.colors.primary }]}
                                labelStyle={[styles.changeButtonLabel, { color: theme.colors.onPrimary }]}
                            >
                                Update Password
                            </Button>
                        </View>
                    )}

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                    <View style={styles.toggleItem}>
                        <View style={styles.toggleLeft}>
                            <IconButton icon="fingerprint" size={24} iconColor={theme.colors.primary} />
                            <View style={styles.toggleInfo}>
                                <Text style={[styles.menuTitle, { color: theme.colors.onSurface }]}>Biometric Login</Text>
                                <Text style={[styles.toggleDescription, { color: theme.colors.onSurfaceVariant }]}>Use fingerprint or face ID</Text>
                            </View>
                        </View>
                        <Switch
                            value={settings.biometricEnabled}
                            onValueChange={(value) => updateSettings({ biometricEnabled: value })}
                            color={theme.colors.primary}
                        />
                    </View>
                </Surface>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>SESSIONS</Text>
                <Surface style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <View style={styles.sessionItem}>
                        <View style={styles.sessionInfo}>
                            <Text style={[styles.sessionDevice, { color: theme.colors.onSurface }]}>Current Device</Text>
                            <Text style={[styles.sessionDetails, { color: theme.colors.onSurfaceVariant }]}>Active now</Text>
                        </View>
                        <View style={[styles.activeBadge, { backgroundColor: theme.colors.successContainer }]}>
                            <Text style={[styles.activeBadgeText, { color: theme.colors.success }]}>Active</Text>
                        </View>
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
        borderWidth: 1,
        borderColor: '#EEE',
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingRight: 5,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    divider: {
        backgroundColor: '#F0F0F0',
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingRight: 15,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    toggleInfo: {
        flex: 1,
    },
    toggleDescription: {
        fontSize: 12,
        color: '#999',
    },
    passwordSection: {
        padding: 15,
        backgroundColor: '#FAFAFA',
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    inputOutline: {
        borderRadius: 10,
        borderColor: '#EEE',
    },
    changeButton: {
        backgroundColor: '#F48222',
        borderRadius: 10,
        marginTop: 5,
    },
    changeButtonLabel: {
        fontWeight: 'bold',
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionDevice: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    sessionDetails: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    activeBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    activeBadgeText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '600',
    },
});
