import React, {useState, useContext, useEffect} from 'react'
import {auth} from '../firebase'

import {signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] =  useState()
    const [loading, setLoading] =  useState(true)

    function login(email, senha){
        return signInWithEmailAndPassword(auth, email, senha)
    }

    function googleLogin(provider){
        return signInWithPopup(auth, provider)
            .then((res) =>{
                return res.user;
            }).catch((error)=>{
                return error;
            })
    }

    function logout(){
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        login,
        logout,
        googleLogin,
    }
 
    return (
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
