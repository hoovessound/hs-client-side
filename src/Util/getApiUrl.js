import cookie from 'react-cookies';

export default (subdomain='api', path='/') => {
    // Get the user's oauth-token
    const token = cookie.load('oauth-token');
    if(process.env.NODE_ENV === 'production'){
        return (`https://${subdomain}.hoovessound.ml${path}&oauth_token=${token}&bypass=true`);
    }else{
        return (`http://${subdomain}.hoovessound.app:3000${path}&oauth_token=${token}&bypass=true`);
    }
}