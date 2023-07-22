import { TextInput, Text, View } from 'react-native'
import { useTailwind } from "tailwind-rn";
import { Entypo as Icon } from '@expo/vector-icons';

export default function StyledTextInput({icon, error, helperText, style, ...otherProps}) {
    const tailwind = useTailwind()
    const validationColor = !error ? 'rgba(34, 62, 75, 0.7)' : '#d32f2f'
    return (
        <View style={[tailwind('w-full'), style]}>
            <View
                style={[
                    tailwind('flex-row items-center justify-center rounded-md w-full h-10 p-2'),
                    {borderColor: validationColor, borderWidth: 1}
                ]}
            >
            <View style={tailwind('pr-2 justify-center')}>
                <Icon name={icon} color={validationColor} size={18}/>
            </View>
                <View style={tailwind('flex-1 justify-center')}>
                    <TextInput
                        style={tailwind('text-base h-8')}
                        underlineColorAndroid='transparent'
                        placeholderTextColor='rgba(34, 62, 75, 0.7)'
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