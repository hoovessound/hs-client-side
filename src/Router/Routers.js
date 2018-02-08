import React from 'react';

import Header from '../Pages/Header';
import Footer from '../Pages/Footer';
import Logout from '../Pages/Logout';
import TrackPlayer from '../Component/TrackPlayer';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import store from '../Redux/store';
import * as checkLogin from '../Util/checkLogin';

import {
    BrowserRouter,
    Route,
} from 'react-router-dom';

import Tracks from '../Pages/Tracks';
import Track from '../Pages/Track';
import Favorite from '../Pages/Favorite';
import Profile from '../Pages/Profile';
import Upload from '../Pages/Upload';
import Doodle from '../Pages/Doodle';
import DoodleSubmit from "../Pages/DoodleSubmit";
import PlaylistPage from "../Pages/PlaylistPage";
import PlaylistCollections from "../Pages/PlaylistCollections";
import Search from "../Pages/Search";

let setInitUserStack = false;

let stopFetching = false;

export default class Routers extends React.Component {
    async setInitialTrackState() {

        async function getUserHistory(trackID) {
            if (!setInitUserStack) {
                if(!stopFetching){
                    const response = await axios.get(getApiUrl('api', `/track/${trackID}?`));
                    const track = response.data;
                    store.dispatch({
                        type: 'UPDATE_TRACK_DETAILS',
                        payload: {
                            trackId: trackID,
                            title: track.title,
                            author_username: track.author.username,
                            author_fullname: track.author.fullname,
                            coverArt: track.coverImage,
                            playitnow: false,
                            isHistory: true,
                        }
                    });
                }
            }
        }

        async function getLatestTrackInfo() {
            if (!setInitUserStack) {
                if(!stopFetching){
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
            }
        }

        if (checkLogin.isLogin()) {

            store.subscribe(() => {
                const user = store.getState().User;

                // Check if the user have an history

                if (user.history) {
                    const trackID = user.history.trackID;
                    // Get the track info
                    getUserHistory(trackID)
                    .then(() => {
                        setInitUserStack = true;
                    })
                    .catch(error => {
                        console.log(error);
                        getLatestTrackInfo()
                        .then(() => {
                            setInitUserStack = true;
                        });
                        stopFetching = true;
                    });
                    stopFetching = true;
                } else {
                    // User is new, and have no history before
                    getLatestTrackInfo()
                    .then(() => {
                        setInitUserStack = true;
                    });
                    stopFetching = true;
                }
            });

        } else {
            getLatestTrackInfo()
            stopFetching = true;
        }


    }

    render() {
        this.setInitialTrackState();
        return (
            <BrowserRouter>
                <div>
                    <Route component={Header}/>
                    <div
                        className="container"
                        style={{
                            marginBottom: '6em',
                            marginTop: '6.5em',
                        }}
                    >
                        <Route exact path="/" component={Tracks}/>
                        <Route path="/track/:id" component={Track}/>
                        <Route path="/favorite" component={Favorite}/>
                        <Route path="/@:username" component={Profile}/>
                        <Route path="/upload" component={Upload}/>
                        <Route exact path="/doodle" component={Doodle}/>
                        <Route exact path="/doodle/submit" component={DoodleSubmit}/>
                        <Route exact path="/playlist/:id" component={PlaylistPage}/>
                        <Route exact path="/playlist" component={PlaylistCollections}/>
                        <Route exact path="/search/:query" component={Search}/>
                        <Route path="/logout" component={Logout}/>
                        <Route component={Footer}/>
                    </div>
                    <Route component={TrackPlayer}/>
                </div>
            </BrowserRouter>
        )
    }
}