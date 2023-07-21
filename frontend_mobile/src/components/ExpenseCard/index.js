import { useTailwind } from "tailwind-rn";

import { Text, View, Pressable } from "react-native";

export default function ExpenseCard({data}) {
    const tailwind = useTailwind()

    return (
        <Pressable style={tailwind('mt-2 bg-white mx-3 rounded-md')}>
            <View style={[tailwind('flex-row p-3 rounded-md'), {borderWidth: 1, borderColor: '#1976d2'}]}>
                <View style={tailwind('justify-between flex-1')}>
                    <Text style={tailwind('text-base font-bold')}>{data.title}</Text>
                    <Text style={tailwind('mt-2')}>{new Date(data.createdAt).toDateString()}</Text>
                </View>
                <View style={tailwind('justify-end w-3/12 items-end')}>
                    <Text style={[tailwind('font-bold text-base'), {color: '#1976d2'}]}>RM {data.expenseItems.reduce((t, c) => t + c.amount, 0)}</Text>
                </View>
            </View>
        </Pressable>
    )
}