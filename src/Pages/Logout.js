import React from 'react';
import cookie from 'react-cookies';

export default class Favorite extends React.Component {
    render() {
        let domain;
        if(process.env.NODE_ENV === 'production'){
            domain = '.hoovessound.ml'
        }else{
            domain = '.hoovessound.me'
        }
        // Redirect the user to the home page
        cookie.remove('jwt-token', {
            path: '/',
            domain,
        });
        window.location = '/';
        return (
            <p>Please wait, we are logging you out.</p>
        )
    }
}