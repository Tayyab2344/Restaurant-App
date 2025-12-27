import React, { useState, memo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const AuthScreen = memo(() => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = () => {
    // For now, just navigate to Menu
    navigation.replace('Menu');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/burger_hero.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Menu')}>
            <Text style={[styles.skipText, { color: theme.colors.onSurfaceVariant }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            Welcome to Foodie
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Order your favorites or discover something new.
          </Text>

          <View style={[styles.tabContainer, { backgroundColor: theme.dark ? theme.colors.elevation.level2 : '#E8E8E8' }]}>
            <TouchableOpacity
              style={[styles.tab, isLogin && [styles.activeTab, { backgroundColor: theme.colors.surface }]]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin ? [styles.activeTabText, { color: theme.colors.primary }] : { color: theme.colors.onSurfaceVariant }]}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && [styles.activeTab, { backgroundColor: theme.colors.surface }]]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin ? [styles.activeTabText, { color: theme.colors.primary }] : { color: theme.colors.onSurfaceVariant }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurface }]}>Email Address</Text>
            </View>
            <TextInput
              mode="outlined"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email-outline" color={theme.colors.onSurfaceVariant} />}
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              textColor={theme.colors.onSurface}
            />

            <View style={[styles.inputLabelContainer, { marginTop: 15 }]}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurface }]}>Password</Text>
            </View>
            <TextInput
              mode="outlined"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-outline" color={theme.colors.onSurfaceVariant} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color={theme.colors.onSurfaceVariant}
                />
              }
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              outlineStyle={[styles.inputOutline, { borderColor: theme.colors.outlineVariant }]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              textColor={theme.colors.onSurface}
            />

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <Button
              mode="contained"
              onPress={handleAuth}
              style={[styles.mainButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={[styles.mainButtonLabel, { color: theme.colors.onPrimary }]}
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
              <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>Or continue with</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                <IconButton icon="google" size={20} iconColor="#DB4437" />
                <Text style={[styles.socialButtonText, { color: theme.colors.onSurface }]}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                <IconButton icon="apple" size={20} iconColor={theme.colors.onSurface} />
                <Text style={[styles.socialButtonText, { color: theme.colors.onSurface }]}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={[styles.footerLink, { color: theme.colors.primary }]}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingTop: 30,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#998',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#F48222',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  inputLabelContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    height: 50,
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: '#E8E8E8',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#F48222',
    fontSize: 14,
    fontWeight: '500',
  },
  mainButton: {
    marginTop: 30,
    backgroundColor: '#F48222',
    borderRadius: 15,
    paddingVertical: 6,
  },
  mainButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    width: (width - 70) / 2,
    height: 55,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: -5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
  footerLink: {
    color: '#F48222',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
