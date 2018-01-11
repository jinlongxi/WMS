/**
 * Created by jinlongxi on 17/9/11.
 */
import React, {Component} from 'react';
import Header from '../common/headerBar';
import Place from '../../containers/placeContainer';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    NavigatorIOS,
    ScrollView,
    Alert,
    Switch
} from 'react-native';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radioSelect: false,
            username: 'liyufeng',
            password: 'fbcf321b45e1a457',
        };
        this.appLogin = this.appLogin.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header initObj={{backName: '返回', barTitle: '登录页面'}} {...this.props}/>
                <View style={styles.form}>
                    <Text style={styles.header}>用户登录</Text>
                    <View style={styles.body}>
                        <TextInput style={styles.input} value={this.state.username} placeholder='用户名'
                                   placeholderTextColor="#495057" onChangeText={(text)=> {
                            this.setState({
                                username: text
                            })
                        }}
                                   underlineColorAndroid='transparent'/>
                        <TextInput style={styles.input} value={this.state.password} secureTextEntry={true}
                                   placeholder='密码' placeholderTextColor="#495057" onChangeText={(text)=> {
                            this.setState({
                                password: text
                            })
                        }}
                                   underlineColorAndroid='transparent'/>
                        <View style={styles.radio}>
                            <Switch disabled={false} value={this.state.radioSelect} onValueChange={()=> {
                                this.setState({radioSelect: !this.state.radioSelect})
                            }}/>
                            <Text style={styles.radio_text}>记住密码</Text>
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={()=> {
                            this.appLogin()
                        }}>
                            <Text style={styles.btn_text}>登录</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    //用户登录
    appLogin() {
        const username = this.state.username;
        const password = this.state.password;
        this.props.appLogin(username, password);
    }

    componentWillMount() {
        if (this.props.loginState.isLogin) {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'Place',
                    component: Place,
                    params: {},
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loginState.isLogin) {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'Place',
                    component: Place,
                    params: {},
                })
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7a7a7a'
    },
    form: {
        backgroundColor: '#ffffff',
        margin: 10
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 13,
        backgroundColor: '#eee'
    },
    body: {
        padding: 15,
        backgroundColor: '#ffffff'
    },
    input: {
        padding: 10,
        color: '#495057',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    radio: {
        marginVertical: 10,
        flexDirection: 'row'
    },
    radio_text: {
        fontSize: 16,
        textAlignVertical: 'center'
    },
    btn: {
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: '#F37B22',
        borderRadius: 2,

    },
    btn_text: {
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        borderRadius: 2,
    }
});

export default Login
