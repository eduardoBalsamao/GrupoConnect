/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React,{useEffect, useState} from 'react'
import Header from '../Componentes/Header'
import {Grid, TextField, Paper, InputAdornment, ButtonBase, IconButton, Button, Checkbox, FormControlLabel} from '@material-ui/core';
import Search from '@material-ui/icons/Search'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SettingsIcon from '@material-ui/icons/Settings';
import {useAuth} from '../context/AuthContext';
import { useHistory  } from 'react-router-dom';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
 
//Firebase Imports
import { getDatabase, ref, onValue, update, get} from "firebase/database";
 
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

  const useStyles = makeStyles((theme) => ({
    root: {
      height: 'auto',
    },
    grow:{
      flexGrow: 1
    },
    input: {
      backgroundColor:'rgba(255, 255, 255, 0.2)',
      borderRadius: 5,
      color:'black',
      marginTop: 20,
    },
    inputText:{
      color:'#00688B',
    },
    paper:{
      background: "linear-gradient(295deg, rgba(115,165,252,1) 32%, rgba(77,132,225,1) 63%)",
      marginBottom:20,
    },
    container:{
      marginTop: 25
    },
    text:{
      fontSize: 12,
      fontWeight: 'normal',
      color: 'whitesmoke',
        
    },
    icon:{
      color: 'whitesmoke',
      fontWeight: 'bold',
      alignSelf: 'center'
    },
    textName:{
      fontWeight: 'bold',
      fontSize: 16,
      color: 'whitesmoke',
      textAlign: 'center',
      
    },
    buttonOff:{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: ' rgba(38,50,56,0.7)',
      width: 55,
      height: 55,
      borderRadius: 50,
  },
  buttonOn:{
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: ' rgba(38,50,56,0.3)',
    width: 56,
    height: 56,
    borderRadius: 50,
  },
  buttonText:{
      color: 'white',
      fontSize: 12,
      textAlign: 'center',
  },
  test:{
    backgroundColor: 'red'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
    
  }));


const Home = () => {
    const classes = useStyles(); //Estilo

    const {currentUser} = useAuth(); //Resgata o usuario atual

    const navigate = useHistory();

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [ligar, setLigar] = useState(" "); //State usada pra setar a hora de ligar
    const [desligar, setDesligar] = useState(" ");//State usada pra setar a hora de desligar
    const [checkedLigar, setCheckedLigar] = useState(false); //State para verificar o checkbox
    const [checkedDesligar, setCheckedDesligar] = useState(false); //State para verificar o checkbox
    const [atualCode, setAtualCode] = useState() //State para setar o horario para o produto que foi clicado

    const db = getDatabase(); //Referencia do banco de dados
    const produtosRef = ref(db, `/users/${currentUser.uid}/Torneiras`); //Referencia para os produtos registrados na conta do usuario logado

    //Função pega se o checkbox ta clicado
  const handleChangeLigar = (event) => {
      setCheckedLigar(event.target.checked);
  };

    //Função pega se o checkbox ta clicado
  const handleChangeDesligar = (event) => {
      setCheckedDesligar(event.target.checked);
  };

  //Função que pega a hora de ligar
  const ligarPicker = (event) => {
    setLigar(event.target.value);
  };

  //Função que pega a hora de desligar
  const desligarPicker = (event) => {
    setDesligar(event.target.value);
  };

  //Abre o model do horario
  const handleClickOpen = (codeParam) => {
    setOpen(true);
    setAtualCode(codeParam)
  };

  //Fecha o model do horario
  const handleClose = () => {
    setOpen(false);

  };
  
  //Função que seta os horarios de ligar no banco de dados
  function agendarHorario () {
    if(checkedLigar == true && ligar !== " "){
      update(ref(db,`Torneiras/${atualCode}`), {ligarAs: ligar + ':0'})
      alert("Horario para ligar definido, para cancelar entre nas configurações do dispositivo.")
      setOpen(false)
      setLigar(" ")
    }
    if(checkedDesligar == true && desligar !== " "){
      update(ref(db,`Torneiras/${atualCode}`), {desligarAs: desligar + ':0'})
      alert("Horario para desligar definido, para cancelar entre nas configurações do dispositivo.")
      setOpen(false)
      setDesligar(" ")
    }
    
  }

  //Função que recolhe os dados sobre os produtos do usuario logado
  function produtosFetch () {
      onValue(produtosRef, (snapshot) => {
        let d = []; //Data temporaria
        snapshot.forEach(item => {
          
          const produtos = {
            nome: item.val().nome, //Nome
            code: item.val().code,
            status: item.val().status

          };
          d.push(produtos);
        });
        setData(d);
      })
  }

  //Acontece quando a tela inicica
  useEffect(() => {
    produtosFetch();

   }, [])

    return (
        <div className={classes.root}>
            <Header />
            <Grid
                container       
                justifyContent='center'         
            >
                <Grid xs={8} item>
                <CssTextField
                    fullWidth
                    className={classes.input} 
                    InputLabelProps={{className: classes.inputText}} 
                    size="small" label="Procurar por..."
                    InputProps={{className: classes.inputText, startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),}} 
                />
                </Grid>
            </Grid>
            <Grid className={classes.container} container justifyContent='center'>
            {
              data.map((item) =>{
                                
                //Função que seta no banco de dados o status do produto "ON" ou "OFF"
                //Tambem seta quem acionou e a hora que acionou
                function onOff(){
                  get(ref(db,`/Torneiras/${item.code}/status`)).then((snapshot) => {
                    if (snapshot.val() === "1") {
                      update(ref(db,`/Torneiras/${item.code}`), {status: '0'})
                    } if (snapshot.val() === "0") {
                      update(ref(db,`/Torneiras/${item.code}`), {status: '1'})
                    }
                    update(ref(db,`/Torneiras/${item.code}`), {
                      lastUse: currentUser.email,
                      lastDate: String(new Date().getDate()).padStart(2, '0') + '/' + String(new Date().getMonth() + 1).padStart(2, '0') + '/' + new Date().getFullYear() 
                                + ' as ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                    })

                  })
                } 

                //Função que muda o botão para ligado
                function Ligado(props) {
                  return (
                    <ButtonBase  component="span">
                      <Paper elevation={5} className={classes.buttonOn}>
                      <span className={classes.buttonText}>on</span>
                        <PowerSettingsNewIcon 
                          onClick={onOff}                    
                          className={classes.icon} fontSize="large" /> 
                      </Paper>
                    </ButtonBase>
                  )
                }

                //Função que muda o botão para desligado
                function Desligado(props) {
                  return (
                    <ButtonBase  component="span">
                      <Paper elevation={5} className={classes.buttonOff}>
                      <span className={classes.buttonText}>off</span>
                        <PowerSettingsNewIcon 
                          onClick={onOff}                    
                          className={classes.icon} fontSize="large" /> 
                      </Paper>
                    </ButtonBase>
                  )
                }
                
                //Verifica o status e retorna o botão correto
                function Status(props) {
                  if(props.status == 1){
                    return <Ligado />
                  } if(props.status == 0){
                    return <Desligado />
                  }
                }
                          
                return(
                  <Grid key={item.id} item xs={10}>
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container alignItems="center" justifyContent="center">
                          <Grid item xs={9}>
                            <Grid direction="row" container>
                            <Grid item xs={1}>
                              <IconButton onClick={()=>navigate.push(`/item/${item.code}`)}>
                                <SettingsIcon className={classes.icon} />
                              </IconButton>
                            </Grid>
                            <div className={classes.grow}></div>
                            <Grid item>
                              <p className={classes.textName}>{item.nome}</p> 
                            </Grid>
                            <div className={classes.grow}></div>
                            </Grid>
                            <Grid item>
                              <IconButton onClick={()=>{handleClickOpen(item.code)}}>
                                <AccessAlarmIcon className={classes.icon} />
                              </IconButton> 
                            </Grid>
                            
                          </Grid>
                          <Grid item xs={2} >
                          {
                            onValue(ref(db, `/Torneiras/${item.code}/status`), (snapshot) =>{
                              var mainStatus = snapshot.val()
                              update(ref(db,`/users/${currentUser.uid}/Torneiras/${item.code}`), {status: mainStatus})
                            })
                          }
                          
                          <Status status={item.status}></Status>


                          </Grid>  

                        </Grid>
                    </Paper>
                </Grid>
                )
              })
              }
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Deseja agendar algum horário para acionamento?"}</DialogTitle>
              <DialogContent>
                <FormControlLabel
                  control={<Checkbox
                    checked={checkedLigar}
                    onChange={handleChangeLigar}
                    label="Definir horario de Ligar"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />}
                  label="Definir horario de Ligar"
                />
                
                {checkedLigar && 
                <h4>Ligar as:</h4>}
                {checkedLigar && 
                <TextField
                  id="timeLigar"
                  label="Ligar as:"
                  type="time"
                  onChange={ligarPicker}
                  defaultValue="--:--"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />}

              </DialogContent>
              <DialogContent>
              <FormControlLabel
                  control={<Checkbox
                    checked={checkedDesligar}
                    onChange={handleChangeDesligar}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />}
                  label="Definir horario de Desligar"
                />
                {checkedDesligar && <h4>Desligar as:</h4>}
                {checkedDesligar && <TextField
                  id="timeDesligar"
                  label="Desligar as:"
                  type="time"
                  onChange={desligarPicker}
                  defaultValue="--:--"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancelar
                </Button>
                <Button onClick={agendarHorario} color="primary" autoFocus>
                  Agendar
                </Button>
              </DialogActions>
            </Dialog>
        </div>
    )
}

export default Home;
