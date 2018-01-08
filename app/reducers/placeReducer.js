/**
 * Created by jinlongxi on 17/12/27.
 */
import * as TYPES from '../constants/ActionTypes';

const initialState = {
    placeList: null,
    isLoading: true,
};

export default function place(state = initialState, action) {
    switch (action.type) {
        case TYPES.GET_PLACELIST_DOING:
            return {
                ...state,
                isLoading: true,
                status: 'doing'
            };
        case TYPES.GET_PLACELIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                placeList: action.placeList,
                status: 'done'
            };
        case TYPES.GET_PLACELIST_ERROR:
            return {
                ...state,
                isLoading: false,
                status: 'error',
            };
        default:
            return state;
    }
}
