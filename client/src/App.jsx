import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import Admin from './pages/Admin/Admin';

import Header from './pages/commons/Header/Header';
import Home from './pages/Home/Home';
import NewPost from './pages/NewPost/NewPost';
import Post from './pages/Post/Post';
import Profile from './pages/Profile/Profile';
import SearchResult from './pages/SearchResult/SearchResult';
import Setting from './pages/Setting/Setting';
import Signin from './pages/Signin/Signin';
import './styles.scss';

function App(props) {
    const dispatch = useDispatch();

    const profile = JSON.parse(localStorage.getItem('profile'));
    useEffect(() => {
        if (profile) dispatch({ type: 'SIGNIN', payload: { ...profile } });
    }, [])

    const user = useSelector(state => state.user.authData) || JSON.parse(localStorage.getItem('profile'));

    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/user/signup'>
                    {user ? <Redirect to='/' /> : <Signin type='signup' />}
                </Route>
                <Route path='/user/signin'>
                    {user ? <Redirect to='/' /> : <Signin type='signin' />}
                </Route>
                <Route path='/user/admin'>
                    {user ? <Admin /> : <Redirect to='/user/signin' />}
                </Route>
                <Route path='/user/:uuid/:setting'>
                    {user ? <Setting /> : <Redirect to='/user/signin' />}
                </Route>
                <Route path='/user/:uuid'>
                    <Profile />
                </Route>
                <Route path='/post/search'>
                    <SearchResult />
                </Route>
                <Route path='/post/create'>
                    {user ? <NewPost /> : <Redirect to='/user/signin' />}
                </Route>
                <Route path='/post/:slug/edit'>
                    {user ? <NewPost /> : <Redirect to='/user/signin' />}
                </Route>
                <Route path='/post/:slug'>
                    <Post />
                </Route>
            </Switch>
        </Router>

    );
}

export default App;