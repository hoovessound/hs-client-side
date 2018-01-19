import cookie from 'react-cookies';
import * as checkLogin from '../Util/checkLogin';

export default (subdomain = 'api', path = '/', needAuth = true) => {
    // Get the user's oauth-token
    let tail = "";
    const token = cookie.load('jwt_token');
    const noDevServer = process.env.REACT_APP_NO_DEV_SERVER;

    if(checkLogin.isLogin()){
        if (needAuth) {
            tail = `&jwt=${token}&bypass=true`;
        }
    }

    if (!subdomain.endsWith('.')) {
        subdomain += '.';
    }

    if (subdomain === '$NA.') {
        subdomain = "";
    }

    if (process.env.NODE_ENV === 'production') {
        return (`https://${subdomain}hoovessound.ml${path}${tail}`);
    } else {

        // Development
        if (noDevServer === 'true' || noDevServer === 'TRUE') {
            return (`https://${subdomain}hoovessound.ml${path}${tail}`);
        } else {
            return (`http://${subdomain}hoovessound.me:3000${path}${tail}`);
        }
    }
}