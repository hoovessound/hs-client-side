import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TrackPlayer from '../Component/TrackPlayer';
import Tracks from './Tracks';
export default class Layout extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <Tracks/>
                <TrackPlayer/>
                <Footer/>
            </div>
        )
    }
}