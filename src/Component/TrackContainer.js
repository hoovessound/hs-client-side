import React from 'react';
import '../css/TrackContainer.css';
import {Link} from 'react-router-dom';
import store from '../Redux/store';
import TrackPlayerEvent from "../Flux/TrackPlayerEvent";
import getApiUrl from "../Util/getApiUrl";
import moment from 'moment';
import renderHtml from 'react-render-html';

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
                title: this.props.track.title,
                coverImage: this.props.track.coverImage,
                trackId: this.props.track.id,
                author_username: this.props.track.author.username,
                author_fullName: this.props.track.author.fullname,
                playitnow: true,
            }
        });
        TrackPlayerEvent.update({
            title: this.props.track.title,
            coverImage: this.props.track.coverImage,
            trackId: this.props.track.id,
            author_username: this.props.track.author.username,
            author_fullName: this.props.track.author.fullname,
        });
    }

    title() {
        if (!this.props.notitle) {
            if (this.props.nolink) {
                return (
                    <p
                        className="title"
                        style={{
                            whiteSpace: 'pre',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >{renderHtml(this.props.track.title ? this.props.track.title : '')}</p>
                )
            } else {

                return (
                    <Link to={`/track/${this.props.track.id}`}>
                        <p
                            className="title"
                            style={{
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{renderHtml(this.props.track.title ? this.props.track.title : '')}</p>
                    </Link>
                )
            }
        }
    }

    author() {
        if (!this.props.noauthor) {
            return (
                <div className="author_info">
                    <Link to={`/@${this.props.track.author.username}`}>
                        <span
                            className="fullanme"
                            style={{
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{renderHtml(this.props.track.author.fullName || this.props.track.author.fullname)}</span>
                    </Link>
                </div>
            )
        }
    }

    coverImage() {
        if (!this.props.nocoverimage) {
            return (
                <div
                    className="coverArt"
                    style={{
                        backgroundImage: `url(${getApiUrl('api', '/image/coverart/' + this.props.track.id + '?&width=300')})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                    }}
                >
                </div>
            )
        }
    }

    backgroundDrop() {
        if (!this.props.nobackgrounddrop) {
            if (this.props.track.backgrounddrop) {
                const url = getApiUrl('api', `/image/doodle/${this.props.track.backgrounddrop}?`);
                return (
                    <div className="backgroundDrop"
                         style={{
                             background: `url(${url})`,
                             backgroundSize: 'cover',
                             backgroundRepeat: 'no-repeat',
                         }}
                    ></div>
                )
            } else {
                return (
                    <span></span>
                )
            }
        }
    }

    timeStamp() {
        if (!this.props.notimestamp) {
            return (
                <div className="uploadTime">
                    {moment(this.props.track.uploadDate).fromNow()}
                </div>
            )
        } else {
            return (
                <span></span>
            )
        }
    }

    render() {
        return (
            <div
                className={`TrackContainer ${this.props.track.backgrounddrop ? 'backgrounddrop' : ''}`}
                key={this.props.track.id}
            >
                {this.backgroundDrop()}
                {this.coverImage()}
                <div className="details">
                    {this.playButton()}
                    {this.title()}
                    {this.author()}
                    {this.timeStamp()}
                </div>
            </div>
        )
    }
}