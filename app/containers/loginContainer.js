/**
 * Created by jinlongxi on 17/12/27.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Login from '../components/login/login';
import {appLogin} from '../actions/loginAction';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';


const mapStateToProps = (state) => {
    return {
        loginState: state.loginStore
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        //添加当前库位信息
        appLogin:(username,password)=>{
            dispatch(appLogin(username,password))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
