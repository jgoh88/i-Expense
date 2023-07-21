import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosBackend from "@/src/configs/axiosBackend";

const UserContext = createContext()

export function useUserHook() {
    if (!UserContext) {
        throw new Error("You must use inside UserContext.Provider")
    }
    return useContext(UserContext)
}

export function UserProvider({children}) {
    const [auth, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        isLoggedIn: true,
                        isLoading: false,
                        token: action.token,
                        user: action.user,
                    };
                case 'LOG_IN':
                    return {
                        ...prevState,
                        isLoggedIn: true,
                        isLoading: false,
                        token: action.token,
                        user: action.user
                    };
                case 'LOG_OUT':
                    return {
                        ...prevState,
                        isLoggedIn: false,
                        isLoading: false,
                        token: null,
                        user: null,
                    };
            }
        },
        {
            isLoading: true,
            isLoggedIn: false,
            token: null,
            user: null
        }
    );
    const navigation = useNavigation()

    useEffect(() => {
        const verifyUser = async () => {
            let tkn, usr
            try {
                tkn = await getToken()
            } catch (err) {
                console.log(err)
            }
            if (!tkn) {
                dispatch({ type: 'LOG_OUT'});
                return 
            }
            try {
                const res = await axiosBackend.get('/user', {
                    headers: {
                        authorization: `Bearer ${tkn}`
                    }
                })
                console.log('data:', res.data)
                console.log('status:', res.status)
                usr = res.data.user  
            } catch (err) {
                if (err.response.status === 401 && err.response.data.message === 'Invalid token') {
                    try {
                        await removeToken()
                        dispatch({ type: 'LOG_OUT'});
                        navigation.navigate('Login')
                    } catch (err) {
                        console.log(err)
                    }
                } 
                console.log(err)
            }
            dispatch({ type: 'RESTORE_TOKEN', token: tkn, user: usr });
        };
    
        verifyUser()
    }, []);

    // useEffect(() => {
    //     const verifyUser = async () => {
            
    //         const token = getToken()
    //         console.log('token',token)
    //         if (!token) {
    //             setUser(null) 
    //             setTokenUpdated(false)
    //             navigation.navigate('Login')
    //             return
    //         }
    //         try {
    //             const res = await axiosBackend.get('/user', {
    //                 headers: {
    //                     authorization: `Bearer ${token}`
    //                 }
    //             })
    //             setToken(token)
    //             setUser(res.data.user)   
    //             setTokenUpdated(false)
    //         } catch (err) {
    //             setTokenUpdated(false)
    //             if (err.response.status === 401 && err.response.data.message === 'Invalid token') {
    //                 removeToken()
    //                 navigation.navigate('Login')
    //                 return
    //             } 
    //             console.log(err)
    //         }
    //     }
    //     verifyUser()
    // }, [tokenUpdated])

    async function storeToken(tkn) {
        try {
            await AsyncStorage.setItem('token', tkn)
        } catch (err) {
            console.log(err)
        }
    }

    async function getToken() {
        try {
            const tkn = await AsyncStorage.getItem('token')
            return tkn
        } catch (err) {
            console.log(err)
        }
    }

    async function removeToken() {
        try {
            await AsyncStorage.removeItem('token')
            setTokenUpdated(true)
        } catch (err) {
            console.log(err)
        }
    }

    async function getUser() {
        const tkn = getToken()
        if (!tkn) {
            navigation.navigate('Login')
        }
        try {
            const res = await axiosBackend.get('/user', {
                headers: {
                    authorization: `Bearer ${tkn}`
                }
            })
            return res.data.user 
        } catch (err) {
            if (err.response.status === 401 && err.response.data.message === 'Invalid token') {
                removeToken()
                navigation.navigate('Login')
            } 
            console.log(err)
        }
    }

    async function signIn(data) {
        try {
            const res = await axiosBackend.post('/user/login', data)
            await storeToken(res.data.token)
            dispatch({ type: 'LOG_IN', token: res.data.token, user: res.data.user });
            return {success: true}
        } catch (err) {
            if (err.response.status === 400 && err.response.data.message === 'Password is incorrect') {
                return {success: false, message: 'Password is incorrect'}
            }
            console.log(err)
        }
    }

    async function signOut() {
        try {
            await removeToken()
            dispatch({ type: 'LOG_OUT' });
            navigation.navigate('Login')
            return {success: true}
        } catch (err) {
            console.log(err)
            return {success: false}
        }
    }

    return (
        <UserContext.Provider value={{auth, signIn, signOut}}>
            {children}
        </UserContext.Provider>
    )
}