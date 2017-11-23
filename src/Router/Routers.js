import React from 'react';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import Tracks from '../Pages/Tracks';

export default class Routers extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" component={Tracks}></Route>
            </Router>
        )
    }
}