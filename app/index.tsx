import { Text, View } from "react-native";
import './global.css'
import { Link } from "expo-router";
export default function Index() {
  return (
    <View
      style={{
        alignItems:"center",
        justifyContent:"center",
        flex:1
      }}
    >
      <Text style ={{
          fontSize:20,
          color:"blue",
          fontWeight:"bold"
      }}>
        Welcome To ShegaReport
      </Text>
      <Link href="/(auth)/login" className="text-blue-500">
      Go to Login
      </Link>
      <Link href="/(auth)/signup" className="text-blue-500">
      Go to Signup
      </Link>
    </View>
   
  );
}
