import 'dotenv/config';

export default {
  expo: {
    name: "your-app-name",
    slug: "your-app-slug",
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    }
  }
};
