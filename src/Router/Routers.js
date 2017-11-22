import React from 'react';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import Layout from '../Pages/Layout';

export default class Routers extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" component={Layout}></Route>
            </Router>
        )
    }
}