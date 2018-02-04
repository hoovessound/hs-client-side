export default (state={
    playing: false,
}, action) => {
    switch(action.type){

        default: {
            return state;
        }

        case 'UPDATE_TRACK_DETAILS': {
            state = {
                ...state,
                ...action.payload,
            };
        }
    }
    return state;
}