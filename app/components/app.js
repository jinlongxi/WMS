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
    View
} from 'react-native';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isLogin = this.props.loginState.isLogin;
        const isLoading = this.props.loginState.isLoading;
        console.log(isLogin, isLoading);
        return (
            isLoading ? Util.bootUp :
                !isLogin ? <Navigation component={LoginContainer}/> : <Navigation component={PlaceContainer}/>
        );
    }

    componentWillMount() {
        DeviceStorage.get('loginStatus').then((loginStatus)=> {
            console.log(loginStatus);
            if (loginStatus === 'IsLogged') {
                console.log('用户已登录');
                this.props.judgeLogin(true)
            } else {
                console.log('用户未登录');
                this.props.judgeLogin(false)
            }
        })
    }
}

export default App
