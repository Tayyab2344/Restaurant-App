import React, { useState, useEffect, memo } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {
    TextInput,
    Button,
    Avatar,
    Text,
    Surface,
    IconButton,
    Divider,
    Switch,
    useTheme,
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

const ProfileScreen = memo(() => {
    // Atomic selectors for better performance
    const profile = useStore((state) => state.profile);
    const updateProfile = useStore((state) => state.updateProfile);
    const darkMode = useStore((state) => state.settings.darkMode);
    const updateSettings = useStore((state) => state.updateSettings);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Theme
    const theme = useTheme();

    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const [address, setAddress] = useState(profile.address);
    const [email, setEmail] = useState(profile.email);

    useEffect(() => {
        setName(profile.name);
        setPhone(profile.phone);
        setAddress(profile.address);
        setEmail(profile.email);
    }, [profile]);

    const handleSave = () => {
        updateProfile({ name, phone, address, email });
    };

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            <Avatar.Image
                                size={120}
                                source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'User'}` }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
                                <IconButton icon="camera" size={18} iconColor={theme.colors.onPrimary} />
                            </TouchableOpacity>
                        </View>
                        <Text variant="headlineSmall" style={[styles.userName, { color: theme.colors.onSurface }]}>{name}</Text>
                        <Text variant="bodyMedium" style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>{email}</Text>
                    </View>
                </Surface>

                <View style={styles.formSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Personal Information</Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            placeholder="Your Name"
                            style={[styles.input, { backgroundColor: theme.colors.surface }]}
                            outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                            textColor={theme.colors.onSurface}
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            left={<TextInput.Icon icon="account-outline" color={theme.colors.primary} />}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>Email Address</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            placeholder="Email"
                            style={[styles.input, { backgroundColor: theme.colors.surface }]}
                            outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                            textColor={theme.colors.onSurface}
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            keyboardType="email-address"
                            left={<TextInput.Icon icon="email-outline" color={theme.colors.primary} />}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>Phone Number</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            mode="outlined"
                            placeholder="+92 XXX XXXXXXX"
                            style={[styles.input, { backgroundColor: theme.colors.surface }]}
                            outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                            textColor={theme.colors.onSurface}
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            keyboardType="phone-pad"
                            left={<TextInput.Icon icon="phone-outline" color={theme.colors.primary} />}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>Delivery Address</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            mode="outlined"
                            placeholder="Your Address"
                            style={[styles.input, { height: 100, backgroundColor: theme.colors.surface }]}
                            outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
                            textColor={theme.colors.onSurface}
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            multiline
                            numberOfLines={3}
                            left={<TextInput.Icon icon="map-marker-outline" color={theme.colors.primary} />}
                        />
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                        labelStyle={[styles.saveButtonLabel, { color: theme.colors.onPrimary }]}
                    >
                        Save Changes
                    </Button>
                </View>

                <View style={styles.actionSection}>
                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

                    <View style={styles.darkModeItem}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="theme-light-dark" size={24} iconColor={theme.colors.onSurfaceVariant} />
                            <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={(value) => updateSettings({ darkMode: value })}
                            color={theme.colors.primary}
                        />
                    </View>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('OrdersList')}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="clipboard-text-outline" size={24} iconColor={theme.colors.onSurfaceVariant} />
                            <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>My Orders</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor={theme.colors.onSurfaceDisabled} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Notifications')}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="bell-outline" size={24} iconColor={theme.colors.onSurfaceVariant} />
                            <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>Notifications</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor={theme.colors.onSurfaceDisabled} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Security')}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="shield-check-outline" size={24} iconColor={theme.colors.onSurfaceVariant} />
                            <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>Security</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor={theme.colors.onSurfaceDisabled} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('HelpCenter')}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="help-circle-outline" size={24} iconColor={theme.colors.onSurfaceVariant} />
                            <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>Help Center</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor={theme.colors.onSurfaceDisabled} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('ReportProblem')}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="alert-circle-outline" size={24} iconColor={theme.colors.onSurfaceVariant} />
                            <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>Report a Problem</Text>
                        </View>
                        <IconButton icon="chevron-right" size={24} iconColor={theme.colors.onSurfaceDisabled} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionItem, styles.logoutItem]} onPress={handleLogout}>
                        <View style={styles.actionLeft}>
                            <IconButton icon="logout" size={24} iconColor={theme.colors.error} />
                            <Text style={[styles.actionText, styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#F8F8F8',
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#000',
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        backgroundColor: '#FFF',
        borderWidth: 4,
        borderColor: '#FFF',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F48222',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    userName: {
        fontWeight: 'bold',
        color: '#000',
    },
    userEmail: {
        color: '#999',
        marginTop: 5,
    },
    formSection: {
        padding: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
    },
    inputOutline: {
        borderRadius: 15,
        borderColor: '#EEE',
    },
    saveButton: {
        backgroundColor: '#F48222',
        borderRadius: 15,
        paddingVertical: 8,
        marginTop: 10,
    },
    saveButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    actionSection: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    divider: {
        backgroundColor: '#EEE',
        marginBottom: 20,
    },
    actionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    darkModeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingRight: 10,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
        fontWeight: '500',
    },
    logoutItem: {
        marginTop: 10,
    },
    logoutText: {
        color: '#FF4B4B',
    },
});
export default ProfileScreen;
