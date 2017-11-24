export default (subdomain='api', path='/') => {
    if(process.env.NODE_ENV === 'production'){
        return (`http://${subdomain}.hoovessound.ml${path}`);
    }else{
        return (`http://${subdomain}.hoovessound.app:3000${path}`);
    }
}