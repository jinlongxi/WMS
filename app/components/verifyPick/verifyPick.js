/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
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
    Switch,
    ListView,
    KeyboardAvoidingView,
    BackHandler,
    Platform,
    Keyboard,
    InteractionManager,
    AlertIOS,
    PanResponder
} from 'react-native';

class VerifyPick extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View>
                <Text>分拣页面</Text>
            </View>
        )
    }
}
export default VerifyPick