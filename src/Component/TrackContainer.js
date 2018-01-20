import React from 'react';
import '../css/TrackContainer.css';
import {Link} from 'react-router-dom';
import store from '../Redux/store';
import TrackPlayerEvent from "../Flux/TrackPlayerEvent";

export default class TrackContainer extends React.Component {

    playButton() {
        return (
            <div
                ref="playPauseButton"
                className="playPauseButton material-icons"
                onClick={this.playMusic.bind(this)}
                style={{
                    cursor: 'pointer',
                    background: 'skyblue',
                    padding: '0.5em',
                    borderRadius: '50%',
                    color: '#161616'
                }}
            >play_arrow
            </div>
        )
    }

    playMusic(e) {
        e.preventDefault();
        store.dispatch({
            type: 'UPDATE_TRACK_DETAILS',
            payload: {
                ...this.props,
                playitnow: true,
            }
        });
        TrackPlayerEvent.update({
            ...this.props,
        });
    }

    title(){
        if(!this.props.notitle){
            if(this.props.nolink){
                return (
                    <div
                        className="track_info"
                        style={{
                            display: 'block'
                        }}
                    >
                        <p
                            className="title"
                            style={{
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{this.props.title}</p>
                    </div>
                )
            }else{
                return (
                    <Link to={`/track/${this.props.trackId}`}>
                        <div
                            className="track_info"
                            style={{
                                display: 'block'
                            }}
                        >
                            <p
                                className="title"
                                style={{
                                    whiteSpace: 'pre',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >{this.props.title}</p>
                        </div>
                    </Link>
                )
            }
        }
    }

    author(){
        if(!this.props.noauthor){
            return (
                <div className="author_info">
                    <Link to={`/@${this.props.author_username}`}>
                        <span
                            className="fullanme"
                            style={{
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{this.props.author_fullName}</span>
                    </Link>
                </div>
            )
        }
    }

    coverImage(){
        if(!this.props.nocoverimage){
            return (
                <div
                    className="coverArt"
                    style={{
                        backgroundImage: `url(${this.props.coverImage}?width=300)`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                    }}
                >
                </div>
            )
        }
    }

    render() {
        return (
            <div
                key={this.props.id}
                className='TrackContainer'
            >
                {this.coverImage()}
                <div className="details">
                    {this.playButton()}
                    {this.title()}
                    {this.author()}
                </div>
            </div>
        )
    }
}