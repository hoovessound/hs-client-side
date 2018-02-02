/* eslint-disable */

import React from 'react';
import '../css/TrackPlayer.css';
import '../css/includes/TrackPlayer_TimeStamp.css'
import store from '../Redux/store';
import {Link} from 'react-router-dom';
import getApiUrl from '../Util/getApiUrl';
import axios from 'axios';
import * as checkLogin from '../Util/checkLogin';
import TrackPlayerEvent from "../Flux/TrackPlayerEvent";

const audio = new Audio();
let updateLastPlayEvent;
let showTimeEvent;
let oldTitle = document.title;
let playlistIndex = 0;

let updateTimeEvent;

let initPlay = false;

let setHistory = true;

export default class TrackPlayer extends React.Component {

    constructor() {
        super();
        this.state = {
            MusicPlayer: {},
            playlist: {
                index: 0,
                stack: [],
            },
            load: 0,
        };
    }

    hotKey(evt) {
        const active = document.activeElement;
        const charCode = evt.which || evt.charCode || evt.keyCode || 0;
        let action = true;
        // Check if the element is an input or textarea field
        if(active.tagName === 'INPUT' || active.tagName === 'TEXTAREA'){
            // Check if the input element have an ID call #time
            if(active.id !== 'time'){
                action = false;
            }
        }

        if(action){
            evt.preventDefault();
            if (charCode === 32) {
                // Space bar
                this.playMusic();
            }

            if (charCode === 77) {
                // M
                this.mute();
            }

            if(charCode === 37){
                // Left arrow
                this.goBackward();
            }

            if(charCode === 39){
                // Right arrow
                this.goForward();
            }
        }
    }

    goBackward(){
        audio.currentTime = (audio.currentTime - 5);
    }

    goForward(){
        audio.currentTime = (audio.currentTime + 5);
    }

    componentDidMount() {

        window.onkeydown = (event) => this.hotKey(event);
        audio.ontimeupdate = () => this.updateTimeStamp();

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                this.playMusic();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                this.playMusic();
            });
            navigator.mediaSession.setActionHandler('seekbackward', () => {
                this.goBackward();
            });
            navigator.mediaSession.setActionHandler('seekforward', () => {
                this.goForward();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                this.goBackfardPlaylist();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                this.goForwardPlaylist();
            });
        }

        if(checkLogin.isLogin()){
            navigator.sendBeacon = navigator.sendBeacon || function () {
                axios.post(getApiUrl('api', `/events?`), {
                    event: 'UPDATE_LAST_PLAY',
                    payload: {
                        volume: 100,
                        trackID: store.getState().MusicPlayer.trackId,
                        playtime: {
                            currentTime: audio.currentTime,
                            duration: audio.duration,
                        },
                        isPlaying: !audio.paused,
                    }
                });
            };
        }

        TrackPlayerEvent.on('update', () => {
            this.playMusic();
        });

        store.subscribe(() => {
            const MusicPlayer = store.getState().MusicPlayer;
            if(setHistory){
                if (MusicPlayer.isHistory) {
                    const User = store.getState().User;
                    // Track is come from the user's history

                    // Set the correct timestamp and volume

                    audio.currentTime = User.history.playtime.currentTime;
                    this.refs.time.max = User.history.playtime.duration;
                    this.refs.time.value = User.history.playtime.currentTime;
                    this.refs.timeLoad.max = User.history.playtime.duration;
                    this.refs.timeLoad.value = User.history.playtime.currentTime;
                    setHistory = false;
                }
            }

            // If the data contain coverImage, than use the coverImage

            if (MusicPlayer.coverImage) {
                MusicPlayer.coverArt = MusicPlayer.coverImage;
                delete MusicPlayer.coverImage;
            }

            this.setState({
                MusicPlayer,
            });
        });
    }

    goForwardPlaylist(){
        const localPlaylist = store.getState().LocalPlayList.tracks;
        playlistIndex = (playlistIndex + 1);
        const track = localPlaylist[parseInt(playlistIndex, 10)];
        store.dispatch({
            type: 'UPDATE_TRACK_DETAILS',
            payload: {
                trackId: track.id,
                title: track.title,
                author_username: track.author.username,
                author_fullname: track.author.fullname,
                coverArt: track.coverImage,
                playitnow: true,
            }
        });
        this.updateLastPlay();
        this.playMusic();
    }

    goBackfardPlaylist(){
        const localPlaylist = store.getState().LocalPlayList.tracks;
        playlistIndex = (playlistIndex - 1);
        const track = localPlaylist[parseInt(playlistIndex, 10)];
        store.dispatch({
            type: 'UPDATE_TRACK_DETAILS',
            payload: {
                trackId: track.id,
                title: track.title,
                author_username: track.author.username,
                author_fullname: track.author.fullname,
                coverArt: track.coverImage,
                playitnow: true,
            }
        });
        this.updateLastPlay();
        this.playMusic();
    }

    playMusic() {
        const track = store.getState().MusicPlayer;
        const trackId = track.trackId;
        const source = getApiUrl('stream', `/${trackId}?`);
        const localPlaylist = store.getState().LocalPlayList.tracks;

        if (audio.src !== source) {
            // Set the correct playlist index

            for(let key in localPlaylist){
                // Look for the index
                const id = localPlaylist[key].id;
                if(id === trackId){
                    playlistIndex = parseInt(key, 10);
                }
            }

            initPlay = true;
            // A new audio source
            audio.src = source;
            this.refs.time.value = 0;
            this.refs.timeLoad.value = 0;
            audio.onloadedmetadata = () => {
                this.refs.time.max = audio.duration;
                this.refs.timeLoad.max = audio.duration;
            };

            // Mobile only
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: track.title,
                    artist: track.author_fullName,
                    artwork: [
                        {
                            src: getApiUrl('api', `/image/coverart/${trackId}&width=96`),
                            sizes: '96x96'
                        },
                        {
                            src: getApiUrl('api', `/image/coverart/${trackId}&width=128`),
                            sizes: '128x128'
                        },
                        {
                            src: getApiUrl('api', `/image/coverart/${trackId}&width=192`),
                            sizes: '192x192'
                        },
                        {
                            src: getApiUrl('api', `/image/coverart/${trackId}&width=256`),
                            sizes: '256x256'
                        },
                        {
                            src: getApiUrl('api', `/image/coverart/${trackId}?width=384`),
                            sizes: '384x384'
                        },
                        {
                            src: getApiUrl('api', `/image/coverart/${trackId}?width=512`),
                            sizes: '512x512'
                        },
                    ]
                });
            }

        }else{
            initPlay = false;
        }

        // When the track is finish
        audio.onended = () => {

            // Check if the local playlist is available
            if(parseInt(playlistIndex + 1, 10) === localPlaylist.length){
                // End the playlist
                audio.pause();
                this.refs.playPauseButton.textContent = 'play_arrow';
                document.title = oldTitle;
                playlistIndex = 0;
            }else{
                // Play the next track from the playlist
                playlistIndex = (playlistIndex + 1);
                const track = localPlaylist[parseInt(playlistIndex, 10)];
                store.dispatch({
                    type: 'UPDATE_TRACK_DETAILS',
                    payload: {
                        trackId,
                        title: track.title,
                        author_username: track.author.username,
                        author_fullname: track.author.fullname,
                        coverArt: track.coverImage,
                        playitnow: true,
                    }
                });
                this.updateLastPlay();
                this.playMusic();
            }
        };

        if (audio.paused) {
            audio.play();
            this.refs.playPauseButton.textContent = 'pause';
            document.title = `${track.author_fullName || track.author_fullname} - ${track.title}`;

            if(checkLogin.isLogin()){
                updateTimeEvent = setInterval(() => {
                    axios.post(getApiUrl('api', `/events?`), {
                        event: 'UPDATE_LAST_PLAY',
                        payload: {
                            volume: 100,
                            trackID: store.getState().MusicPlayer.trackId,
                            playtime: {
                                currentTime: audio.currentTime,
                                duration: audio.duration,
                            },
                            isPlaying: !audio.paused,
                        }
                    });
                }, 10000);
            }

        } else {
            audio.pause();
            this.refs.playPauseButton.textContent = 'play_arrow';
            document.title = oldTitle;
            clearInterval(updateTimeEvent)
        }

        if(checkLogin.isLogin()){
            this.updateLastPlay();
        }

    }

    updateTimeStamp(updateAudio = false) {
        if (!updateAudio) {
            this.refs.time.value = audio.currentTime;
        } else {
            audio.currentTime = this.refs.time.value;
        }
        this.refs.timeLoad.value = this.refs.time.value;
    }

    async updateLastPlay() {
        // Update the user's lastPlay field

        if (updateLastPlayEvent) clearTimeout(updateLastPlayEvent);
        if(checkLogin.isLogin()){
            updateLastPlayEvent = setTimeout(() => {
                axios.post(getApiUrl('api', `/events?`), {
                    event: 'UPDATE_LAST_PLAY',
                    payload: {
                        volume: 100,
                        trackID: store.getState().MusicPlayer.trackId,
                        playtime: {
                            currentTime: audio.currentTime,
                            duration: audio.duration,
                        },
                        isPlaying: !audio.paused,
                    }
                });
            }, 750);
        }
    }

    mute() {
        audio.muted = !audio.muted;
        if (audio.muted) {
            this.refs.volume.className = 'fa fa-volume-off'
        } else {
            this.refs.volume.className = 'fa fa-volume-up'
        }
    }

    toggleMobileTimeStamp(e){
        const trackPlayer = this.refs.trackPlayer;
        const trackInfo = this.refs.trackInfo;
        const coverArt = this.refs.coverArt;
        const time = this.refs.time;
        const active = e.target;
        const isClicking = active.classList.contains('backgroundImage');

        function open() {
            trackPlayer.classList.add('expand');
            trackInfo.classList.add('expand');
            coverArt.classList.add('expand');
            time.classList.add('expand');
        }

        function close() {
            trackPlayer.classList.remove('expand');
            trackInfo.classList.remove('expand');
            coverArt.classList.remove('expand');
            time.classList.remove('expand');
        }

        if(isClicking){
            if(trackPlayer.classList.contains('expand')){
                // Close expand panel
                close();
            }else{
                // Expand the panel
                open();
            }
        }

    }

    render() {
        const track = store.getState().MusicPlayer;
        return (
            <div
                id="TrackPlayer"
                ref={'trackPlayer'}
                style={{
                    marginTop: '1em',
                }}
                onTouchStart={e => {
                    this.toggleMobileTimeStamp(e);
                }}
                onTouchEnd={() => {
                    clearTimeout(showTimeEvent);
                }}

            >
                {/*Mobile only background image*/}

                <div className="mobile backgroundImage"
                    style={{
                        backgroundImage: `url(${getApiUrl('api', '/image/coverart/' + track.trackId + '?')})`,
                    }}
                >

                </div>

                <div
                    ref={'coverArt'}
                    id={'coverArt'}
                    style={{
                        backgroundImage: `url(${getApiUrl('api', '/image/coverart/' + track.trackId + '?width=100')})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '5em',
                        height: '5em',
                        position: 'relative',
                    }}
                >
                    <div
                        ref="playPauseButton"
                        id="playPauseButton"
                        className="playPauseButton material-icons"
                        onClick={this.playMusic.bind(this)}
                        style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            background: '#161616',
                            borderRadius: '50%',
                            padding: '0.2em',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#FFF',
                        }}
                    >play_arrow
                    </div>
                </div>

                <div id="trackInfo" ref={'trackInfo'}>

                    <Link to={"/track/" + this.state.MusicPlayer.trackId}>
                        <p
                            style={{
                                color: '#CCC',
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                position: 'absolute',
                                width: '70vw',
                            }}
                            className={'title'}
                        >{this.state.MusicPlayer.title}</p>
                    </Link>

                    <br/>

                    <Link to={"/@" + this.state.MusicPlayer.author_username} >
                        <span>{this.state.MusicPlayer.author_username ? "@" + this.state.MusicPlayer.author_username : ''}</span>
                    </Link>

                </div>

                <span
                    className="fa fa-volume-up"
                    id="volume"
                    ref={'volume'}
                    style={{
                        cursor: 'pointer',
                        color: '#FFF',
                    }}
                    onClick={this.mute.bind(this)}
                ></span>


                <input
                    ref="time"
                    type="range"
                    className="timeStamp"
                    defaultValue="0"
                    max="100"
                    id="time"
                    onInput={() => this.updateTimeStamp(true)}
                />

                <div className="backgroundColor"></div>
                <input type="range" ref={'timeLoad'} id={"timeLoad"} max={100}/>


            </div>
        )
    }
}