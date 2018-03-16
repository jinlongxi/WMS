'use strict';

import * as TYPES from '../constants/ActionTypes';

const initialState = {
    isLogin: false,
    status: null,
    isLoading: true,
    partyId: null
};

export default function login(state = initialState, action) {
    switch (action.type) {
        //微信登录
        case TYPES.APP_LOGIN_DOING:
            return {
                ...state,
                status: 'doing'
            };
        case TYPES.APP_LOGIN_SUCCESS:
            return {
                ...state,
                isLogin: true,
                partyId: action.partyId,
                isLoading: false,
                status: 'done'
            };
        case TYPES.APP_LOGIN_ERROR:
            return {
                ...state,
                status: 'error',
                isLoading: false,
                isLogin: false,
            };
        //修改登录状态
        case TYPES.JUDGE_LOGIN_STATE:
            return {
                ...state,
                isLogin: action.loginStatus ? true : false,
                isLoading: false,
            };
        //退出登录状态
        case TYPES.LOGIN_OUT:
            return {
                ...state,
                isLogin: false,
                isLoading: false,
            };
        default:
            return state;
    }
}
