import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const token = await SecureStore.getItemAsync("userToken");
    setHasToken(!!token);
    setIsReady(true);
  }

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";

    if (!hasToken && !inAuthGroup) {
      // Si pas de token et pas dans login, on redirige vers login
      router.replace("/login" as any);
    } else if (hasToken && inAuthGroup) {
      // Si on a un token et on est sur les pages auth, on va sur les tabs
      router.replace("/(tabs)" as const);
    }
  }, [hasToken, isReady, router, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
