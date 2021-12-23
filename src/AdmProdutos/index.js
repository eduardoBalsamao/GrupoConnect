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
  

  function AdmProdutos(){
      const classes = useStyles();
      const {currentUser} = useAuth();
      const navigate = useHistory();
      const [data, setData] =useState([]);

      const db = getDatabase(); //Referencia para o banco de dados
      const admRef = ref(db, `/users/${currentUser.uid}/adm`) //Referencia para adm no usuario

      //Recolhe os dados sobre os produtos no banco de dados
      function prodFetch(){
        onValue(ref(db, '/Torneiras'), (snapshot) => {
            let d = [];
            snapshot.forEach(item=>{
            const info={
                id: item.key,
                lastDate: item.val().lastDate,
                lastUse: item.val().lastUse,
                senha: item.val().senha,
                status: item.val().status,
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
      prodFetch()
    
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
                        <h3 className={classes.titulo}>Produtos Cadastrados:</h3>
                    </Grid>

                    <TableContainer  component={Paper}>
                        <Table className={classes.table} stickyHeader aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell>Codigo</StyledTableCell>
                                <StyledTableCell>Senha</StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell>Ultima vez acionado em</StyledTableCell>
                                <StyledTableCell>Ultima vez acionado por</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {data.map((row) => (
                                <StyledTableRow key={row.id}>
                                <StyledTableCell >{row.id}</StyledTableCell> 
                                <StyledTableCell >{row.senha}</StyledTableCell>
                                <StyledTableCell >{row.status}</StyledTableCell>
                                <StyledTableCell >{row.lastDate}</StyledTableCell>
                                <StyledTableCell >{row.lastUse}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                </Grid>
          </div>
      )
  }
  
export default AdmProdutos;