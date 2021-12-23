/* eslint-disable eqeqeq */
import React, {useState} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Box, TextField, Button, Typography, CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useHistory  } from 'react-router-dom';
import { auth} from '../firebase'

import {createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set} from "firebase/database";


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  test:{
    backgroundColor: 'red'
  },
  backgroundImg:{
    backgroundImage: `url(${process.env.PUBLIC_URL +'/img.webp'})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'none',
    textAlign: 'center',
  },
  titulo:{
    color: 'white',
  },
  subTitulo:{
    color: '#BEBEBE',
  },
  input: {
    width: '100%',
    backgroundColor:'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    color:'black',
    marginBottom: 20,
  },
  inputText:{
      color:'#00688B',
  },
  loginTitle:{
    color:'#00688B',
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(1),
    backgroundColor: '#00688B',
    '&:hover': {
      backgroundColor: '#009ACD',
    },
    color: 'white'
  },
  registerText:{
    textDecoration: 'none',
  },
  login:{
    margin: theme.spacing(2, 10),
  },
  loading:{
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    top:0,
    left:0,
    bottom:0,
    right:0,
    textAlign: 'center'
  },
  error:{
    marginLeft: 5,
    marginRight: 5,
  }
  
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

function Register() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaConf, setSenhaConf] = useState("");
  const navigate = useHistory();
  const db = getDatabase();

  async function registerNew(){
    setLoading(true)
    if(senha !== senhaConf){
      setError("Senhas não batem!");
      setLoading(false)
      return;
    }
      await createUserWithEmailAndPassword(auth, email, senha).then(() => {
        set(ref(db,`/users/${auth.currentUser.uid}`),{
          email: email,
          senha: senha,
          adm: false,
        }).then(()=>{
            setLoading(false)
            alert("Conta criada com sucesso");
            navigate.push('/')
          })
      }).catch((error)=>{
            if(error.code == 'auth/email-already-in-use'){
              setLoading(false)
              setError("Este email ja está cadastrado! Caso esqueceu sua senha clique para recupera-la na tela de Login.");
            }
            if(error.code == 'auth/invalid-email'){
              setLoading(false)
              setError("Seu email é invalido!");
            }
            if(error.code == 'auth/operation-not-allowed'){
              setLoading(false)
              setError("OPERATION ERROR");
            }
            if(error.code == 'auth/weak-password'){
              setLoading(false)
              setError("Sua senha é muito fraca! Tente novamente com uma nova senha.");
            }
            
      })

  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSenhaChange = (event) => {
    setSenha(event.target.value);
  };
  const handlesenhaConfChange = (event) => {
    setSenhaConf(event.target.value);
  };

  return (
    <div>
      <Grid className={classes.root} container>
      <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className = {classes.backgroundImg}
          md={7}
          >
            <Typography variant="h4" className={classes.titulo}>O Grupo Connect Agradece!</Typography>
            <Typography variant="h6" className={classes.subTitulo}>Obrigado por criar sua conta em nosso site.</Typography>
        </Grid>
        <Grid container justifyContent="center" md={5}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
            <h2 className={classes.loginTitle}>Preencha com seus dados</h2>
            {error && 
              <Alert className={classes.error} severity="error">
                    <AlertTitle>Erro ao criar conta.</AlertTitle>
                    <strong>{error}</strong>
              </Alert>
            }
            <Box className={classes.login}>
                <CssTextField 
                    InputLabelProps={{className: classes.inputText}} 
                    InputProps={{className: classes.inputText}} 
                    className={classes.input} 
                    onChange={handleEmailChange}
                    size="small" id="nomeRegister" label="Email" variant="outlined"  
                />
                <CssTextField 
                    InputLabelProps={{className: classes.inputText}} 
                    InputProps={{className: classes.inputText}} 
                    className={classes.input} 
                    onChange={handleSenhaChange}
                    type="password" size="small" id="passwordRegister" label="Senha" variant="outlined" 
                />
                <CssTextField 
                    InputLabelProps={{className: classes.inputText}} 
                    InputProps={{className: classes.inputText}} 
                    className={classes.input} 
                    onChange={handlesenhaConfChange}
                    type="password" size="small" id="passwordConfRegister" label="Confirme sua Senha" variant="outlined" 
                />
            <Button
                    variant="contained"
                    className={classes.button}
                    type="submit"
                    onClick={registerNew}
                    >
                    Criar Conta
            </Button>
            {loading && <CircularProgress className={classes.loading} />}
            </Box>
            <p className={classes.inputText}><a className={classes.registerText} href="/login">Ja possui uma conta? Clique aqui</a></p>  
            <p className={classes.inputText}>Copyright © <a href="https://github.com/eduardoBalsamao">Eduardo</a></p>
          </Box>
        </Grid>
        
      </Grid>
    </div>
  );
}

export default Register;
