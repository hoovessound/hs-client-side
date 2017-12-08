import cookie from 'react-cookies';

export default (subdomain='api', path='/') => {
    if(process.env.NODE_ENV === 'production'){
        // Get the user's oauth-token
        const token = cookie.load('oauth-token');
        return (`https://${subdomain}.hoovessound.ml${path}&oauth_token=${token}&bypass=true`);
    }else{
        const token = 'e7671b56aca42828b5da68aad722f8c4f441d76dcef9f747d3aebd371dc10c18af6ac5c6297094500fe69578904c95eacca8';
        return (`http://${subdomain}.hoovessound.app:3000${path}&oauth_token=${token}&bypass=true`);
    }
}