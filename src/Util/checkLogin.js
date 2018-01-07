import cookie from 'react-cookies';
import getUrl from './getApiUrl';

export default () => {
    const token = cookie.load('oauth-token');
    const currentUrl = window.location;
    if (!token) {
        if (process.env.NODE_ENV === 'production') {
            window.location = getUrl('id', `/login?service=hs_service_login&redirect=${currentUrl}`, false);
        } else {
            const oauthToken = process.env.REACT_APP_OAUTH_TOKEN;
            if(!oauthToken){
                throw new Error('DEV: Please set up the correct OAUTH_TOKEN at the .env.development file');
            }else{
                cookie.save('oauth-token', oauthToken);
            }
        }
        return false;
    } else {
        return true;
    }
}