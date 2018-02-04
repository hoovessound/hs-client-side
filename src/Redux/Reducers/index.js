import {combineReducers} from 'redux';
import MusicPlayer from './MusicPlayer';
import User from './User';
import LocalPlayList from './LocalPlayList';

export default combineReducers({
    MusicPlayer,
    User,
    LocalPlayList,
})