import React, { useEffect, useState } from 'react';
import LogoAndSearch from '../components/LogoAndSearch/LogoAndSearch';
import { useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';

import { useWindowHeightAndWidth } from '../custom/useWindowHeightAndWidth';
import './styles.sass';
import logo from './logo.jpg';
import mobileLogo from './mobile-logo.jpg';
import NavBar from './NavBar/NavBar';
import SmallNavBar from './SmallNavBar/SmallNavBar';
import { useDispatch, useSelector } from 'react-redux';

function Header(props) {
    const [height, width] = useWindowHeightAndWidth();
    const signinUser = useSelector(state => state.user.authData)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        dispatch({type: 'RESET_POSTS'})
        history.push('/user/signin');
        setUser(null)
    }

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) {
                handleLogout();
            }
        }
        //JWT...

        setUser(signinUser)
    }, [location, signinUser])
    return (
        <>
            <header className="header shadow">
                <div className="header--inner">
                    <LogoAndSearch logoComponent={width > 767 ? logo : mobileLogo} position="header" />
                    {width >= 1025 ? <NavBar user={user} handleLogout={handleLogout} /> : <SmallNavBar user={user} handleLogout={handleLogout} />}
                </div>
            </header>
        </>
    );
}

export default Header;