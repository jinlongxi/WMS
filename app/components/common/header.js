/**
 * Created by jinlongxi on 17/8/22.
 */
import React, {Component} from 'react';
import Login from '../../containers/loginContainer';
import Icon from './left_icon'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity
} from 'react-native';

class Header extends React.Component {
    render() {
        const headContent = this.props.initObj;
        return (
            <View style={styles.header}>
                <View style={styles.title_container}>
                    <TouchableOpacity style={styles.left_btn} onPress={this._pop.bind(this)}>
                        <Icon/>
                        <Text style={styles.btn_text}>{headContent.backName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title} numberOfLines={1}>{headContent.barTitle}</Text>
                </View>
            </View>
        )
    }

    _pop() {
        if (this.props.initObj.backType === 'logOut') {
            console.log('退出登录');
            this.props.loginOut();
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'Login',
                    component: Login,
                    params: {},
                })
            }
        } else {
            this.props.navigator.pop();
        }
    }
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: "rgb(55, 70, 90)",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    left_btn: {
        flexDirection: 'row',
        position: 'absolute',
        left: 0,
        paddingVertical: 15
    },
    btn_text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 18
    },
    title_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 18,
        textAlign: 'center',
    }
});

export default Header
