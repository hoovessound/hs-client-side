import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import TrackContainer from '../Component/TrackContainer';
import getApiurl from '../Util/getApiUrl';
import renderHTML from 'react-render-html';
import {url} from '../Util/textFormat';

const token = 'e7671b56aca42828b5da68aad722f8c4f441d76dcef9f747d3aebd371dc10c18af6ac5c6297094500fe69578904c95eacca8';
export default class Track extends React.Component {
    constructor() {
        super();
        this.state = {
            trackInfo: [],
        }
    }

    async componentDidMount(trackId) {
        try {
            const trackId = this.props.match.params.id;
            const response = await axios.get(getApiurl('api', `/track/${trackId}?bypass=true&oauth_token=${token}`))
            const track = response.data;
            const description = track.description ? url(track.description) : '';
            const trackInfo = () => {
                return (
                    <div>
                        <div className="tags">

                        </div>
                        <div className="fa fa-heart"></div>
                        <h1 className="title">{track.title}</h1>
                        <p>By <Link
                            to={'/@' + track.author.username}>{'@' + track.author.username}</Link>
                        </p>
                        <TrackContainer key={track.id} title={track.title} coverImage={track.coverImage}
                                        trackId={track.id} author_username={track.author.username}
                                        author_fullName={track.author.fullName} withouttitle nolink/>

                        <div className="description">
                            {renderHTML(description)}
                        </div>

                        <div className="commentSession">
                            <input />
                        </div>
                    </div>
                )
            }
            this.setState({
                trackInfo: trackInfo(),
            })
            console.log('componentDidMount')
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        console.log('render')
        return (
            <div ref={this.props.trackId} key={this.props.trackId}>
                {this.state.trackInfo}
            </div>
        )
    }
}