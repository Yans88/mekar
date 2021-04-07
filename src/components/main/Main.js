import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header'
import MenuSidebar from './MenuSidebar'

import { connect } from 'react-redux';
import { getProfileAdmin } from '../login/LoginService';

import PageLoading from './PageLoading';


const Main = ({ onUserLoad, children }) => {

    const [appLoadingState, updateAppLoading] = useState(false);
    const [menuCollapse, setMenuCollapse] = useState(false)
    const [menusidebarState, updateMenusidebarState] = useState({
        isMenuSidebarCollapsed: false
    });

    const toggleMenuSidebar = () => {
        updateMenusidebarState({
            isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
        });
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };

    useEffect(() => {
        updateAppLoading(true);
        const fetchProfile = async () => {
            try {
                const response = await getProfileAdmin();
                onUserLoad({ ...response });
                updateAppLoading(false);
            } catch (error) {
                updateAppLoading(false);
            }
        };
        fetchProfile();
        updateAppLoading(false);
        return () => { };
    }, [onUserLoad]);

    document.getElementById('root').classList.remove('login-page');
    document.getElementById('root').classList.remove('hold-transition');
    document.getElementById('root').classList.add('bg-sidebar');
    document.getElementById('root').className += ' sidebar-mini';

    if (menusidebarState.isMenuSidebarCollapsed) {

        document.getElementById('root').classList.add('sidebar-collapse');
        document.getElementById('root').classList.remove('sidebar-open');
        document.getElementById('root').classList.add('active');
    } else {
        document.getElementById('root').classList.remove('active');
        document.getElementById('root').classList.add('sidebar-open');
        document.getElementById('root').classList.remove('sidebar-collapse');
    }

    let template;
    const getBasename = path => path.substr(0, path.lastIndexOf('/'));
    if (appLoadingState) {

        template = (
            <>
                <Header toggleMenuSidebar={toggleMenuSidebar} />
                <MenuSidebar toggleMenuSidebar={toggleMenuSidebar} menuCollapse={menuCollapse} />
                <PageLoading />
            </>
        );
    } else {
        template = (
            <>

                <Header toggleMenuSidebar={toggleMenuSidebar} />
                <MenuSidebar toggleMenuSidebar={toggleMenuSidebar} menuCollapse={menuCollapse} />

                {children}
            </>
        );
    }

    return template;
};


const mapDispatchToProps = (dispatch) => ({
    onUserLoad: (user) =>
        dispatch({ type: "LOAD_USER", currentUser: user })
});

export default connect('', mapDispatchToProps)(Main);
