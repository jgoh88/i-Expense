import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";

import { Text, View } from "react-native";
import BottomNavBar from "@/src/components/BottomNavBar";

export default function ApprovalMain() {
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
                <Text style={tailwind('text-lg font-medium')}>Welcome, {userHook.auth.user?.firstName} {userHook.auth.user?.lastName}, to approval main page</Text>
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