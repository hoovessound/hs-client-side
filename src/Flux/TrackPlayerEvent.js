import {EventEmitter} from 'events';

class TrackPlayerEvent extends EventEmitter {
    constructor(){
        super();
        this.track = {};
    }

    update(object){
        this.track = object;
        this.emit('update');
    }

    get(){
        return this.track;
    }
}

const trackPlayerEvent = new TrackPlayerEvent();
export default trackPlayerEvent;