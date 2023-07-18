import { createContext, useContext, useEffect, useState } from "react";
import axiosBackend from "../../configs/axiosBackend";

const UserContext = createContext()

export function useUserHook() {
    if (!UserContext) {
        throw new Error("You must use inside UserContext.Provider")
    }
    return useContext(UserContext)
}

export function UserProvider({children}) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [tokenUpdated, setTokenUpdated] = useState(false)

    useEffect(() => {
        const verifyUser = async () => {
            const token = getToken()
            if (!token) {
                setUser(null) 
                setTokenUpdated(false)
                return
            }
            try {
                const res = await axiosBackend.get('/user', {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                setToken(token)
                setUser(res.data.user)   
                setTokenUpdated(false)
            } catch (err) {
                setTokenUpdated(false)
                if (err.response.status === 401 && err.response.data.message === 'Invalid token') {
                    removeToken()
                    return
                } 
                console.log(err)
            }
        }
        verifyUser()
    }, [tokenUpdated])

    function storeToken(tkn) {
        setTokenUpdated(true)
        localStorage.setItem('token', tkn)
    }

    function getToken() {
        return localStorage.getItem('token')
    }

    function removeToken() {
        setTokenUpdated(true)
        localStorage.removeItem('token')
    }

    function isAuthenticated() {
        const token = getToken()
        if (!token) {
            return false
        }
        const checkToken = async () => {
            try {
                await axiosBackend.get('/user', {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                return true
            } catch (err) {
                if (err.response.status === 401 && err.response.data.message === 'Invalid token') {
                    removeToken()  
                } 
                return false
            }
        }
        if(!checkToken()){
            return false 
        }
        return true
    }

    return (
        <UserContext.Provider value={{token, user, storeToken, removeToken, getToken, isAuthenticated}}>
            {children}
        </UserContext.Provider>
    )
}