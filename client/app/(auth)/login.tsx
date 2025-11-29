import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert 
} from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { loginWithGoogle, loginWithEmail, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Email ve şifre boş olamaz");
      return;
    }

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      Alert.alert("Giriş Hatası", (err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Giriş Yap</Text>

      {/* Email / Password */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Şifre"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleEmailLogin}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Yükleniyor..." : "Giriş Yap"}
        </Text>
      </TouchableOpacity>

      {/* Google Login */}
      <TouchableOpacity
        onPress={loginWithGoogle}
        disabled={loading}
        style={[styles.googleButton, loading && styles.buttonDisabled]}
      >
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.buttonText}>
          Google ile Giriş Yap
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Supabase + Expo ile Email/Password + Google OAuth örnek
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
