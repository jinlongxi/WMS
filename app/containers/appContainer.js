/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import App from '../components/app';
import {judgeLogin} from '../actions/loginAction';
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
        //判断登录状态
        judgeLogin: (loginStatus)=> {
            dispatch(judgeLogin(loginStatus))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
