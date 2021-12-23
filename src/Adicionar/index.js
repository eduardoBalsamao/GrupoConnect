import React, {useState} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { TextField, Button} from '@material-ui/core';
import Header from '../Componentes/Header'
import {useAuth} from '../context/AuthContext';
import { useHistory  } from 'react-router-dom';

//Imports Firebase
import { getDatabase, ref, onValue, set, update, query, orderByChild, equalTo, get} from "firebase/database";

 
const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
    },
    test:{
      backgroundColor: 'red'
    },
    input: {
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
    buttonV: {
      width: '100%',
      marginTop: theme.spacing(1),
      color: 'white'
    },
    tutorial:{
        marginTop: 20
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


  function Adicionar() {
    const classes = useStyles();
    const {currentUser} = useAuth();
    const navigate = useHistory();
    const [mainState, setMainState] = useState(true); //State usado para marcar o "inicio", TRUE => mostra input "CODE";
    const [newState, setNewState] = useState(false); //Usado para marcar "Adicionar Produto Novo", TRUE => mostra inputs "NOME" e "SENHA"
    const [passwordState, setPasswordState] = useState(false); //Usado para marcar "Add Protudo Registrado", TRUE => mosta input "SENHA"
    const [passwordStateTittle, setPasswordStateTittle] = useState(false); //Usado para settar o titulo na "Add Protudo Registrado"

    
    const [code, setCode] = useState(); //State para o codigo
    const [name, setName] = useState(); ///State para o nome caso ja exista
    const [password, setPassword] = useState(); //State para a senha caso ja exista
    const [newName, setNewName] = useState(); //State para o novo nome caso seja 1º registro
    const [newPassword, setNewPassword] = useState(); //State para a nova senha caso 1º seja registro

    const db = getDatabase(); //Pega a referencia do banco de dados do Firebase

    //Funções que pegam a variavel do input -- INICIO --
    const handleCodeChange = (event) => {
      setCode(event.target.value); 
    };
    const handleNameChange = (event) => {
      setNewName(event.target.value);
    };
    const handleSenhaChange = (event) => {
      setNewPassword(event.target.value);
    };
    //Funções que pegam a variavel do input -- FIM --

    //Função que verificac se o código que foi digitado existe.
    function checkTextInput() {
      get(ref(db, `/Torneiras/${code}`)).then((snapshot) => {
        if(!snapshot.exists()){
          alert("Codigo invalido")
        }
        get(ref(db, `/users/${currentUser.uid}/Torneiras/${code}`)).then((snapshot) => {
          if(snapshot.exists()){
            alert("Esse produto ja está vinculado a sua conta")
          }else{
            exist(code)
          }
        })
      })
      if (code == null) {
        alert('Erro ao fazer Registro: campo código vazio');
        return;
      }   
    }
    
    //Setta a state "mainState" = TRUE e as outra = FALSE
    const voltar = () => {
      setMainState(true)
      setNewState(false)
      setPasswordState(false)
      setPasswordStateTittle(false)

    }

    //Função principal que faz a tela funcionar.
    //Ela faz a verificação se o produto ja foi registrado ou não e aciona as telas!
    function exist (codeParam) {
      const pRef = query(ref(db, `/Torneiras`), orderByChild('code')) //Referencia dos produtos ordenados pelo codigo
      const eqtRef = query(pRef, equalTo(codeParam)) //Referencia dos produtos que tem o codigo igual ao codigo fornecido como parametro 

      onValue(eqtRef, (snapshot)=>{
        snapshot.forEach(item=>{
          if(item.val().senha === " "){ //Caso a senha seja vazio, ou seja, o produto ainda não foi registrado!
            setMainState(false) 
            setNewState(true) //State new é setado como true  => "Add Produto Novo"
            setPasswordState(true)

          }else{
            setMainState(false)
            setPasswordState(true)
            setPasswordStateTittle(true)
            setPassword(item.val().senha)
            setName(item.val().nome)
            
          }
        })

      })
    }

    //Registra o produto na conta do usuaro de acordo com o que ele definiu!
    function addNew(){
      set(ref(db, `/users/${currentUser.uid}/Torneiras/${code}`), {
        code: code,
        nome: newName,
        senha: newPassword,
        status: 0
      }).then(() => {
        update(ref(db, `/Torneiras/${code}`), {
          nome: newName,
          senha: newPassword,
        });
        alert('Sucesso!! Produto adicionado com sucesso');
        navigate.push('/')
      });
    }

    //Registra o produto que ja estava cadastrado antes na conta de um novo usuario!
    async function addExistent(){
      if(newPassword === password){
        set(ref(db, `/users/${currentUser.uid}/Torneiras/${code}`), {
          code: code,
          nome: name,
          senha: newPassword,
          status: 0
        }).then(() => {
          alert('Sucesso!! Produto adicionado com sucesso');
          navigate.push('/')
        })
        
      } else{
        alert("Senha incorreta")
      }
    }
  


    return (
        <div className={classes.root} >
            <Header />
            <Grid container justifyContent="center" alignItems="center">
                {mainState &&<h3 className={classes.loginTitle}>Adicionar novo Dispositivo</h3>}
                {newState && <h3 className={classes.loginTitle}>Produto novo defina um nome e uma senha</h3>}
                {passwordStateTittle && <h3 className={classes.loginTitle}>Produto ja cadastrado informe a senha</h3>}
                <Grid item xs={11} >
                {mainState && <CssTextField 
                  fullWidth
                  InputLabelProps={{className: classes.inputText}} 
                  InputProps={{className: classes.inputText}} 
                  className={classes.input} 
                  onChange={handleCodeChange}
                  size="small" id="code" label="Código" variant="outlined"  
                />}
                {newState && <CssTextField 
                  fullWidth
                  InputLabelProps={{className: classes.inputText}} 
                  InputProps={{className: classes.inputText}} 
                  className={classes.input} 
                  onChange={handleNameChange}
                  size="small" id="name" label="Nome" variant="outlined"  
                />}
                {passwordState && <CssTextField 
                  fullWidth
                  InputLabelProps={{className: classes.inputText}} 
                  InputProps={{className: classes.inputText}} 
                  className={classes.input} 
                  onChange={handleSenhaChange}
                  size="small" id="password" label="Senha" variant="outlined"  type="password"
                />}
                
                {mainState && <Button
                        variant="contained"
                        className={classes.button}
                        type="submit"
                        onClick={checkTextInput}
                    >
                        Adicionar
                </Button>}

                {newState && <Button
                        variant="contained"
                        className={classes.button}
                        onClick={addNew}
                    >
                        Adicionar Novo
                </Button>}

                {passwordStateTittle && <Button
                        variant="contained"
                        className={classes.button}
                        type="submit"
                        onClick={addExistent}
                    >
                        Adicionar Existente
                </Button>}

                {!mainState && <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    className={classes.buttonV}
                    onClick={voltar}
                  >
                    Voltar
                </Button>}
                </Grid>
            </Grid>
            <Grid className={classes.tutorial} container justifyContent="center">
                <Grid item xs={10}>
                    <h3 className={classes.loginTitle}>Instruções:</h3>
                    {mainState && <p>Procure na lateral da embalagem o código, digite-o no campo acima e siga os proximos passos.</p>}
                    {passwordStateTittle && <p>Esse produto ja foi registrado, digite a senha cadastrada. Se isso for um erro faça contato conosco.</p>}
                    {newState && <p>Esse é o primeiro registro do produto, ecolha um nome e uma senha. Essa senha deverá ser fornecida caso deseje compartilhar o dispositivo com sua familia.</p>}
                </Grid>
            </Grid>
            
        </div>
    )
}

export default Adicionar;
