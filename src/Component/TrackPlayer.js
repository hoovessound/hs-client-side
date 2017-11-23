import React from 'react';
import '../css/TrackPlayer.css';
export default class TrackPlayer extends React.Component {
    render() {
        return (
            <div id="TrackPlayer">
                <input type="range" class="timeStamp" value="0" max="100" />
                <div class="playPuaseButton material-icons">play_arrow</div>
            </div>
        )
    }
}