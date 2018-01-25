import React from 'react';
import ReactDom from 'react-dom';
import Routers from './Router/Routers';
import {Provider} from 'react-redux';
import store from './Redux/store';
import {unregister} from "./registerServiceWorker";
import skygear from 'skygear';

skygear.config({
    'endPoint': 'https://hoovessound.skygeario.com/', // trailing slash is required
    'apiKey': 'e85bab9ff9a5403e851170dfd2731364',
}).then(container => {
    return true;
}, (error) => {
    console.error(error);
});

const app = document.getElementById('app');
ReactDom.render(<Provider store={store}>
    <Routers />
</Provider>, app);
unregister();