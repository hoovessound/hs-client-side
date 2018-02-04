import cookie from 'react-cookies';
import getUrl from './getApiUrl';

const byPassLogin = process.env.REACT_APP_BY_PASS_LOGIN;
const oauthToken = process.env.REACT_APP_OAUTH_TOKEN;

export function isLogin() {
    const token = cookie.load('jwt_token');
    if (!token) {
        if (process.env.NODE_ENV !== 'production') {
            if(!oauthToken){
                throw new Error('DEV: Please set up the correct JWT Token at the .env.development file');
            }else{
                if(byPassLogin === 'false'){
                    console.log('DEV: Injecting the jwt-token');
                    cookie.save('jwt-token', oauthToken);
                    window.location.reload();
                }
            }
        }
        return false;
    } else {
        return true;
    }
}

export function goLogin() {
    if(process.env.NODE_ENV === 'production'){
        window.location = getUrl('id', `/login?service=hs_service_login&redirect=${window.location}`, false);
    }else{
        window.location = getUrl('id', `/login?service=hs_service_login&redirect=${window.location}`, false);
    }
}