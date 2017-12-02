import React from 'react';

import Header from '../Pages/Header';
import Footer from '../Pages/Footer';
import TrackPlayer from '../Component/TrackPlayer';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import store from '../Redux/store';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import Tracks from '../Pages/Tracks';
import Track from '../Pages/Track';

export default class Routers extends React.Component {

    async setInitialTrackState() {
        // Fetch the user last known track
        const response = await axios.get(getApiUrl('api', '/me?'));
        const body = response.data;
        const trackID = body.history.trackID;
        // Get the track info
        const trackResponse = await axios.get(getApiUrl('api', `/track/${trackID}?`));
        store.dispatch({
            type: 'UPDATE_TRACK_DETAILS',
            payload: {
                trackId: trackID,
                title: trackResponse.data.title,
                author_username: trackResponse.data.author.username,
                playitnow: false,
            }
        });
    }

    render() {
        this.setInitialTrackState();
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