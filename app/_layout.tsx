// app/_layout.tsx
import { AuthProvider, useAuth } from '@/providers/auth-providers';
import { LanguageProvider } from '@/providers/language-providers';
import { ThemeProvider } from '@/providers/theme-provider';
import { Stack } from 'expo-router';

import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

// component to handel routing based on user role
function RoutingHandler() {
  const {user, isLoading} = useAuth()

  if(isLoading){
    return(
      <View  style={{flex:1}}>
        <ActivityIndicator size="large"/>
      </View>
    )
  }

  // redirect user based on their role
  if(user) {
    if(user.role === 'technician'){
      return <Redirect href="/(technician)"/>
    }else{
      return <Redirect href ="/reports"/>
    }
  }
  // if no user is logged in show the auth screens
  return <Redirect href = "/(auth)/welcome"/>
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(technician)" options={{ headerShown: false }} />
          </Stack>
          {/* add the routing handle */}
          <RoutingHandler/>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>

    );
}
