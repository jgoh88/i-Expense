import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";

import { Image, Pressable, Text, View } from "react-native";
import BottomNavBar from "@/src/components/BottomNavBar";

export default function Home() {
    const userHook = useUserHook()
    const tailwind = useTailwind()
    const navigation = useNavigation()

    function onPressExpenseHandler() {
        navigation.navigate('ExpenseMain')
    }

    function onPressApprovalHandler() {
        navigation.navigate('ApprovalMain')
    }

    return (
        <>
            <View style={tailwind('flex-1 justify-center items-center')}>
                <Pressable onPress={userHook.signOut}>
                    <Image source={require('@/svgs/logo.png')} style={{width: 170, height: 55,}} />
                </Pressable>
                <Text style={tailwind('text-lg font-medium mt-3')}>Welcome, {userHook.auth.user?.firstName} {userHook.auth.user?.lastName}</Text>
            </View>
            <BottomNavBar 
                navMenus={[
                    {label: 'expense', icon: 'receipt-long', onPress: onPressExpenseHandler,},
                    {label: 'approvals', icon: 'approval', onPress: onPressApprovalHandler,},
                ]}
            />
        </>
    )
}