/**
 * Created by jinlongxi on 17/8/22.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity
} from 'react-native';


class HeaderBar extends React.Component {
    render() {
        //获取对象  按钮名称   头部Title
        var headContent = this.props.initObj;
        return (
            <View style={styles.header}>
                <View style={styles.title_container}>
                    <Text style={styles.title} numberOfLines={1}>{headContent.barTitle}</Text>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: "rgb(55, 70, 90)",
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    title_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 18,
    }
});

export default HeaderBar;
