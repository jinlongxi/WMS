/**
 * Created by jinlongxi on 17/11/28.
 */
import React, {Component} from 'react';
import Header from '../common/reservoirHeader';
import Icon from '../common/icon_enter';
import prompt from 'react-native-prompt-android';
import Menu, {MenuItem} from 'react-native-material-menu';
import Util from '../../utils/util';
import styles from '../../styles/verifyPickStyles';
import InventoryView from '../../containers/inventoryViewContainer';

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
class Inventory extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        const {inventoryState,inventoryActions, selectStore}=this.props;
        console.log(this.props)
        return (
            <View style={styles.container}  >
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '库存查询',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>

                        <View style={styles.main}>
                            <View style={[styles.form]}>
                                <TextInput style={styles.input}
                                           autoCapitalize='characters'
                                           placeholder='请输入产品标识'
                                           placeholderTextColor="#7a7a7a"
                                           underlineColorAndroid='transparent'
                                           returnKeyLabel="完成"
                                           keyboardType="default"
                                           autoFocus={true}
                                           multiline={false}
                                           value={inventoryState.productId}
                                           onChangeText={(text)=> {
                                                inventoryActions.updateProductId(text)
                                           }}
                                           onEndEditing={(text)=> {

                                           }}
                                           onSubmitEditing={()=> {
                                                this.refs.locationSeqId.focus();

                                           }}
                                           onBlur={this._isFocused}
                                           ref="productId"
                                />
                                <TextInput style={styles.input}
                                                                           autoCapitalize='characters'
                                                                           placeholder='请输入库位'
                                                                           placeholderTextColor="#7a7a7a"
                                                                           underlineColorAndroid='transparent'
                                                                           returnKeyLabel="完成"
                                                                           keyboardType="default"
                                                                           autoFocus={false}
                                                                           multiline={false}
                                                                           value={inventoryState.locationSeqId}
                                                                           onChangeText={(text)=> {
                                                                               inventoryActions.updateLocationSeqId(text)
                                                                           }}

                                                                           ref="locationSeqId"
                                                                />
                            </View>

                        </View>



                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving} onPress={()=> {
                        this.goToView.bind(this)();
                    }}>
                        <Text style={styles.footer_btn_text}>查询</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    goToView(){
        const {navigator,inventoryActions,inventoryState,selectStore} = this.props;
        inventoryActions.findInventoryByLocationSeqId(inventoryState.productId,inventoryState.locationSeqId,selectStore.facilityId);

         if (navigator) {
             navigator.push({
                 name: 'InventoryView',
                 component: InventoryView,
                 params: {
                     selectStore: selectStore,

                 },
             })
         }
    }

}

export default Inventory
