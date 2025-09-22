import { useAuth } from "@/providers/auth-providers";
import { Redirect, Stack } from "expo-router";


export default function TechnicianLayout() {
    const {user} = useAuth()

    // protect technicial routes onlt technician can access
    if(user?.role !== 'technician'){
        return <Redirect href="/(auth)/welcome"/>
    }
    return(
        <Stack>
            <Stack.Screen name="index" options={{title: 'Technician Home'}}/>

        </Stack>
    )
}