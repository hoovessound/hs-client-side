export default (state={
    tracks: []
}, action) => {
    switch(action.type){

        default: {
            return state;
        }

        case 'ADD_LOCAL_PLAYLIST': {
            const ids = []
            state.tracks.map(stateTrack => {
                return ids.push(stateTrack.id);
            });
            action.payload.tracks.map(track => {
                if(!ids.includes(track.id)){
                    state.tracks.push(track);
                }
                return true;
            });
            return state;
        }
    }
}