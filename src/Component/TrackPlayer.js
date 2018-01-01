import React from 'react';
import '../css/TrackPlayer.css';
import store from '../Redux/store';
import {Link} from 'react-router-dom';
import getApiUrl from '../Util/getApiUrl';
import axios from 'axios';

const audio = new Audio();
let updateLastPlayEvent;
let oldTitle = document.title;

export default class TrackPlayer extends React.Component {

    constructor() {
        super();
        this.state = {
            MusicPlayer: {},
            playlist: {
                index: 0,
                stack: [],
            },
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

    async componentDidMount() {
        store.subscribe(() => {
            const MusicPlayer = store.getState().MusicPlayer;
            if (MusicPlayer.isHistory) {
                const User = store.getState().User;
                // Track is come from the user's history

                // Set the correct timestamp and volume

                audio.currentTime = User.history.playtime.currentTime;
                this.refs.time.max = User.history.playtime.duration;
                this.refs.time.value = User.history.playtime.currentTime;
            }

            // If the data contain coverImage, than use the coverImage

            if (MusicPlayer.coverImage) {
                MusicPlayer.coverArt = MusicPlayer.coverImage;
                delete MusicPlayer.coverImage;
            }

            this.setState({
                MusicPlayer,
            }, () => {
                if (this.state.MusicPlayer.playitnow) {
                    this.playMusic();
                }
            });
        })
    }

    playMusic() {
        const trackId = this.state.MusicPlayer.trackId;
        const playList = this.state.playlist;
        const source = getApiUrl('stream', `/${trackId}?`);
        if (audio.src !== source) {
            // A new audio source
            audio.src = source;
            this.refs.time.value = 0;
            audio.onloadedmetadata = () => {
                this.refs.time.max = audio.duration;
            };

            // When the track is finish
            audio.onended = () => {
                audio.pause();
                this.refs.playPauseButton.textContent = 'play_arrow';
                document.title = oldTitle;
                this.updateLastPlay();
            };
        }

        if (audio.paused) {
            audio.play();
            this.refs.playPauseButton.textContent = 'pause';
            document.title = `${this.state.MusicPlayer.author_fullname} - ${this.state.MusicPlayer.title}`;
        } else {
            audio.pause();
            this.refs.playPauseButton.textContent = 'play_arrow';
            document.title = oldTitle;
        }

        this.updateLastPlay();
    }

    updateTimeStamp(updateAudio = false) {
        if (!updateAudio) {
            this.refs.time.value = audio.currentTime;
        } else {
            audio.currentTime = this.refs.time.value;
        }
    }

    async updateLastPlay() {
        // Update the user's lastPlay field

        if (updateLastPlayEvent) clearTimeout(updateLastPlayEvent);
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
            })
        }, 750);
    }

    mute() {
        audio.muted = !audio.muted;
        if (audio.muted) {
            this.refs.volume.className = 'fa fa-volume-off'
        } else {
            this.refs.volume.className = 'fa fa-volume-up'
        }
    }

    render() {
        window.onkeydown = (event) => this.hotKey(event);
        audio.ontimeupdate = () => this.updateTimeStamp();
        return (
            <div
                id="TrackPlayer"
                style={{
                    marginTop: '1em',
                }}
            >

                <div
                    ref={'coverArt'}
                    style={{
                        backgroundImage: `url(${this.state.MusicPlayer.coverArt}?width=100)`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '5em',
                        height: '5em',
                        display: 'inline-block',
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
                            background: 'skyblue',
                            borderRadius: '50%',
                            padding: '0.2em',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >play_arrow
                    </div>
                </div>

                <div id="trackInfo">

                    <Link to={"/track/" + this.state.MusicPlayer.trackId}>
                        <span
                            style={{
                                color: '#CCC'
                            }}
                        >{this.state.MusicPlayer.title}</span>
                    </Link>

                    <br/>

                    <Link to={"/@" + this.state.MusicPlayer.author_username}>
                        <span>{"@" + this.state.MusicPlayer.author_username}</span>
                    </Link>

                </div>

                <span
                    className="fa fa-volume-up"
                    id="volume"
                    ref={'volume'}
                    style={{
                        cursor: 'pointer',
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


            </div>
        )
    }
}