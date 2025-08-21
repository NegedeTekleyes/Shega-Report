import { Text, View } from "react-native";

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
    </View>
  );
}
