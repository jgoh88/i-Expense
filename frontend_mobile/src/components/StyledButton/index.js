import { TouchableOpacity, Text } from 'react-native'
import { useTailwind } from "tailwind-rn";

export default function StyledButton({label, onPress, style}) {
    const tailwind = useTailwind()
    return (
        <TouchableOpacity
            style={[tailwind('w-full h-9 justify-center items-center rounded-md'), {backgroundColor: '#1976d2'}, style]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Text
                style={[tailwind('uppercase text-base'), { color: '#fff' }]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}