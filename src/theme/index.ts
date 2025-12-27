import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

export interface AppTheme extends MD3Theme {
    colors: MD3Theme['colors'] & {
        success: string;
        successContainer: string;
    };
}

export const AppLightTheme: AppTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#F48222',
        background: '#F8F8F8',
        surface: '#FFFFFF',
        onSurface: '#333333',
        onSurfaceVariant: '#999999',
        outlineVariant: '#EEEEEE',
        success: '#4CAF50',
        successContainer: '#E8F5E9',
        error: '#D32F2F',
        onPrimary: '#FFFFFF',
    },
};

export const AppDarkTheme: AppTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#F48222',
        background: '#121212',
        surface: '#1E1E1E',
        onSurface: '#E0E0E0',
        onSurfaceVariant: '#AAAAAA',
        outlineVariant: '#333333',
        success: '#66BB6A',
        successContainer: '#1B5E20',
        error: '#EF5350',
        onPrimary: '#FFFFFF',
    },
};
