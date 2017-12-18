import React from 'react';
import ReactDom from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Routers from './Router/Routers';
import {Provider} from 'react-redux';
import store from './Redux/store';

const app = document.getElementById('app');
ReactDom.render(<Provider store={store}>
    <Routers />
</Provider>, app);