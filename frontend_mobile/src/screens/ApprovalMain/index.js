import { useState, useCallback } from 'react';
import { useUserHook } from "@/src/hooks/useUserHook";
import { useTailwind } from "tailwind-rn";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axiosBackend from '@/src/configs/axiosBackend';

import { Text, View, TouchableOpacity } from "react-native";
import BottomNavBar from "@/src/components/BottomNavBar";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import ExpenseCard from '../../components/ExpenseCard';
import { MaterialIcons as Icon } from '@expo/vector-icons'; 

export default function ApprovalMain() {
    const [pendingExpenses, setPendingExpenses] = useState([])
    const [pendingExpensesUpdated, setPendingExpensesUpdated] = useState(false)
    const userHook = useUserHook()
    const tailwind = useTailwind()
    const navigation = useNavigation()

    useFocusEffect(useCallback(() => {
        fetchExpenses()
        if (pendingExpensesUpdated) {
            setPendingExpensesUpdated(false)
        }
    }, [pendingExpensesUpdated]))

    async function fetchExpenses() {
        try {
            const res = await axiosBackend.get('/expense/approval', {
                headers: {
                    authorization: `Bearer ${userHook.auth.token}`
                }
            })
            setPendingExpenses(res.data.expenses)
        } catch (err) {
            console.log(err.response)
            if (err.response.status === 401 && err.response.message === 'Invalid token') {
                userHook.signOut()
            }
        }
    }

    function onPressExpenseHandler() {
        navigation.navigate('ExpenseMain')
    }

    function onPressApprovalHandler() {
        navigation.navigate('ApprovalMain')
    }

    function onPressEditExpenseHandler(expense, rowMap) {
        rowMap[expense._id].closeRow()
        navigation.navigate('ExpenseEdit', { 
            expense: expense
        })
    }

    async function onPressDeleteExpenseHandler(expense) {
        try {
            await axiosBackend.delete('/expense', {
                data: {id: expense._id},
                headers: {
                    authorization: `Bearer ${userHook.auth.token}`
                }
            })
            onExpenseUpdatesHandler()
        } catch (err) {
            console.log(err.response)
            if (err.response.status === 401 && err.response.message === 'Invalid token') {
                userHook.signOut()
            }
        }
    }

    function HiddenItems({onEdit, onDelete}) {
        return (
            <View style={[tailwind('flex-1 flex-row items-center pl-4 mt-2 rounded-md justify-end mx-3'), {backgroundColor: '#DDD'}]}>
                <TouchableOpacity 
                    onPress={onEdit} 
                    style={[tailwind('h-full justify-center items-center rounded-l-md'), {backgroundColor: '#1976d2', width: 70}]}
                >
                    <Icon name="edit" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onDelete}
                    style={[tailwind('h-full justify-center items-center rounded-r-md'), {backgroundColor: '#d32f2f', width: 70}]}
                >
                    <Icon name="delete" size={24} color="white" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <View style={[tailwind('h-16 justify-center'), {backgroundColor: '#1976d2'}]}>
                <View style={tailwind('justify-center items-center')}>
                    <Text style={tailwind('text-xl text-white font-bold')}>Pending My Approval</Text>
                </View>
            </View>
            <View style={tailwind('flex-1 justify-center items-center my-1 mt-2')}>
                <SwipeListView 
                    data={pendingExpenses}
                    keyExtractor={(item, idx) => item._id}
                    renderItem={({item}, rowMap) => (
                        <SwipeRow
                            rightOpenValue={-140}
                            disableRightSwipe
                        >
                            <HiddenItems 
                                data={item}
                                onEdit={() => onPressEditExpenseHandler(item, rowMap)}
                                onDelete={() => onPressDeleteExpenseHandler(item)}
                            />
                            <ExpenseCard data={item} />
                        </SwipeRow>
                    )}
                    style={tailwind('w-full')}
                />
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