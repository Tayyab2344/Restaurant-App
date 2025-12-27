import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import {
    Text,
    Surface,
    IconButton,
    Divider,
    useTheme,
} from 'react-native-paper';

const faqItems = [
    {
        question: 'How do I track my order?',
        answer: 'Go to "My Orders" from your profile and tap on any order to see real-time tracking updates.',
    },
    {
        question: 'What payment methods are accepted?',
        answer: 'We accept Cash on Delivery (COD), Easypaisa, JazzCash, and Bank Transfer.',
    },
    {
        question: 'How can I cancel my order?',
        answer: 'You can cancel your order within 2 minutes of placing it. After that, please contact support.',
    },
    {
        question: 'What is the delivery time?',
        answer: 'Average delivery time is 25-40 minutes depending on your location and order size.',
    },
    {
        question: 'How do I update my address?',
        answer: 'Go to Profile, edit your delivery address, and save changes.',
    },
];

export default function HelpCenterScreen() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const theme = useTheme();

    const handleContact = (type: string) => {
        if (type === 'phone') {
            Linking.openURL('tel:+923001234567');
        } else if (type === 'email') {
            Linking.openURL('mailto:support@restaurant.pk');
        } else if (type === 'whatsapp') {
            Linking.openURL('https://wa.me/923001234567');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>How can we help?</Text>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>FREQUENTLY ASKED QUESTIONS</Text>
                <Surface style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    {faqItems.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.faqItem}
                                onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                                <Text style={[styles.faqQuestion, { color: theme.colors.onSurface }]}>{item.question}</Text>
                                <IconButton
                                    icon={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    iconColor={theme.colors.onSurfaceVariant}
                                />
                            </TouchableOpacity>
                            {expandedIndex === index && (
                                <View style={[styles.faqAnswer, { backgroundColor: theme.dark ? theme.colors.elevation.level1 : '#FAFAFA' }]}>
                                    <Text style={[styles.faqAnswerText, { color: theme.colors.onSurfaceVariant }]}>{item.answer}</Text>
                                </View>
                            )}
                            {index < faqItems.length - 1 && <Divider style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />}
                        </View>
                    ))}
                </Surface>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>CONTACT US</Text>
                <View style={styles.contactGrid}>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} onPress={() => handleContact('phone')}>
                        <IconButton icon="phone" size={28} iconColor={theme.colors.primary} />
                        <Text style={[styles.contactLabel, { color: theme.colors.onSurface }]}>Call Us</Text>
                        <Text style={[styles.contactDetail, { color: theme.colors.onSurfaceVariant }]}>+92 300 1234567</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} onPress={() => handleContact('email')}>
                        <IconButton icon="email" size={28} iconColor={theme.colors.primary} />
                        <Text style={[styles.contactLabel, { color: theme.colors.onSurface }]}>Email</Text>
                        <Text style={[styles.contactDetail, { color: theme.colors.onSurfaceVariant }]}>support@app.pk</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} onPress={() => handleContact('whatsapp')}>
                        <IconButton icon="whatsapp" size={28} iconColor="#25D366" />
                        <Text style={[styles.contactLabel, { color: theme.colors.onSurface }]}>WhatsApp</Text>
                        <Text style={[styles.contactDetail, { color: theme.colors.onSurfaceVariant }]}>Chat with us</Text>
                    </TouchableOpacity>
                </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
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
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingLeft: 15,
        paddingRight: 5,
    },
    faqQuestion: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    faqAnswer: {
        backgroundColor: '#FAFAFA',
        padding: 15,
        paddingTop: 0,
    },
    faqAnswerText: {
        color: '#666',
        lineHeight: 20,
    },
    divider: {
        backgroundColor: '#F0F0F0',
    },
    contactGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 5,
    },
    contactDetail: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
        textAlign: 'center',
    },
});
