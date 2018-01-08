/**
 * Created by jinlongxi on 17/12/28.
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
    Navigator,
    TouchableOpacity,
    Image
} from 'react-native';

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import Icon from '../../components/common/left_icon';
import RightMenu from './right_menu';
class reservoirHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: false
        }
    }

    render() {
        let headContent = this.props.initObj;
        return (
            <View style={styles.header}>
                <View style={styles.title_container}>
                    <TouchableOpacity style={styles.left_btn} onPress={this._pop.bind(this)}>
                        <Icon/>
                        <Text style={styles.btn_text}>{headContent.backName}</Text>
                    </TouchableOpacity>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                        <Text style={styles.title_small} numberOfLines={1}>{headContent.barTitle_small}</Text>
                        <Text style={styles.title} numberOfLines={1}>{headContent.barTitle}</Text>
                    </View>
                    <View style={styles.right_btn}>
                        <RightMenu/>
                    </View>
                </View>
            </View>
        )
    }

    _pop() {
        this.props.navigator.pop();
    };
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
    },
    right_btn: {
        flexDirection: 'row',
        position: 'absolute',
        right: 5,
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
        alignItems: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 18,
        textAlign: 'center',
    },
    title_small: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 18,
        textAlign: 'center',
    },
    right_icon: {
        width: 30,
        height: 30,
    }
});

export default reservoirHeader
