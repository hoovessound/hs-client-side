import React from 'react';
import ReactDom from 'react-dom';
import Routers from './Router/Routers';
import {Provider} from 'react-redux';
import store from './Redux/store';
import {unregister} from "./registerServiceWorker";

const app = document.getElementById('app');
ReactDom.render(<Provider store={store}>
    <Routers />
</Provider>, app);
unregister();