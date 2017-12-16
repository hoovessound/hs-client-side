import React from 'react';
import cookie from 'react-cookies';

export default class Favorite extends React.Component {
    render() {
        if(process.env.NODE_ENV === 'production'){
            cookie.remove('oauth-token', {
                path: '/',
                domain: '.hoovessound.ml'
            });
        }else{
            cookie.remove('oauth-token', {
                path: '/',
                domain: '.hoovessound.app'
            });
        }
        // Redirect the user to the home page
        window.location = '/';
        return (
            <p>Please wait, we are logging you out.</p>
        )
    }
}