import React from 'react';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import Tracks from '../Pages/Tracks';
import Track from '../Pages/Track';

export default class Routers extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Tracks}></Route>
                    <Route path="/track/:id" component={Track}></Route>
                </div>
            </Router>
        )
    }
}