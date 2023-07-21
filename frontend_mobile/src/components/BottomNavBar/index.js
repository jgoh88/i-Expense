import { View, Text, Pressable } from "react-native";
import { useTailwind } from "tailwind-rn";
import { MaterialIcons as Icon } from '@expo/vector-icons'; 

export default function BottomNavBar({navMenus}) {
    const tailwind = useTailwind()

    return (
        <View style={[tailwind('flex-row h-16'), {backgroundColor: '#1976d2'}]}>
            {navMenus.map(navMenu => {
                return (
                    <Pressable onPress={navMenu.onPress} key={navMenu.label} style={tailwind('flex-1')}>
                        <View style={tailwind('h-full w-full justify-center items-center')}>
                            <Icon name={navMenu.icon} size={24} color={"white"} />
                            <Text style={tailwind('capitalize text-xs text-white mt-1 font-bold')}>{navMenu.label}</Text>
                        </View>
                    </Pressable>
                )
            })}
        </View>
    )
}