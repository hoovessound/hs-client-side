export default (state={

}, action) => {
    switch(action.type){

        default: {
            return state;
        }

        case 'ADD_LOCAL_PLAYLIST': {
            state = {
                ...state,
                ...action.payload,
            };
        }
    }
    return state;
}