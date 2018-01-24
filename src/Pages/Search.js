import React from 'react';
import getApiUrl from "../Util/getApiUrl";
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Link} from 'react-router-dom';
import TrackContainer from "../Component/TrackContainer";
let initSearch = true;
export default class Search extends React.Component{

    constructor(){
        super();
        this.state = {
            ponies: [],
            tracks: [],
            playlist: [],
            query: '',
        }
    };

    async fetchResult(query){
        const response = await axios.get(getApiUrl('api', `/search/${query}?`));
        const result = response.data;
        let ponies = result.users.map(user => {
            return (
                <div key={user.id}>
                    <Link to={`/@${user.username}`}>
                        <img src={getApiUrl('api', `/image/avatar/${user.username}?width=50`, false)} alt={`${user.username} icon`}/>
                        <p>{user.fullName}</p>
                    </Link>
                </div>
            )
        });

        let tracks = result.tracks.map(track => {
            return (
                <TrackContainer key={track.id} track={track}/>
            )
        });

        let playlist = result.playlist.map(playlist => {
            return (
                <div key={playlist.id}>
                    <Link to={`/playlist/${playlist.id}`}>
                        <img src={getApiUrl('api', `/image/playlist/${playlist.id}?width=100`, false)} alt={`${playlist.id} icon`}/>
                        <p>{playlist.title}</p>
                    </Link>
                </div>
            )
        });

        this.setState({
            ponies,
            tracks,
            playlist,
            query,
        });
    }

    componentDidMount(){
        const query = this.props.match.params.query;
        this.setState({
            query,
        });
        initSearch = false;
        this.fetchResult(query);
    }

    nullChekc(array){
        if(array.length <= 0){
            return (
                <div>
                    <span>Opps, nothing was found :/</span>
                </div>
            )
        }else{
            return array;
        }
    }

    render(){
        const query = this.props.match.params.query;
        if(query !== this.state.query){
            if(!initSearch){
                this.fetchResult(query);
            }
        }
        return (
            <Tabs>

                <TabList>
                    <Tab>Ponies</Tab>
                    <Tab>Tracks</Tab>
                    <Tab>Playlist</Tab>
                </TabList>

                <TabPanel>
                    {
                        this.nullChekc(this.state.ponies)
                    }
                </TabPanel>

                <TabPanel>
                    {
                        this.nullChekc(this.state.tracks)
                    }
                </TabPanel>

                <TabPanel>
                    {
                        this.nullChekc(this.state.playlist)
                    }
                </TabPanel>

            </Tabs>
        )
    }
}