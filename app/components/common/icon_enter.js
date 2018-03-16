/**
 * Created by jinlongxi on 17/11/27.
 */
/**
 * Created by jinlongxi on 17/8/22.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';

class Icon extends React.Component {
    render() {
        return (
            <View style={styles.go}></View>
        )
    }
}

const styles = StyleSheet.create({
    go: {
        width: 10,
        height: 10,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#F37B22",
        marginLeft: 10,
        transform: [{rotate: '-135deg'}],
    }
});

export default Icon
