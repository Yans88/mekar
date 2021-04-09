import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import bannerReducer from './reducers/bannerReducer';
import newsReducer from './reducers/newsReducer';
import membersReducer from './reducers/membersReducer';
import settingReducer from './reducers/settingReducer';
import pengaduanReducer from './reducers/pengaduanReducer';
import masterKasus from './reducers/mKasusReducer';
import adminReducer from './reducers/adminReducer';
import authReducer from './reducers/auth';

const rootReducer = combineReducers({
    banners: bannerReducer,
    news: newsReducer,
    members: membersReducer,
    setting: settingReducer,
    pengaduan: pengaduanReducer,
    masterKasus: masterKasus,
    admin: adminReducer,
    auth: authReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
    // other store enhancers if any
);

/* for development */
const store = createStore(rootReducer, enhancer);

/* for production */
//const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;