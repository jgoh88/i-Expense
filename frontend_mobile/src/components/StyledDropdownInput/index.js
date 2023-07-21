import { ScrollView, Text, View } from 'react-native'
import { useTailwind } from "tailwind-rn";
import { Entypo as Icon } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';

export default function StyledDropdownInput({icon, error, helperText, style, ...otherProps}) {
    const tailwind = useTailwind()
    const validationColor = !error ? 'rgba(34, 62, 75, 0.7)' : '#d32f2f'
    return (
        <View style={[tailwind('w-full'), style]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={false}
                contentContainerStyle={[tailwind('h-10 rounded-md justify-center'), {borderColor: validationColor, borderWidth: 1}]}
                
            >
                <SelectDropdown
                    {...otherProps}
                />
            </ScrollView>
            {helperText && <View style={tailwind('ml-3')}>
                <Text style={[tailwind('text-xs'), {color: validationColor}]}>{helperText}</Text>
            </View> 
            }        
        </View>

    )
}