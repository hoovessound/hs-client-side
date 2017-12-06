import React from 'react';
import axios from 'axios';
import TrackContainer from '../Component/TrackContainer';
import getApiurl from '../Util/getApiUrl';

export default class Favorite extends React.Component {
    constructor() {
        super()
        this.state = {
            trackEl: []
        }
    }

    async componentDidMount() {
        const response = await axios.get(getApiurl('api', `/me/favorites?offset=0`));

        for(let track of response.data){
            const trackEl = () => {
                return (
                    <TrackContainer key={track.id} title={track.title} coverImage={track.coverImage} trackId={track.id}
                                    author_username={track.author.username} author_fullName={track.author.fullName}/>
                )
            }
            this.setState({
                trackEl: trackEl(),
            });
        }
    }

    render() {
        return (
            <div>
                {this.state.trackEl}
            </div>
        )
    }
}