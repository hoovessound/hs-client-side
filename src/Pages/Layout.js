import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TrackPlayer from '../Component/TrackPlayer';
export default class Layout extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <TrackPlayer/>
                <Footer/>
            </div>
        )
    }
}