import { useTailwind } from "tailwind-rn";

import { Pressable, Text, View } from "react-native";

const statuses = ['draft', 'submitted', 'approved', 'rejected', 'paid']

export default function ExpenseMainFilter({expenses, filteredStatus, setFilteredStatus}) {
    const tailwind = useTailwind()

    function filterExpenses(status) {
        setFilteredStatus(status)
    }

    return (
        <View style={tailwind('pt-3 flex-row justify-center items-center')}>
            {statuses.map(status => (
                <Pressable key={status} onPress={() => filterExpenses(status)} style={{borderWidth: 1, borderColor: '#1976d2'}}>
                    <Text 
                        style={status === filteredStatus 
                            ? [tailwind('capitalize px-2 py-1 font-medium'), {color: 'white', backgroundColor: '#1976d2'}]
                            : [tailwind('capitalize px-2 py-1 font-medium'), {color: '#1976d2'}]}
                    >{status}</Text>
                </Pressable>
            ))}
        </View>
    )
}