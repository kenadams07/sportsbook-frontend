import { SET_SELECTED_SPORT } from '../Action/liveActions';

const initialState = {
    selectedSport: null
};

const liveReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_SPORT:
            return {
                ...state,
                selectedSport: action.payload
            };
        default:
            return state;
    }
};

export default liveReducer;
