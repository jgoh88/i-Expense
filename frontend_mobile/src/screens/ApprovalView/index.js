import { useState } from "react";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";
import axiosBackend from '@/src/configs/axiosBackend';

import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import { FlatList, Pressable, Text, View } from "react-native";
import Toast from 'react-native-toast-message';
import ExpenseItemCard from "../../components/ExpenseItemCard";
import BottomNavBar from "@/src/components/BottomNavBar";

export default function ApprovalView() {
    const route = useRoute()
    const userHook = useUserHook()
    const [pendingExpense, setPendingExpense] = useState(route.params.expense)
    const tailwind = useTailwind()
    const navigation = useNavigation()

    function onPressBackHandler() {
        navigation.goBack()
    }

    async function onPressRejectExpenseHandler() {
        try {
            await axiosBackend.put('/expense', {
                    id: pendingExpense._id,
                    data: {status: 'rejected'}
                },
                {
                    headers: {
                        authorization: `Bearer ${userHook.auth.token}`
                }
            })
            Toast.show({
                type: 'success',
                text1: 'Expense rejected',
            })
            setTimeout(() => navigation.goBack(), 1500)
        } catch (err) {
            console.log(err)
            if (err.response.status === 401 && err.response.message === 'Invalid token') {
                userHook.signOut()
            }
        }
    }

    async function onPressApproveExpenseHandler() {
        try {
            await axiosBackend.put('/expense', {
                    id: pendingExpense._id,
                    data: {status: 'approved'}
                },
                {
                    headers: {
                        authorization: `Bearer ${userHook.auth.token}`
                }
            })
            Toast.show({
                type: 'success',
                text1: 'Expense approved',
            })
            setTimeout(() => navigation.goBack(), 1500)
        } catch (err) {
            console.log(err)
            if (err.response.status === 401 && err.response.message === 'Invalid token') {
                userHook.signOut()
            }
        }
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
                    <Text style={tailwind('text-xl text-white font-bold')}>{pendingExpense.title}</Text>
                </View>
                <View style={tailwind('flex-1 justify-center items-end pr-4')}>
                </View>
            </View>
            <View style={tailwind('z-10')}>
                <Toast 
                    visibilityTime={1000}
                    topOffset={20}
                />
            </View>
            <View style={tailwind('flex-1 justify-center items-center my-1 mt-2')}>
                <FlatList 
                    data={pendingExpense.expenseItems}
                    keyExtractor={(item, idx) => item._id}
                    renderItem={({item}) => (
                        <ExpenseItemCard data={item} readOnly={true}/>
                    )}
                    style={tailwind('w-full')}
                />
            </View>
            <BottomNavBar 
                navMenus={[
                    {label: 'reject', icon: 'cancel', onPress: onPressRejectExpenseHandler,},
                    {label: 'approve', icon: 'check-circle', onPress: onPressApproveExpenseHandler,},
                ]}
            />
        </>
    )
}