import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Header from './pages/commons/Header/Header';
import NewPost from './pages/NewPost/NewPost';
import Post from './pages/Post/Post';
import Profile from './pages/Profile/Profile';
import Signin from './pages/Signin/Signin';
import './styles.scss';

function App(props) {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path='/'>
                    <Profile />
                </Route>
                <Route path='/user/signup'>
                    <Signin type='signup' />
                </Route>
                <Route path='/user/signin'>
                    <Signin type='signin' />
                </Route>
                <Route path='/post/create-post'>
                    <NewPost />
                </Route>
                <Route path='/post/:slug'>
                    <Post />
                </Route>
            </Switch>
        </Router>

    );
}

export default App;