/**
 * Created by jinlongxi on 18/1/2.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity,
    Image,
    InteractionManager
} from 'react-native';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

class rightMenu extends React.PureComponent {
    setMenuRef = ref => {
        this.menu = ref;
    };

    menu = null;

    hideMenu = () => {
        this.menu.hide();
    };

    showMenu = () => {
        this.menu.show();
    };

    render() {
        return (
            <Menu
                ref={this.setMenuRef}
                button={
                    <TouchableOpacity onPress={this.showMenu}>
                        <Image style={styles.right_icon} source={require('./../reservoir/right_menu.png')}/>
                    </TouchableOpacity>
                }
            >
                <MenuItem onPress={this.hideMenu}>功能一</MenuItem>
                <MenuItem onPress={this.hideMenu}>功能二</MenuItem>
                <MenuItem onPress={this.hideMenu} disabled>
                    功能三
                </MenuItem>
                <MenuDivider />
                <MenuItem onPress={this.hideMenu}>功能四</MenuItem>
            </Menu>
        );
    }

    componentDidMount() {
        //这个地方以后需要在找方法优化，现在比较卑劣，目的是为了隐藏掉系统键盘
        InteractionManager.runAfterInteractions(()=> {
            console.log('有新的参数')
            this.showMenu();
            this.hideMenu();
        });
    }
}
const styles = StyleSheet.create({
    right_icon: {
        width: 30,
        height: 30,
    }
});
export default rightMenu