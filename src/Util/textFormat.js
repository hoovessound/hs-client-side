export function url(text) {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/igm;
    if(typeof text !== 'undefined' && text !== null){
        if(text.match(regex)){
            const url = text.match(regex);
            return text.replace(url, `<a href="${url}" target="_blank">${url}</a>`);
        }else{
            return text;
        }
    }
}