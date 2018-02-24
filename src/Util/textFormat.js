export function url(text) {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/igm;
    let sendBack = '';
    text.split('\n').map(line => {
        if(line.match(regex)){
            const urls = line.match(regex);
            urls.map(url => {
                return line = line.split(url).join(`<a href="${url}" target="_blank">${url}</a>`);
            });
        }
        return sendBack += line;
    });
    return sendBack;
}