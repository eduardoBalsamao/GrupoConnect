/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Button} from '@material-ui/core';
import Header from '../Componentes/Header'
import {useAuth} from '../context/AuthContext';
import { useHistory  } from 'react-router-dom';

//Imports firebase
import { getDatabase, ref, onValue} from "firebase/database";

const useStyles = makeStyles((theme) => ({
    root: {
      height: 'auto',
    },
    test:{
      backgroundColor: 'red'
    },
    container:{
        padding: 10,
    },
    item:{
        margin: 10

    },
  }));

  function Admin(){
      const classes = useStyles();
      const {currentUser} = useAuth();
      const navigate = useHistory();
      const db = getDatabase();
      const admRef = ref(db, `/users/${currentUser.uid}/adm`) //Referencia para saber se o ususario é ADM
   
      //Acontece quando a tela inicia
      useEffect(() => {
        onValue(admRef,(snapshot)=>{ //Se não for ADM tira o usuario da pagina
            if(snapshot.val() == false){
                navigate.push('/')
            }
        })
    
       }, [])

      return(
          <div className={classes.root}>
             <Header />
                <Grid 
                 container 
                 className={classes.container}
                 direction="column"
                 justifyContent="center"
                 alignItems="center"
                >
                    <Grid className={classes.item} item  >
                        <Button onClick={()=>{navigate.push('/adminsert')}} variant="contained" color='primary' >
                            Inserir novo produto
                        </Button>
                    </Grid>
                    <Grid className={classes.item} item  >
                        <Button variant="contained" color='primary' onClick={()=>{navigate.push('/adminprodutos')}} >
                            Conferir produtos existentes
                        </Button>
                    </Grid>
                    <Grid className={classes.item} item  >
                        <Button variant="contained" color='primary' onClick={()=>{navigate.push('/adminusuarios')}} >
                            Conferir clientes Cadastrados
                        </Button>
                    </Grid>
                </Grid>
          </div>
      )
  }
  
export default Admin;