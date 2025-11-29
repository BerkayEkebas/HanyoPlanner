import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, AuthError } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
    session: Session | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);
    const loginWithGoogle = async (): Promise<void> => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: "myapp://" },
            });

            if (error) throw error;

            if (data?.url) {
                // Expo Go veya Standalone app için tarayıcıyı aç
                const result = await WebBrowser.openAuthSessionAsync(data.url, "myapp://");
                console.log("WebBrowser result:", result);
            } else {
                console.warn("OAuth URL yok");
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };
    const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  setSession(data.session ?? null);
};

    return (
        <AuthContext.Provider value={{ session, loading, loginWithGoogle, loginWithEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
