import { useTailwind } from "tailwind-rn";

import { Text, View, TouchableOpacity } from "react-native";
import ExpenseItemAddEditModal from "../ExpenseItemAddEditModal";

export default function ExpenseItemCard({data, expense, setExpense, readOnly}) {
    const tailwind = useTailwind()

    return (
        // <TouchableOpacity style={tailwind('mt-2 bg-white mx-3 rounded-md')}>
        <ExpenseItemAddEditModal 
            expense={expense}
            setExpense={setExpense}
            expenseItem={data}
            style={tailwind('mt-2 bg-white mx-3 rounded-md')}
            readOnly={readOnly}
        >
            <View style={[tailwind('flex-row p-3 rounded-md'), {borderWidth: 1, borderColor: '#1976d2'}]}>
                <View style={tailwind('justify-between flex-1')}>
                    <Text style={tailwind('text-base font-bold')}>{data.description}</Text>
                    <View style={tailwind('mt-2 flex-row')}>
                        <Text>{new Date(data.date).toDateString()}</Text>
                        <Text style={tailwind('capitalize font-semibold ml-3')}>{data.category}</Text>
                    </View>
                    
                </View>
                <View style={tailwind('justify-end w-3/12 items-end')}>
                    <Text style={[tailwind('font-bold text-base'), {color: '#1976d2'}]}>RM {data.amount}</Text>
                </View>
            </View>
        </ExpenseItemAddEditModal>
        // </TouchableOpacity>
    )
}
