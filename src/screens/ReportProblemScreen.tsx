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
    Surface,
    TextInput,
    Button,
    IconButton,
    useTheme,
} from 'react-native-paper';

const problemCategories = [
    { id: 'order', label: 'Order Issue', icon: 'package-variant' },
    { id: 'payment', label: 'Payment Problem', icon: 'credit-card' },
    { id: 'delivery', label: 'Delivery Issue', icon: 'truck-delivery' },
    { id: 'app', label: 'App Bug', icon: 'bug' },
    { id: 'other', label: 'Other', icon: 'help-circle' },
];

export default function ReportProblemScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const theme = useTheme();

    const handleSubmit = () => {
        if (!selectedCategory) {
            Alert.alert('Error', 'Please select a problem category');
            return;
        }
        if (description.trim().length < 10) {
            Alert.alert('Error', 'Please provide more details about your problem');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                'Report Submitted',
                'Thank you for your feedback. We will look into this issue and get back to you soon.',
                [{
                    text: 'OK', onPress: () => {
                        setSelectedCategory(null);
                        setDescription('');
                    }
                }]
            );
        }, 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>What's the problem?</Text>
                <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Select a category and describe your issue</Text>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>CATEGORY</Text>
                <View style={styles.categoriesGrid}>
                    {problemCategories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryCard,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
                                selectedCategory === category.id && [styles.categoryCardSelected, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryContainer }],
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <IconButton
                                icon={category.icon}
                                size={28}
                                iconColor={selectedCategory === category.id ? theme.colors.primary : theme.colors.onSurfaceVariant}
                            />
                            <Text style={[
                                styles.categoryLabel,
                                { color: theme.colors.onSurfaceVariant },
                                selectedCategory === category.id && [styles.categoryLabelSelected, { color: theme.colors.primary }],
                            ]}>
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>DESCRIPTION</Text>
                <Surface style={[styles.inputCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <TextInput
                        placeholder="Describe your problem in detail..."
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        value={description}
                        onChangeText={setDescription}
                        mode="flat"
                        multiline
                        numberOfLines={6}
                        style={[styles.textInput, { backgroundColor: theme.colors.surface }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        textColor={theme.colors.onSurface}
                    />
                </Surface>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                    labelStyle={[styles.submitButtonLabel, { color: theme.colors.onPrimary }]}
                >
                    Submit Report
                </Button>
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
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
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
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    categoryCard: {
        width: '30%',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        margin: 5,
        borderWidth: 2,
        borderColor: '#EEE',
    },
    categoryCardSelected: {
        borderColor: '#F48222',
        backgroundColor: '#FFF4EB',
    },
    categoryLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    categoryLabelSelected: {
        color: '#F48222',
        fontWeight: '600',
    },
    inputCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EEE',
        overflow: 'hidden',
    },
    textInput: {
        backgroundColor: '#FFF',
        minHeight: 150,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    submitButton: {
        backgroundColor: '#F48222',
        borderRadius: 15,
        paddingVertical: 8,
        marginTop: 25,
    },
    submitButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
