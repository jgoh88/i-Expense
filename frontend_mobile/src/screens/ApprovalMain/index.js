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

    function onExpenseUpdatesHandler() {
        setPendingExpensesUpdated(true)
    }

    function onPressExpenseHandler() {
        navigation.navigate('ExpenseMain')
    }

    function onPressApprovalHandler() {
        navigation.navigate('ApprovalMain')
    }

    async function onPressRejectExpenseHandler(expense, rowMap) {
        try {
            await axiosBackend.put('/expense', {
                    id: expense._id,
                    data: {status: 'rejected'}
                },
                {
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

    async function onPressApproveExpenseHandler(expense) {
        try {
            await axiosBackend.put('/expense', {
                    id: expense._id,
                    data: {status: 'approved'}
                },
                {
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

    function onPressDetailViewHandler(expense) {
        navigation.navigate('ApprovalView', {
            expense: expense
        })
    }

    function HiddenItems({onReject, onApprove}) {
        return (
            <View style={[tailwind('flex-1 flex-row items-center pl-4 mt-2 rounded-md justify-end mx-3'), {backgroundColor: '#DDD'}]}>
                <TouchableOpacity 
                    onPress={onReject} 
                    style={[tailwind('h-full justify-center items-center rounded-l-md'), {backgroundColor: '#d32f2f', width: 70}]}
                >
                    <Icon name="cancel" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onApprove}
                    style={[tailwind('h-full justify-center items-center rounded-r-md'), {backgroundColor: '#1976d2', width: 70}]}
                >
                    <Icon name="check-circle" size={24} color="white" />
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
                    closeOnRowOpen={true}
                    data={pendingExpenses}
                    keyExtractor={(item, idx) => item._id}
                    renderItem={({item}, rowMap) => (
                        <>
                        <SwipeRow
                            rightOpenValue={-140}
                            disableRightSwipe
                        >
                            <HiddenItems 
                                data={item}
                                onReject={() => onPressRejectExpenseHandler(item, rowMap)}
                                onApprove={() => onPressApproveExpenseHandler(item)}
                            />
                            <>
                                <ExpenseCard data={item} onPressHandler={() => onPressDetailViewHandler(item)}/>
                            </>
                        </SwipeRow>
                        <Text
                            style={tailwind('mx-6 text-xs italic text-gray-600')}
                        >
                            Requested by {item.createdBy.firstName} {item.createdBy.lastName}
                        </Text>
                        </>
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