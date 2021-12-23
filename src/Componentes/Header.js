/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React,{useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import {Typography, IconButton,Menu, MenuItem} from '@material-ui/core';
import {useAuth} from '../context/AuthContext';
import { getDatabase, ref, onValue} from "firebase/database";
import { useHistory  } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import AddBoxIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    titulo:{
        color: 'white',
    },

    toolbar:{
        backgroundColor: '#4682B4',
        flexDirection: 'row-reverse',
    },
    img:{
        width: 60,
        height: 60,
        marginRight: 10,
        marginTop: 5
    },
    grow:{
        flexGrow: 1
    },
    buttonC:{
        color: '#ffff',
        borderColor: '#ff2400',
        backgroundColor: '#ff2400',
        '&:hover': {
            backgroundColor:'#AD0000',
        },
        marginRight: 15
    },
    margin:{
        marginLeft: 5
    }
})

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

function Header() {
    const classes = useStyles();
    const navigate = useHistory();
    const {logout, currentUser} = useAuth();
    const [adm, setAdm] = useState();
    const db = getDatabase(); //Referencia papra o Banco de dados
    const admRef = ref(db, `/users/${currentUser.uid}/adm`) //Referencia para o adm no usuario

    //Função que faz o logout
    async function handleLogout() {
        await logout()
    }


    const [anchorEl, setAnchorEl] = React.useState(null); //State para abrir o menu
    //Abre o menu
    const handleClick = (event) => { 
        setAnchorEl(event.currentTarget);
    };
    
    //Fecha o menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    //Acontece quando a tela inicia
    useEffect(() => {
        onValue(admRef,(snapshot)=>{
              if(snapshot.val() == false){
                  setAdm(false)
              } if(snapshot.val() == true){
                  setAdm(true)
              }
          })
    
       }, [])

  return (
    <div className={classes.root}>
        <AppBar position="static" color="transparent">
            <Toolbar className={classes.toolbar} variant="dense" position="static" color="transparent">
                <Link href="/"> <img className={classes.img} src={process.env.PUBLIC_URL +'/logo.png'} alt="Logo" /></Link>
                <div className={classes.grow}></div>
                <Typography variant="h6" className={classes.titulo}>Grupo Connect</Typography>
                <div className={classes.grow}></div>
                <IconButton 
                    edge="start" 
                    className={classes.menuButton} 
                    color="inherit" 
                    aria-label="menu"
                    onClick={handleClick}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                >
                    <MenuIcon />
                </IconButton>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={()=>{navigate.push("/")}}>
                        <HomeIcon color="primary" />
                        <span className={classes.margin}>Home</span>
                    </MenuItem>

                    <MenuItem onClick={()=>{navigate.push("/add")}}>
                        <AddBoxIcon color="primary" />
                        <span className={classes.margin}>Adicionar Novo Dispositivo</span>
                    </MenuItem>

                    {adm && <MenuItem onClick={()=>{navigate.push("/admin")}}>
                        <SettingsIcon color="primary" />
                        <span className={classes.margin}>Tela do Admin</span>
                    </MenuItem>}
                    
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon color="primary" />
                        <span className={classes.margin}>Logout</span>
                    </MenuItem>
                </StyledMenu>
            </Toolbar>
        </AppBar>
    </div>
  );
}

export default Header;