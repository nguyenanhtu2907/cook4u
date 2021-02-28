import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
    container_full: {
        padding: 0,
    },
    appBar: {
        backgroundColor: '#ffffff',
        height: '64px',
    },
    content:{
        width: '80%',
        margin: 'auto',

    },
    logo: {
        height: '64px',
        // marginLeft: '10px',
    },
    link: {
        textDecoration: 'none',
    },
    move:{
        position: 'relative',
        top: '30px',
    },
}));