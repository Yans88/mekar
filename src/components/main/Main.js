import React, { useState, useEffect } from 'react';
import Header from './Header'
import MenuSidebar from './MenuSidebar'
import { connect } from 'react-redux';
import { GetProfileAdmin } from '../login/LoginService';
import PageLoading from './PageLoading';
import { useHistory } from 'react-router';


const Main = ({ onUserLoad, onUserLogout, children }) => {
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
    const history = useHistory();
    useEffect(() => {
        updateAppLoading(true);
        const fetchProfile = async () => {
            try {
                const response = await GetProfileAdmin();

                if (response.id_operator > 0) {
                    onUserLoad({ ...response });
                    updateAppLoading(false);
                } else {
                    onUserLogout();
                    history.push('/login');
                    updateAppLoading(false);
                }

            } catch (error) {
                updateAppLoading(false);
            }
        };
        fetchProfile();
        updateAppLoading(false);

        return () => { };
    }, [onUserLoad, onUserLogout, history]);


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
        dispatch({ type: "LOAD_USER", currentUser: user }),
    onUserLogout: () => dispatch({ type: "LOGOUT_USER" })
});

export default connect('', mapDispatchToProps)(Main);
