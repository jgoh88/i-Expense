import { useState } from "react";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";

import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import { FlatList, Pressable, Text, View } from "react-native";
import ExpenseItemCard from "../../components/ExpenseItemCard";
import BottomNavBar from "@/src/components/BottomNavBar";

export default function ExpenseView() {
    const route = useRoute()
    const userHook = useUserHook()
    const [expense, setExpense] = useState(route.params.expense)
    const tailwind = useTailwind()
    const navigation = useNavigation()

    function onPressBackHandler() {
        navigation.goBack()
    }

    function onPressEditExpenseHandler() {
        navigation.navigate('ExpenseEdit', { 
            expense: expense
        })
    }

    return (
        <>
            <View style={[tailwind('h-16 flex-row'), {backgroundColor: '#1976d2'}]}>
                <Pressable onPress={onPressBackHandler}>
                    <View style={tailwind('flex-1 justify-center items-start pl-4')}>
                        <Icon name="arrow-back-ios" size={32} color="white" />
                    </View>
                </Pressable>
                <View style={tailwind('w-3/4 justify-center items-center')}>
                    <Text style={tailwind('text-xl text-white font-bold')}>{expense.title}</Text>
                </View>
                <View style={tailwind('flex-1 justify-center items-end pr-4')}>
                </View>
            </View>
            <View style={tailwind('flex-1 justify-center items-center my-1 mt-2')}>
                <FlatList 
                    data={expense.expenseItems}
                    keyExtractor={(item, idx) => item._id}
                    renderItem={({item}) => (
                        <ExpenseItemCard data={item} readOnly={true}/>
                    )}
                    style={tailwind('w-full')}
                />
            </View>
            <BottomNavBar 
                navMenus={[
                    {label: 'edit expense', icon: 'edit', onPress: onPressEditExpenseHandler,},
                ]}
            />
        </>
    )
}