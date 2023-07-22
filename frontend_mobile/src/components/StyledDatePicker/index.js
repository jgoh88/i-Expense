import { useTailwind } from "tailwind-rn";

import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View } from 'react-native'

export default function StyledDatePicker({error, helperText, style, ...otherProps}) {
    const tailwind = useTailwind()
    const validationColor = !error ? 'rgba(34, 62, 75, 0.7)' : '#d32f2f'
    return (
        <View style={[tailwind(''), style]}>
            <View
                style={[
                    tailwind('flex-row items-center justify-center rounded-md'),
                    {borderColor: validationColor, borderWidth: 1}
                ]}
            >
                <View style={tailwind('flex-1 justify-center')}>
                    <DateTimePicker
                        {...otherProps}
                    />
                </View>
            </View>
            {helperText && <View style={tailwind('ml-3')}>
                <Text style={[tailwind('text-xs'), {color: validationColor}]}>{helperText}</Text>
            </View> 
            }    
        </View>

    )
}