/**
 * Created by jinlongxi on 17/11/28.
 */
import React, {Component} from 'react';
import Header from '../common/reservoirHeader';
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
        this.state = {
            selectBtn: 1,
            text: '',
        };
        this._switchBtn = this._switchBtn.bind(this);
        this._isFocused = this._isFocused.bind(this);
    }


    //切换功能按钮
    _switchBtn(currentBtn) {
        this._isFocused();
        this.setState({
            selectBtn: currentBtn,
        })
    }

    //文本框获得焦点
    _isFocused() {
        const that = this;
        setTimeout(function () {
            that.refs.aTextInputRef.focus();
        }, 100);
    }

    //扫描条码
    _scanning(text) {
        const {inventoryActions}=this.props;
        switch (this.state.selectBtn) {
            case 1:
                //直接把数据存入数据树中
                inventoryActions.updateProductId(text);
                return
            case 2:
                return (
                    //检查库位对不对
                    inventoryActions.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'current', this.props.placeState.selectPlaceList)
                );
        }
        this._isFocused()
    }

    //提交表单
    _submit() {
        const text = this.state.text;
        if (text != null) {
            this._scanning(text);
            this.setState({
                text: null
            });
        }
    }

    //跳转到显示页面
    _goToView() {
        const {navigator, selectStore,inventoryStore} = this.props;
        //跳转操作
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

    render() {
        const {inventoryState, inventoryActions, selectStore}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '库存查询',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>

                <View style={styles.main}>
                    <View style={styles.form}>
                        <TextInput style={styles.input}
                                   autoCapitalize='characters'
                                   placeholder='扫描'
                                   placeholderTextColor="#7a7a7a"
                                   underlineColorAndroid='transparent'
                                   returnKeyLabel="完成"
                                   keyboardType="default"
                                   autoFocus={true}
                                   //editable={this.state.editable}
                                   multiline={false}
                                   value={this.state.text}
                                   onChangeText={(text)=> {
                                       this.setState({
                                           text: text
                                       })
                                   }}
                                   onEndEditing={(text)=> {

                                   }}
                                   onSubmitEditing={()=> {
                                        this._submit()
                                   }}
                                   onBlur={this._isFocused}
                                   ref="aTextInputRef"
                        />
                        <View style={styles.btnContainer}>
                            <View style={styles.position}>
                                <TouchableOpacity
                                    style={[styles.position_btn
                                        , {backgroundColor: this.state.selectBtn === 1 ? '#F37B22' : '#cccccc'}
                                        ]}
                                    onPress={()=> {
                                        this._switchBtn(1)
                                    }}>
                                    <Text style={styles.position_btn_text}>产品标识</Text>
                                    <Text
                                        style={styles.position_btn_text}>{
                                            inventoryState.productId
                                        }</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.position}>
                                <TouchableOpacity
                                    style={[styles.position_btn
                                        , {backgroundColor: this.state.selectBtn === 2 ? '#F37B22' : '#cccccc'}
                                        ]}
                                    onPress={()=> {
                                        this._switchBtn(2)
                                    }}>
                                    <Text style={styles.position_btn_text}>库位</Text>
                                    <Text
                                        style={styles.position_btn_text}>{
                                            inventoryState.locationSeqId
                                        }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving} onPress={()=> {
                        this._goToView.bind(this)();
                    }}>
                        <Text style={styles.footer_btn_text}>查询</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    //第二次进入的情况下，把框位置重置
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectBtn: nextProps.inventoryState.selectBtn,
            text: nextProps.inventoryState.text,
        });
    }

}

export default Inventory
