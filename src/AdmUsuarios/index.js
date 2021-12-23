/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, {useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from '../Componentes/Header'
import {useAuth} from '../context/AuthContext';
import { useHistory  } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { getDatabase, ref, onValue} from "firebase/database";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#63B8FF',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

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
 

  function AdmUsuarios(){
      const classes = useStyles();
      const {currentUser} = useAuth();
      const navigate = useHistory();
      const [data, setData] =useState([]);
      const db = getDatabase(); //Referencia pro bancoc de dados
      const admRef = ref(db, `/users/${currentUser.uid}/adm`) //Referencia para adm no usuarios

      //Recolhe os dados dos usuarios
      function userFetch(){
        onValue(ref(db, '/users'), (snapshot)=>{
            let d = [];
            snapshot.forEach(item=>{
            const info={
                id: item.key,
                email: item.val().email,
                produtos: item.val().Torneiras
            }   
            d.push(info)
            });
            setData(d)
            console.log(d)
        })
      }
   
      //Acontece quando a tela inicia
      useEffect(() => {
        onValue(admRef,(snapshot)=>{
          if(snapshot.val() == false){
              navigate.push('/')
          }
        })
        userFetch()
    
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
                        <h3 className={classes.titulo}>Usuarios Cadastrados:</h3>
                    </Grid>

                    <TableContainer  component={Paper}>
                        <Table className={classes.table} stickyHeader aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell>Informação dos Usuarios</StyledTableCell>
                                <StyledTableCell>Informação de Produtos por Users</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map((row) => (
                                <StyledTableRow key={row.email}>
                                <StyledTableCell >
                                    ID:  {row.id}
                                    {<br />}
                                    {<br />}
                                    EMAIL:  {row.email}
                                </StyledTableCell>
                                
                                <StyledTableCell align="left">{<div><pre>{JSON.stringify(row.produtos, null, 2) }</pre></div>}</StyledTableCell>
                                
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                </Grid>
          </div>
      )
  }
  
export default AdmUsuarios;