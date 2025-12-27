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
import { useStore } from '../store/useStore';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { memo } from 'react';

const StarRatingItem = memo(({ star, rating, onPress }: { star: number; rating: number; onPress: (star: number) => void }) => {
    const theme = useTheme();
    return (
        <TouchableOpacity onPress={() => onPress(star)}>
            <IconButton
                icon={star <= rating ? 'star' : 'star-outline'}
                size={40}
                iconColor={star <= rating ? '#FFB800' : theme.colors.outline}
            />
        </TouchableOpacity>
    );
}, (prev, next) => prev.rating === next.rating || (prev.star <= prev.rating && prev.star <= next.rating) || (prev.star > prev.rating && prev.star > next.rating));

export default function OrderFeedbackScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'OrderFeedback'>>();
    const navigation = useNavigation();
    const { orderId } = route.params;
    const { orders, submitOrderFeedback } = useStore();
    const order = orders.find((o) => o.orderId === orderId);
    const theme = useTheme();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!order) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.onSurface }}>Order not found</Text>
            </View>
        );
    }

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please rate your experience');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            submitOrderFeedback(orderId, { rating, comment });
            setIsSubmitting(false);
            Alert.alert(
                'Thank You!',
                'Your feedback helps us improve our service.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 1000);
    };

    const ratingLabels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.onSurface }]}>Rate Your Order</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Order #{orderId.slice(0, 8).toUpperCase()}</Text>
                </View>

                <Surface style={[styles.ratingCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <Text style={[styles.ratingPrompt, { color: theme.colors.onSurfaceVariant }]}>How was your experience?</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarRatingItem
                                key={star}
                                star={star}
                                rating={rating}
                                onPress={setRating}
                            />
                        ))}
                    </View>
                    {rating > 0 && (
                        <Text style={[styles.ratingLabel, { color: theme.colors.primary }]}>{ratingLabels[rating - 1]}</Text>
                    )}
                </Surface>

                <Text style={[styles.sectionHeader, { color: theme.colors.onSurfaceVariant }]}>ADDITIONAL COMMENTS</Text>
                <Surface style={[styles.inputCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]} elevation={0}>
                    <TextInput
                        placeholder="Tell us more about your experience (optional)"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        value={comment}
                        onChangeText={setComment}
                        mode="flat"
                        multiline
                        numberOfLines={5}
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
                    Submit Feedback
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
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
    },
    ratingCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    ratingPrompt: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    ratingLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F48222',
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        marginBottom: 10,
        marginTop: 20,
        letterSpacing: 0.5,
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
        minHeight: 120,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
