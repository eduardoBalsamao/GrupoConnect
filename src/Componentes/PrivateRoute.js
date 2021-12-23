import React from 'react'
import { Route, Redirect  } from 'react-router-dom';
import {useAuth} from '../context/AuthContext' 


//Faz uma rota privada, ou seja, essa rota só pode ser acessada se o currentUser estiver logado.
//Caso o usuario não esteja logado redireciona para /login

export default function PrivateRoute({ component: Component, ...rest}) {
    const {currentUser} = useAuth()
    return (
        <Route
        {...rest}
        render={props =>{
            return currentUser ? <Component {...props} /> : <Redirect  to="/login"/>
        }}
        >

        </Route>
    )
}
