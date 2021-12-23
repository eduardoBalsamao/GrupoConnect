import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import Login from './Login'
import Register from './Registro'
import Home from './Home'
import Adicionar from './Adicionar'
import Admin from './Admin'
import AdminInsert from './AdmInserir'
import AdminUsuarios from './AdmUsuarios'
import AdminProdutos from './AdmProdutos'
import Item from './Item'
import PrivateRoute from './Componentes/PrivateRoute'
import {createTheme, ThemeProvider} from '@material-ui/core/styles'




function App() {

  const theme = createTheme({
    typography:{
      fontFamily:[
        'Roboto',
        'sans-serif'
      ].join(','),
      subtitle1:{
        fontSize: "1rem",
        fontFamily:[
          'Roboto',
          'sans-serif'
        ].join(','),
      }
    },
    palette: {
      primary: {
          light: '#67daff',
          main: '#03a9f4',
          dark: '#002884',
          contrastText: '#fff',
      },
    }
  })



  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={ Home }></PrivateRoute>
            <Route path="/login" component={ Login }></Route>
            <Route path="/register" component={ Register }></Route>
            <PrivateRoute path="/item/:currentId" component={ Item }></PrivateRoute>
            <PrivateRoute path="/add" component={ Adicionar }></PrivateRoute>
            <PrivateRoute path="/admin" component={ Admin }></PrivateRoute>
            <PrivateRoute path="/adminsert" component={ AdminInsert }></PrivateRoute>
            <PrivateRoute path="/adminusuarios" component={ AdminUsuarios }></PrivateRoute>
            <PrivateRoute path="/adminprodutos" component={ AdminProdutos }></PrivateRoute>
          </Switch>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
