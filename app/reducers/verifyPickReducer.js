/**
 * Created by jinlongxi on 18/3/7.
 */
'use strict';

import * as TYPES from '../constants/ActionTypes';

const initialState = {
    status: null,
    pickList: []
};

export default function verifyPick(state = initialState, action) {
    switch (action.type) {
        //添加分拣箱单
        case TYPES.ADD_PICKLIST:
            return {
                ...state,
                pickList: state.pickList.push(action.pickData)
            };
        default:
            return state;
    }
}
