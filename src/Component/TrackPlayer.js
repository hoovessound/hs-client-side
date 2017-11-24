import React from 'react';
import '../css/TrackPlayer.css';
export default class TrackPlayer extends React.Component {
    render() {
        return (
            <div id="TrackPlayer">
                <input type="range" className="timeStamp" defaultValue="0" max="100" />
                <div className="playPuaseButton material-icons">play_arrow</div>
            </div>
        )
    }
}