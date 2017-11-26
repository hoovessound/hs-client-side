import React from 'react';
import '../css/TrackPlayer.css';
import store from '../Redux/store';
import {Link} from 'react-router-dom';

export default class TrackPlayer extends React.Component {

    constructor() {
        super();
        this.state = {
            MusicPlayer: {},
        };
    }

    async componentDidMount() {
        store.subscribe(() => {
            const MusicPlayer = store.getState().MusicPlayer;
            this.setState({
                MusicPlayer,
            })
        })
    }

    render() {
        return (
            <div id="TrackPlayer">
                <input ref="volume" type="range" className="timeStamp" defaultValue="0" max="100" id="volume"/>
                <div ref="playPauseButton" id="playPauseButton" className="playPauseButton material-icons">play_arrow
                </div>
                <Link to={"/track/" + this.state.MusicPlayer.trackId}>{this.state.MusicPlayer.title}</Link>
                <br/>
                <Link to={"/@" + this.state.MusicPlayer.author_username}>{"@" + this.state.MusicPlayer.author_username}</Link>
            </div>
        )
    }
}