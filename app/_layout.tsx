import { SplashScreen, Stack } from "expo-router";
import './global.css'
import { useEffect } from "react";
// import Auth from "@/providers/auth-provider";
// import { LanguageProvider } from "@/providers/language-provider";
export default function RootLayout() {
 useEffect(()=>{
  SplashScreen.hideAsync()
 }, [])

 return (
  <Stack>
    <Stack.Screen
    name="index"
    options={{
        headerShown: false,
        title: "Home"
    }}/>
    <Stack.Screen
    name="(auth)/login"
    options={{
        headerShown: true,
        title: 'Login'
    }} />
  </Stack>
 )
}
