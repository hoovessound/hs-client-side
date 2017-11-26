import React from 'react';

import Header from '../Pages/Header';
import Footer from '../Pages/Footer';
import TrackPlayer from '../Component/TrackPlayer';

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
                    <Route component={Header}/>
                    <Route exact path="/" component={Tracks}></Route>
                    <Route path="/track/:id" component={Track}></Route>
                    <Route component={TrackPlayer}/>
                    <Route component={Footer}/>
                </div>
            </Router>
        )
    }
}