import React from 'react';
import ReactDom from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Routers from './Router/Routers';
const app = document.getElementById('app');
ReactDom.render(<Routers />, app);
registerServiceWorker();