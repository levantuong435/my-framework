import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {Router, browserHistory, useRouterHistory} from 'react-router';
import {createHistory} from 'history';
import {syncHistoryWithStore, routerMiddleware, push} from 'react-router-redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import loggerMiddleware from '../common/middlewares/logger';
import {DEFAULT_URL} from '../common/config';
import {USER_PATIENT_AUTH_LOGIN} from '../user/types';

const customHistory = useRouterHistory(createHistory)({
	basename: DEFAULT_URL
});

const routingMiddleware = routerMiddleware(customHistory);
const createStoreWithMiddleware = applyMiddleware(reduxThunk, loggerMiddleware, routingMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers);
const history = syncHistoryWithStore(customHistory, store);

const token = localStorage.getItem('patient_token');
if(token){
	const email = localStorage.getItem('email');
	const name = localStorage.getItem('name');

	store.dispatch({type: USER_PATIENT_AUTH_LOGIN, payload: {email, name, authenticate: true} });
}

import routes from './routes';

/*import LoginComponent from './components/auth/login';*/
ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			{routes}
		</Router>
	</Provider>
, document.getElementById('app'));