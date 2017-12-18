import React from 'react';
import '../css/TrackPlayer.css';
import store from '../Redux/store';
import {Link} from 'react-router-dom';
import getApiUrl from '../Util/getApiUrl';
import axios from 'axios';

let playing = false;
const audio = new Audio();
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
            audio.src = source;
        }

        if (playing) {
            playing = false;
            audio.pause();
            this.refs.playPauseButton.textContent = 'play_arrow';
        } else {
            playing = true;
            audio.play();
            this.refs.playPauseButton.textContent = 'pause';
        }
        this.updateLastPlay();
    }

    async updateLastPlay(){
        // Update the user's lastPlay field
        axios.post(getApiUrl('api', `/events?`), {
            event: 'UPDATE_LAST_PLAY',
            payload: {
                volume: 100,
                trackID: store.getState().MusicPlayer.trackId,
                playtime: {
                    currentTime: audio.currentTime,
                    duration: audio.duration,
                },
                isPlaying: playing,
            }
        })
    }

    render() {
        window.onkeypress = (event) => this.hotKey(event);
        return (
            <div
                id="TrackPlayer"
                style={{
                    marginTop: '1em',
                }}
            >
                <input ref="volume" type="range" className="timeStamp" defaultValue="0" max="100" id="volume"/>
                <div
                    ref="playPauseButton"
                    id="playPauseButton"
                    className="playPauseButton material-icons"
                    onClick={this.playMusic.bind(this)}
                    style={{
                        "cursor": "pointer",
                    }}
                >play_arrow
                </div>
                <Link to={"/track/" + this.state.MusicPlayer.trackId}>{this.state.MusicPlayer.title}</Link>
                <br/>
                <Link
                    to={"/@" + this.state.MusicPlayer.author_username}>{"@" + this.state.MusicPlayer.author_username}</Link>
            </div>
        )
    }
}