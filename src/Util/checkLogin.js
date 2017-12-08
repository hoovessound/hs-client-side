import cookie from 'react-cookies';

export default () => {
    const token = cookie.load('oauth-token');
    const currentUrl = window.location;
    if(!token){
        if(process.env.NDOE_ENV === 'production'){
            window.location = `https://id.hoovessound.ml/login?service=hs_service_login&redirect=${currentUrl}`;
        }else{
            window.location = `http://id.hoovessound.app:3000/login?service=hs_service_login&redirect=${currentUrl}`;
        }
        return false;
    }else{
        return true;
    }
}