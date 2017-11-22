import React from 'react';
import NavBar from './NavBar';
export default class Layout extends React.Component {
    render() {
        return (
            <header>
                <h1>HoovesSound</h1>
                <NavBar/>
            </header>
        )
    }
}