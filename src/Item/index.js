/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Paper, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Header from '../Componentes/Header'
import { useParams  } from 'react-router-dom';
import CancelIcon from '@material-ui/icons/Cancel';
import {useAuth} from '../context/AuthContext';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog';
import { useHistory  } from 'react-router-dom';

import { getDatabase, ref, onValue, update, remove} from "firebase/database";


const useStyles = makeStyles((theme) => ({
  root: {
    height: 'auto',
  },
  container:{
    marginTop:30,
    marginRight: 20,
    marginLeft: 20
  },
  paper: {
    width: '90%',
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row'
  },
  titulo: {
      fontSize: '14px'
  },
  itemText:{
      color:'#63B8FF'
  },
  cancelButton:{
    position: 'relative',
    left: '25px'
    
  }
  
  
}));



const Item = () => {
    let { currentId } = useParams();
    const classes = useStyles();
    const navigate = useHistory();
    const [itemAtual, setItemAtual] = useState([]);
    const db = getDatabase();
    const {currentUser} = useAuth(); //Resgata o usuario atual
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    //Função que desvincula um produto a conta
    function desvincular(){
      remove(ref(db, `/users/${currentUser.uid}/Torneiras/${currentId}`))
      alert("Produto desvinculado")
      setOpen(false);
      navigate.push('/')
    }

    //Função que cancecla o horario de ligar
    function cancelarLigar(){
      update(ref(db, `Torneiras/${currentId}`), {ligarAs: " "})
    }

    //Função que cancecla o horario de desligar
    function cancelarDesligar(){
      update(ref(db, `Torneiras/${currentId}`), {desligarAs: " "})
    }

    //Função que recolhe os dados do produto atual
    const itemFetch = () => {
      onValue(ref(db, `Torneiras/${currentId}`), (snapshot)=>{
            const produtos = {
                id: snapshot.val().code,
                nome: snapshot.val().nome, //Nome
                code: snapshot.val().code,
                status: snapshot.val().status,
                lastUse: snapshot.val().lastUse,
                lastDate: snapshot.val().lastDate,
                ligarAs: snapshot.val().ligarAs,
                desligarAs: snapshot.val().desligarAs,
            };  
        setItemAtual(produtos)
        console.log(itemAtual)
        })
    }

    //Acontece quando a tela inicia
    useEffect(() => {
        itemFetch()
    
    }, [])

  
  return (
    <div className={classes.root}>
        <Header />
        <Grid className={classes.container} 
          container
          direction="column"
          //justifyContent="center"
          //alignItems="center"
        >
        <Grid xs={12} item>
            <Typography>Dados para: </Typography>
        </Grid> 
                <Grid xs={12}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Nome: <span className={classes.itemText}>{itemAtual.nome}</span> </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Código: <span className={classes.itemText}>{itemAtual.code}</span> </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Acionado ultima: <span className={classes.itemText}>{itemAtual.lastUse}</span> </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Acionado ultima vez por: <span className={classes.itemText}>{itemAtual.lastDate}</span> </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Ligas as:  <span className={classes.itemText}>{itemAtual.ligarAs}</span> 
                          <Button
                          onClick={cancelarLigar}
                          className={classes.cancelButton}
                          variant="outlined"
                          color="primary"
                          startIcon={<CancelIcon />}>
                            Cancelar
                          </Button>
                        
                        </Typography>
                    </Paper>

                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Desligar as:  <span className={classes.itemText}>{itemAtual.desligarAs}</span> 
                          <Button
                          onClick={cancelarDesligar}
                          className={classes.cancelButton}
                          variant="outlined"
                          color="primary"
                          startIcon={<CancelIcon />}>
                            Cancelar
                          </Button>
                        
                        </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo}>Clique aqui para desvincular esse produto a sua conta: 
                        <Button
                          onClick={handleClickOpen}
                          className={classes.cancelButton}
                          variant="outlined"
                          color="secondary"
                          startIcon={<CancelIcon />}>
                            Desvincular
                          </Button>
                        </Typography>
                    </Paper>
                    
                </Grid>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Desvincular produto?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Tem certeza que deseja desvincular este produto da sua conta?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                      Não
                    </Button>
                    <Button onClick={desvincular} color="primary">
                      Sim
                    </Button>
                  </DialogActions>
                </Dialog>
        
         

      </Grid>
      
       
    </div>
  );
}

export default Item;
