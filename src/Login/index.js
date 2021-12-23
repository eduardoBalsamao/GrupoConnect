import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Box, TextField, Button, CircularProgress, Avatar  } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useAuth } from '../context/AuthContext';
import {googleProvider} from '../firebase'
import { useHistory  } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';


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
    color: 'white',
  },
  registerText:{
    textDecoration: 'none',
  },
  login:{
    margin: theme.spacing(2, 10),
    alignItems: 'center'
  },
  img:{
    width: 100,
    height: 100,
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
  google:{
    width: '100%',
    marginTop: theme.spacing(1),
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'black',
    textTransform: 'none',
  },
  avatarMargin:{
    
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

function Login() {
  const classes = useStyles();
  const navigate = useHistory();
  const [emailLogin, setEmailLogin] = useState(""); //Status que armazena o email
  const [senhaLogin, setSenhaLogin] = useState(""); //Status que armazena a senha
  const [error, setError] = useState(""); //Status que armazena o erro
  const [loading, setLoading] = useState(false); //Statos que seta o loading
  const { login, googleLogin } = useAuth() //Funções usadas no context

  //Função que recolhe email do input
  const handleEmailLoginChange = (event) => {
    setEmailLogin(event.target.value);
  };

  //Função que recolhe senha do input
  const handleSenhaLoginChange = (event) => {
    setSenhaLogin(event.target.value);
  };

  //Função que faz login
  async function fazerLogin(){
    setLoading(true)
    if(emailLogin === ""){
      setError("Campos não podem ser vazios")
      setLoading(false)
    }
    if(senhaLogin === ""){
      setError("Campos não podem ser vazios")
      setLoading(false)
    }
      try {
      await login(emailLogin, senhaLogin)
      setLoading(false)
      alert("Bem vindo ao Connect");
      navigate.push('/')
      } catch (e) {
        setLoading(false)
        setError("Senha ou usuario incorretos");
      }
   
  }

  //Função que faz login com o google
  async function loginGoogle(){
    var provider = googleProvider;
    provider.setCustomParameters({
      'display': 'popup'
    });
    try {
      await googleLogin(provider)
      navigate.push('/')
      } catch (e) {
        setError("Erro ao logar com o google");
      }
  }
  
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
            <img className={classes.img} src={process.env.PUBLIC_URL +'/logo.png'} alt="Logo" />
            <Typography variant="h4" className={classes.titulo}>Grupo Connect</Typography>
            <Typography variant="h6" className={classes.titulo}>Facilitando sua interação com a Tecnologia.</Typography>
        </Grid>
        <Grid container justifyContent="center" md={5}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            
            <Typography variant="h5" className={classes.loginTitle}>Bem Vindo</Typography>
            {error && 
              <Alert className={classes.error} severity="error">
                    <AlertTitle>Erro ao realizar login.</AlertTitle>
                    <strong>{error}</strong>
              </Alert>
            }
            <Box className={classes.login}>
              <CssTextField 
                  InputLabelProps={{className: classes.inputText}} 
                  InputProps={{className: classes.inputText}} 
                  className={classes.input} 
                  onChange={handleEmailLoginChange}
                  size="small" id="emailLogin" label="Email" variant="outlined"  
              />
              <CssTextField 
                  InputLabelProps={{className: classes.inputText}} 
                  InputProps={{className: classes.inputText}} 
                  className={classes.input} 
                  onChange={handleSenhaLoginChange}
                  type="password" size="small" id="passwordLogin" label="Senha" variant="outlined" 
              />
            <Button
                    variant="contained"
                    className={classes.button}
                    type="submit"
                    onClick={fazerLogin}
                  >
                    Entrar
            </Button>
            <Button
              variant="contained"
              className={classes.google}
              onClick={() => { loginGoogle() }}
              startIcon={<Avatar alt="Login com Google" className={classes.avatarMargin} src="google.png" />}
            > Fazer login com Google
            </Button>
            
            </Box>
            <p className={classes.inputText}><a className={classes.registerText} href="/register">Não tem uma conta? Clique aqui</a></p>          
            <p className={classes.inputText}>Copyright © <a href="https://github.com/eduardoBalsamao">Eduardo</a></p>
          </Box>
        </Grid>
      </Grid>
      {loading && <CircularProgress className={classes.loading} />}
    </div>
  );
}

export default Login;
