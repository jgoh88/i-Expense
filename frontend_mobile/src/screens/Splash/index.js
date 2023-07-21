import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

export default function Splash() {
    const tailwind = useTailwind()
    return (
        <View style={tailwind('flex-1 justify-center items-center')}>
            <Text>Loading</Text>
        </View>
    )
}