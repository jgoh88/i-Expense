import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserHook } from '@/src/hooks/useUserHook'
import { useTailwind } from "tailwind-rn";
import Login from '@/src/screens/Login';
import Home from '@/src/screens/Home';
import Splash from '@/src/screens/Splash';
import ExpenseMain from '@/src/screens/ExpenseMain';
import ExpenseEdit from '@/src/screens/ExpenseEdit';
import ApprovalMain from '@/src/screens/ApprovalMain';

const Stack = createNativeStackNavigator()

export default function AppNav() {
    const userHook = useUserHook()
    const tailwind = useTailwind()
    
    return (
        <>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {userHook.auth.isLoading ? <Stack.Screen name={"Splash"} component={Splash} />
            : userHook.auth.isLoggedIn 
                ? (<>
                    <Stack.Screen name={"Home"} component={Home} />
                    <Stack.Screen name={"ExpenseMain"} component={ExpenseMain} />
                    <Stack.Screen name={"ExpenseEdit"} component={ExpenseEdit} />
                    <Stack.Screen name={"ApprovalMain"} component={ApprovalMain} />
                </>)
                : <Stack.Screen name={"Login"} component={Login} />
            }
        </Stack.Navigator>
        </>
    )   
}