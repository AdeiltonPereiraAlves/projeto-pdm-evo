import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Botao from '@/components/ui/Botao';
import RodapeLogin from '@/components/ui/RodapeLogin';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implementar lógica de login real
      // const res = await fetch("http://localhost:3000/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, senha }),
      // });
      
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = () => {
    // TODO: Navegar para tela de cadastro
    Alert.alert('Cadastro', 'Funcionalidade de cadastro em desenvolvimento');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header com Logo */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={Colors.gray[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={Colors.gray[400]}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Botão de Login */}
            <View style={styles.buttonContainer}>
              <Botao
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                fullWidth
                size="lg"
                variant="primary"
              />
            </View>

            {/* Link para Esqueci a Senha */}
            <View style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <RodapeLogin
              title="Não tem uma conta? "
              subtitle="Cadastre-se"
              onPress={handleCadastro}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['2xl'],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    backgroundColor: Colors.white,
    minHeight: 56,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: Typography.fontWeight.medium,
  },
  footer: {
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
});