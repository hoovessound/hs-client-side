export default (state={

}, action) => {
    switch(action.type){

        default: {
            return state;
        }

        case 'UPDATE_USER_STACK': {
            state = {
                ...state,
                ...action.payload,
            };
        }
    }
    return state;
}