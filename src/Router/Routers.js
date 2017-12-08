import React from 'react';

import Header from '../Pages/Header';
import Footer from '../Pages/Footer';
import Logout from '../Pages/Logout';
import TrackPlayer from '../Component/TrackPlayer';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import store from '../Redux/store';
import checkLogin from '../Util/checkLogin';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import Tracks from '../Pages/Tracks';
import Track from '../Pages/Track';
import Favorite from '../Pages/Favorite';

export default class Routers extends React.Component {

    async setInitialTrackState() {
        // Fetch the user last known track
        const response = await axios.get(getApiUrl('api', '/me?'));
        const body = response.data;
        const trackID = body.history.trackID;
        if (trackID) {
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
        } else {
            const response = await axios.get(getApiUrl('api', '/tracks?offset=0'))
            store.dispatch({
                type: 'UPDATE_TRACK_DETAILS',
                payload: {
                    trackId: response.data[0].id,
                    title: response.data[0].title,
                    author_username: response.data[0].author.username,
                    playitnow: false,
                }
            });
        }
    }

    render() {
        this.setInitialTrackState();
        if(checkLogin()){
            return (
                <Router>
                    <div>
                        <Route component={Header}/>
                        <Route exact path="/" component={Tracks}></Route>
                        <Route path="/track/:id" component={Track}></Route>
                        <Route path="/favorite" component={Favorite}></Route>
                        <Route path="/logout" component={Logout}></Route>
                        <Route component={TrackPlayer}/>
                        <Route component={Footer}/>
                    </div>
                </Router>
            )
        }else{
            return (
                <h1>You have to login before you continue this action.</h1>
            )
        }
    }
}