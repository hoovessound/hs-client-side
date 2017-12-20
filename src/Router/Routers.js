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
import Profile from '../Pages/Profile';
import Upload from '../Pages/Upload';
import Doodle from '../Pages/Doodle';

let setInitUserStack = false;

export default class Routers extends React.Component {
    async setInitialTrackState() {

        store.subscribe(() => {
            const user = store.getState().User;
            // Get the user last known track
            const trackID = user.history.trackID;
            if(!setInitUserStack){
                if(trackID){
                    // Get the track info
                    async function getTrackInfo(trackId) {
                        const response = await axios.get(getApiUrl('api', `/track/${trackId}?`));
                        const track = response.data;

                        store.dispatch({
                            type: 'UPDATE_TRACK_DETAILS',
                            payload: {
                                trackId,
                                title: track.title,
                                author_username: track.author.username,
                                author_fullname: track.author.fullname,
                                coverArt: track.coverImage,
                                playitnow: false,
                                isHistory: true,
                            }
                        });
                    }
                    getTrackInfo(trackID);
                }else{
                    async function getLatestTrackInfo() {
                        const response = await axios.get(getApiUrl('api', '/tracks?offset=0'))
                        store.dispatch({
                            type: 'UPDATE_TRACK_DETAILS',
                            payload: {
                                trackId: response.data[0].id,
                                title: response.data[0].title,
                                author_username: response.data[0].author.username,
                                author_fullname: response.data[0].author.fullname,
                                coverArt: response.data[0].coverImage,
                                playitnow: false,
                            }
                        });
                    }
                    getLatestTrackInfo();
                }
                setInitUserStack = true;
            }
        })
    }

    render() {
        if(checkLogin()){
            this.setInitialTrackState();
            return (
                <Router>
                    <div>
                        <Route component={Header}/>
                        <div
                            className="container"
                            style={{
                                marginBottom: '6em',
                                marginTop: '6.5em',
                            }}
                        >
                            <Route exact path="/" component={Tracks}></Route>
                            <Route path="/track/:id" component={Track}></Route>
                            <Route path="/favorite" component={Favorite}></Route>
                            <Route path="/profile" component={Profile}></Route>
                            <Route path="/upload" component={Upload}></Route>
                            <Route path="/doodle" component={Doodle}></Route>
                            <Route path="/logout" component={Logout}></Route>
                            <Route component={Footer}/>
                        </div>
                        <Route component={TrackPlayer}/>
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