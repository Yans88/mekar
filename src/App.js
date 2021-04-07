import './App.css';

import React, { Component } from 'react';

import Main from '../src/components/main/Main'
import Login from '../src/components/login/Login';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

import PageLoading from './components/main/PageLoading';


const Banner = React.lazy(() => import('./banners/Banner'));
const News = React.lazy(() => import('./news/News'));
const FrmNews = React.lazy(() => import('./news/FrmNews'));
const Members = React.lazy(() => import('./members/Members'));
const Satgas = React.lazy(() => import('./members/Satgas'));
const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
}

class App extends Component {
  render() {
    return (
      <Router basename={getBasename()}>
        <Switch>
          <PublicRoute exact path="/login">
            <Login />
          </PublicRoute>

          <ProtectedRoute path="/">
            <Main>
              <React.Suspense fallback={<PageLoading />}>
                <Route exact path="/banners" component={Banner} />
                <Route exact path="/news" component={News} />
                <Route exact path="/add_news" component={FrmNews} />
                <Route exact path="/members" component={Members} />
                <Route exact path="/satgas" component={Satgas} />
              </React.Suspense>
            </Main>
          </ProtectedRoute>
          <Redirect from="*" to="/" />
          {/* <Route component={Main} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
