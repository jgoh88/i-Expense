import { useState } from "react";
import { useRoute } from "@react-navigation/core";
import { useTailwind } from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";
import { useUserHook } from "@/src/hooks/useUserHook";
import axiosBackend from '@/src/configs/axiosBackend';

import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import { Pressable, Text, View, TouchableOpacity, Button } from "react-native";
import BottomNavBar from "@/src/components/BottomNavBar";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import ExpenseItemCard from "../../components/ExpenseItemCard";
import ExpenseItemAddEditModal from "../../components/ExpenseItemAddEditModal";
import Toast from 'react-native-toast-message';

export default function ExpenseEdit() {
    const route = useRoute()
    const userHook = useUserHook()
    const [expense, setExpense] = useState(route.params.expense)
    const tailwind = useTailwind()
    const navigation = useNavigation()

    function onPressBackHandler() {
        navigation.goBack()
    }

    function onPressDeleteExpenseItemHandler(expenseItem) {
        const idx = expense.expenseItems.findIndex(item => item._id === expenseItem._id)
        if (idx < 0) {
            return
        }
        const tempExpense = {...expense}
        tempExpense.expenseItems.splice(idx, 1)
        setExpense(tempExpense)
    }

    async function onPressSaveExpenseHandler() {
        const reqBody = {
            id: expense._id,
            data: {
                ...expense
            }
        }
        try {
            await axiosBackend.put('/expense', reqBody, {
                headers: {
                    authorization: `Bearer ${userHook.auth.token}`
                }
            })
            Toast.show({
                type: 'success',
                text1: 'Expense saved',
            })
        } catch (err) {
            console.log(err.response)
            if (err.response.status === 401 && err.response.message === 'Invalid token') {
                userHook.signOut()
            }
        }
    }

    async function onPressSubmitExpenseHandler() {
        if (expense.expenseItems.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Cannot submit a blank response',
            })
            return
        }
        const reqBody = {
            id: expense._id,
            data: {
                ...expense,
                status: 'submitted'
            }
        }
        try {
            await axiosBackend.put('/expense', reqBody, {
                headers: {
                    authorization: `Bearer ${userHook.auth.token}`
                }
            })
            Toast.show({
                type: 'success',
                text1: 'Expense submitted for approval',
            })
            setTimeout(() => navigation.goBack(), 1500)
            
        } catch (err) {
            console.log(err.response)
            if (err.response.status === 401 && err.response.message === 'Invalid token') {
                userHook.signOut()
            }
        }
    }

    function HiddenItems({onDelete}) {
        return (
            <View style={[tailwind('flex-1 flex-row items-center pl-4 mt-2 rounded-md justify-end mx-3'), {backgroundColor: '#DDD'}]}>
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
                    <ExpenseItemAddEditModal
                        expense={expense}
                        setExpense={setExpense}
                    >
                        <Icon name="add" size={32} color="white" />
                    </ExpenseItemAddEditModal>
                </View>
            </View>
            <View style={tailwind('z-10')}>
                <Toast 
                    visibilityTime={1000}
                    topOffset={20}
                />
            </View>
            <View style={tailwind('flex-1 justify-center items-center my-1 mt-2')}>
                <SwipeListView 
                    data={expense.expenseItems}
                    keyExtractor={(item, idx) => idx}
                    renderItem={({item}, rowMap) => (
                            <SwipeRow
                                rightOpenValue={-70}
                                disableRightSwipe
                            >
                                <HiddenItems 
                                    data={item}
                                    onDelete={() => onPressDeleteExpenseItemHandler(item)}
                                />
                                <ExpenseItemCard data={item} expense={expense} setExpense={setExpense}/>
                            </SwipeRow>
                    )}
                    style={tailwind('w-full')}
                />
            </View>
            <BottomNavBar 
                navMenus={[
                    {label: 'Save', icon: 'save', onPress: onPressSaveExpenseHandler,},
                    {label: 'Submit', icon: 'send', onPress: onPressSubmitExpenseHandler,},
                ]}
            />
        </>
    )
}