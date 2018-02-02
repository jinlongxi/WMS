'use strict';

import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';

//登录
export function appLogin(username, password) {
    return (dispatch) => {

        dispatch({'type': TYPES.APP_LOGIN_DOING});
        const url = ServiceURl.wmsManager + 'login';

        let formData = new FormData();
        formData.append("login.username", username);
        formData.append("login.password", password);
        Request.postRequest(url, formData, function (response) {
            //console.log(JSON.stringify(response));
            let {userLogin:userLogin}=response;
            if (userLogin) {
                let userInfo = {
                    username: username,
                    password: password,
                    partyId: userLogin.partyId
                };
                DeviceStorage.save('userInfo', userInfo);
                DeviceStorage.save('loginStatus', 'IsLogged');
                dispatch({'type': TYPES.APP_LOGIN_SUCCESS, partyId: userLogin.partyId});
            } else {
                Alert.alert(
                    '用户名或密码错误',
                    '请检查输入信息',
                );
                dispatch({'type': TYPES.APP_LOGIN_ERROR, error: '输入错误'});
            }
        }, function (err) {
            dispatch({'type': TYPES.APP_LOGIN_ERROR, error: err});
        });
    };
}

//退出登录
export function loginOut() {
    return (dispatch) => {
        dispatch({'type': TYPES.LOGIN_OUT});
    };
}

//判断登录状态
export function judgeLogin(loginStatus) {
    return (dispatch) => {
        dispatch({'type': TYPES.JUDGE_LOGIN_STATE, 'loginStatus': loginStatus});
    };
}







