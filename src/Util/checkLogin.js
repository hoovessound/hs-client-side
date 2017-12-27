import cookie from 'react-cookies';
import getUrl from './getApiUrl';

/*

Dear developers

If you are working on this repo with out
the local HoovesSound server environment running,
please following the instruction in order
to set you up

INSTRUCTION:

Create a HoovesSound account if you haven't
Visit hoovessound.ml(The production HoovesSound site)
Open up the developer tool
Open the "Applications" tag
Locate the "Cookies" tag
Find the "oauth-token", and copy the value of it
Un-comment the setUp function
Paste your oauth-token at the setUp function

WARNING:
Do not commit your code with your oauth-token!!!
If you do so, and already push your code to the repo,
please change your password RIGHT A WAY NOW! DO IT NOW!!

Felix

*/

// function setUp(oauthToken){
//     cookie.save('oauth-token', oauthToken);
// }
// setUp('YOUR OAUTH TOKEN HERE');

export default () => {
    const token = cookie.load('oauth-token');
    const currentUrl = window.location;
    if (!token) {
        if (process.env.NODE_ENV === 'production') {
            window.location = getUrl('id', `/login?service=hs_service_login&redirect=${currentUrl}`, false);
        } else {
            window.location = getUrl('id', `/login?service=hs_service_login&redirect=${currentUrl}`, false);
        }
        return false;
    } else {
        return true;
    }
}