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
        };
    }

    hotKey(evt){
        const active = document.activeElement;
        const charCode = evt.which || evt.charCode || evt.keyCode || 0;
        if(active.tagName !== 'TEXTAREA' && active.tagName !== 'INPUT' && active.id !== 'volumeBar'){
            evt.preventDefault();
            if(charCode === 32){
                this.playMusic();
            }
        }
    }

    async componentDidMount() {
        store.subscribe(() => {
            const MusicPlayer = store.getState().MusicPlayer;
            if(MusicPlayer.isHistory) {
                const User = store.getState().User;
                // Track is come from the user's history

                // Set the correct timestamp and volume

                audio.currentTime = User.history.playtime.currentTime;
                this.refs.time.max = User.history.playtime.duration;
                this.refs.time.value = User.history.playtime.currentTime;
            }

            // If the data contain coverImage, than use the coverImage

            if(MusicPlayer.coverImage){
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
        const source = getApiUrl('stream', `/${trackId}?`);
        if (audio.src !== source) {
            // A new audio source
            audio.src = source;
            audio.onloadedmetadata = () => {
                this.refs.time.max = audio.duration;
            };
        }

        if(audio.paused){
            audio.play();
            this.refs.playPauseButton.textContent = 'pause';
            document.title = `${this.state.MusicPlayer.author_fullname} - ${this.state.MusicPlayer.title}`;
        }else{
            audio.pause();
            this.refs.playPauseButton.textContent = 'play_arrow';
            document.title = oldTitle;
        }

        this.updateLastPlay();
    }

    updateTimeStamp(updateAudio=false){
        if(!updateAudio){
            this.refs.time.value = audio.currentTime;
        }else{
            audio.currentTime = this.refs.time.value;
        }
    }

    async updateLastPlay(){
        // Update the user's lastPlay field

        if(updateLastPlayEvent) clearTimeout(updateLastPlayEvent);
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

    render() {
        window.onkeypress = (event) => this.hotKey(event);
        audio.ontimeupdate = () => this.updateTimeStamp();
        return (
            <div
                id="TrackPlayer"
                style={{
                    marginTop: '1em',
                }}
            >

                <div id="trackInfo">

                    <div
                        ref={'coverArt'}
                        style={{
                            backgroundImage: `url(${this.state.MusicPlayer.coverArt})`,
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

                    <Link to={"/track/" + this.state.MusicPlayer.trackId}>
                        <span
                            style={{
                                position: 'absolute',
                                top: '1.5em',
                                left: '6em',
                            }}
                        >{this.state.MusicPlayer.title}</span>
                    </Link>

                    <br/>

                    <Link to={"/@" + this.state.MusicPlayer.author_username}>
                        <span
                            style={{
                                position: 'absolute',
                                top: '0.1em',
                                left: '6em',
                                color: '#dbdbdb',
                            }}
                        >{"@" + this.state.MusicPlayer.author_username}</span>
                    </Link>

                </div>


                <input
                    ref="time"
                    type="range"
                    className="timeStamp"
                    defaultValue="0"
                    max="100"
                    style={{
                        position: 'absolute',
                        top: '3em',
                        left: '6em',
                        background: 'none',
                        width: '90%',
                        outline: 'none',
                    }}
                    onInput={() => this.updateTimeStamp(true)}
                />

            </div>
        )
    }
}