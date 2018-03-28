/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Navigation from '../utils/navigation';
import LoginContainer from '../containers/loginContainer';
import PlaceContainer from '../containers/placeContainer';
import DeviceStorage from '../utils/deviceStorage';
import Util from '../utils/util';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NetInfo,
    ToastAndroid
} from 'react-native';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isLogin = this.props.loginState.isLogin;
        const isLoading = this.props.loginState.isLoading;
        return (
            isLoading ? Util.bootUp :
                !isLogin ? <Navigation component={LoginContainer}/> : <Navigation component={PlaceContainer}/>
        );
    }

    componentWillMount() {
        DeviceStorage.get('loginStatus').then((loginStatus)=> {
            if (loginStatus === 'IsLogged') {
                this.props.judgeLogin(true)
            } else {
                this.props.judgeLogin(false)
            }
        })
    }


    _handleFirstConnectivityChange(reach) {
        switch (reach) {
            case 'WIFI': {
                return ToastAndroid.showWithGravity('你正在使用WIFI链接互联网,请确保网络链接正常', ToastAndroid.SHORT, ToastAndroid.CENTER)
            }
            case 'NONE': {
                return ToastAndroid.showWithGravity('没有连接网络，请确认网络环境', ToastAndroid.SHORT, ToastAndroid.CENTER)
            }
            case 'CELL':{
                return ToastAndroid.showWithGravity('你正在使用移动互联网', ToastAndroid.SHORT, ToastAndroid.CENTER)
            }
            case 'UNKNOWN':{
                return ToastAndroid.showWithGravity('发生错误，网络状况不可知 ', ToastAndroid.SHORT, ToastAndroid.CENTER)
            }
        }

    }

    componentDidMount() {
        // NetInfo.addEventListener(
        //     'change',
        //     this._handleFirstConnectivityChange
        // );
    }

    componentWillUnmount() {
        // NetInfo.removeEventListener(
        //     'change',
        //     this._handleFirstConnectivityChange
        // );
    }
}

export default App
