/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, {useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {TextField, Button} from '@material-ui/core';
import Header from '../Componentes/Header'
import {useAuth} from '../context/AuthContext';
import { useHistory  } from 'react-router-dom';

import { getDatabase, ref, onValue, set} from "firebase/database";

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
    erro:{
        fontSize: 30
    },
    titulo:{
        color:'#00688B',
    },
    buttonC:{
        color: '#ffff',
        borderColor: '#ff2400',
        backgroundColor: '#ff2400',
        '&:hover': {
            backgroundColor:'#AD0000',
        },
    },
    
  }));
  
  const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: '#63B8FF',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#63B8FF',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#63B8FF',
        },
        '&:hover fieldset': {
          borderColor: '#00688B',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#63B8FF',
        },
      },
    },
  })(TextField)

  function AdmInserir(){
      const classes = useStyles();
      const {currentUser} = useAuth();
      const navigate = useHistory();
      const [codigo, setCodigo] = useState(); //State para o codigo digitado
      const [adm, setAdm] = useState(); //State para armazernar se o user é adm
      const db = getDatabase();//Referencia para o banco de dados
      const admRef = ref(db, `/users/${currentUser.uid}/adm`) //Referencia para ADM

      //Função para pegar o codigo do input
      const codigoPicker = (event) => {
        setCodigo(event.target.value);
      };

      //Função que cria um novo dispositivo no sistema
      function addDispositivo(){
          if(adm == true){
            set(ref(db, `/Torneiras/${codigo}`), {
              code: codigo,
              lastDate: " ",
              lastUse: " ",
              nome: " ",
              senha: " ",
              status: "0"
          }).then(()=>{
            alert("Produto " + codigo +" inserido com sucesso!")
          })
          } else {
              alert("Acesso negado")
          }
      }
      
      //Acontece quando a tela inicia
      useEffect(() => {
        onValue(admRef,(snapshot)=>{
          if(snapshot.val() == false){
              navigate.push('/')//Se não for ADM tira o usuario da pagina
          }else{
            setAdm(true)
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
                 justifyContent="flex-start"
                 alignItems="center"
                >
                    <Grid className={classes.item} item>
                        <h3 className={classes.titulo}>Adicionar novo Dispositivo</h3>
                    </Grid>

                    <Grid className={classes.item} item>
                        <CssTextField 
                            fullWidth
                            InputLabelProps={{className: classes.inputText}} 
                            InputProps={{className: classes.inputText}} 
                            className={classes.input} 
                            onChange={codigoPicker}
                            size="small" id="code" label="Código" variant="outlined"  
                        />
                    </Grid>
                    
                    <Grid className={classes.item} item>
                        <Button onClick={addDispositivo} variant="contained" color='primary' >
                            Inserir novo produto
                        </Button>
                    </Grid>
                    <Grid className={classes.item} item>
                        <Button onClick={()=>{navigate.push('/admin')}} variant="contained" className={classes.buttonC} >
                            Cancelar
                        </Button>
                    </Grid>
                    
                </Grid>
          </div>
      )
  }
  
export default AdmInserir;