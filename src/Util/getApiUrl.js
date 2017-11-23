export default (subdomain='api', path='/') => {
    return (`http://${subdomain}.hoovessound.app:3000${path}`);
}