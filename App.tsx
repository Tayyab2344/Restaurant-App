import React from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { View, Platform } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useStore } from './src/store/useStore';
import { AppLightTheme, AppDarkTheme } from './src/theme';
import { StatusBar } from 'expo-status-bar';

const App = () => {
  const loadMenu = useStore((state) => state.loadMenu);
  const darkMode = useStore((state) => state.settings.darkMode);

  React.useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const theme = darkMode ? AppDarkTheme : AppLightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar style={darkMode ? "light" : "dark"} backgroundColor={theme.colors.background} />
          <RootNavigator />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
