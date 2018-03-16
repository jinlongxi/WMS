/**
 * Created by jinlongxi on 17/12/28.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Header from '../components/common/header';
import {loginOut} from '../actions/loginAction';
import DeviceStorage from '../utils/deviceStorage';
const mapStateToProps = (state) => {
    return {
        messageState: state.messageStore,
    }
};

const mapDispatchToProps = (dispatch)=> {
    return {
        //退出登录
        loginOut: ()=> {
            dispatch(loginOut());
            DeviceStorage.delete('loginStatus');
            DeviceStorage.delete('userInfo');
        },
    }
};

const headerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

export default headerContainer
