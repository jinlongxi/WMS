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
class Reservoir extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            selectBtn: 1,
            text: '',
            editable: true,
            selectSkuSize: 0,
            dataSource: ds.cloneWithRows([]),
            currentSkuList: [],
            verifySkuList: null,
            buttonViewHeight: null,
            buttonHidden: 0
        };

        this._switchBtn = this._switchBtn.bind(this);
        this._clearData = this._clearData.bind(this);
        this._modifyNumber = this._modifyNumber.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._isFocused = this._isFocused.bind(this);
        this._importAllSku = this._importAllSku.bind(this)
    }

    //这个地方太恶心了  是为了挤掉系统键盘后续优化
    menu = null;
    setMenuRef = ref => {
        this.menu = ref;
    };
    hideMenu = () => {
        this.menu.hide();
    };
    showMenu = () => {
        this.menu.show();
    };

    //修改扫描SKU数量
    _modifyNumber(item) {
        const {reservoirActions}=this.props;
        const commendLocationArray = item.commendLocationSeqId.split(',');
        prompt(
            item.sku,
            commendLocationArray[0] + ' ' + commendLocationArray[1] + '\n' + commendLocationArray[2],
            [
                {
                    text: '确定',
                    onPress: (number) => {
                        reservoirActions.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, item.sku, number, this.state.currentSkuList);
                        this._isFocused()
                    }
                },
                {
                    text: '删除',
                    onPress: () => {
                        reservoirActions.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, item.sku, 0, this.state.currentSkuList);
                        this._isFocused()
                    }
                },
                {
                    text: '取消',
                    onPress: () => {
                        this._isFocused()
                    }
                },
            ],
            {
                cancelable: false,
                defaultValue: typeof item.stock === 'number' ? JSON.stringify(item.stock) : item.stock,
                placeholder: '输入数量',
                type: 'numeric'
            }
        );
    }

    //扫描条码
    _scanning(text) {
        const {reservoirActions}=this.props;
        switch (this.state.selectBtn) {
            case 1:
                if (text === this.props.reservoirState.targetPositionId) {
                    Alert.alert(
                        '扫描错误',
                        '原位置和目标位置相同',
                        [
                            {text: '确定', onPress: () => console.log('Ask me later pressed')},
                        ],
                        {cancelable: false}
                    );
                    return
                }
                return (
                    reservoirActions.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'current', this.props.placeState.selectPlaceList)
                );
            case 2:
                if (text === this.props.reservoirState.currentPositionId) {
                    Alert.alert(
                        '扫描错误',
                        '原位置和目标位置相同',
                        [
                            {text: '确定', onPress: () => console.log('点击了确定')},
                        ],
                        {cancelable: false}
                    );
                    return
                }
                return (
                    reservoirActions.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'target', this.props.placeState.selectPlaceList)
                );
            case 3:
                let skuList = this.props.reservoirState.selectSkuList;
                let skuStock = 1;

                skuList.map((item)=> {
                    console.log(item);
                    if (item.sku === text || item.eanId === text) {
                        skuStock = parseInt(item.stock) + 1;
                    }
                });
                return reservoirActions.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, text, skuStock, this.props.reservoirState.currentSkuList);
        }
        this._isFocused()
    }

    //提交表单
    _submit() {
        const text = this.state.text;
        if (text != null) {
            const {reservoirActions}=this.props;
            reservoirActions.loadingWait(true);
            this._scanning(text);
            this.setState({
                text: null
            });
        }
    }

    //移库操作
    _multiStockMove() {
        const {reservoirActions}=this.props;
        if (this.state.selectSkuSize === 0) {
            Alert.alert(
                '移库错误',
                '没有扫到任何商品！',
                [
                    {text: '确定', onPress: () => console.log('用户点击了确定按钮')},
                ],
                {cancelable: false}
            );
            if (this.props.reservoirState.currentPositionId === null) {
                this.setState({
                    selectBtn: 1
                })
            } else {
                this.setState({
                    selectBtn: 3
                })
            }

        } else {
            if (this.props.reservoirState.targetPositionId == null) {
                Alert.alert(
                    '移库错误',
                    '目标库位不能为空!',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                this.setState({
                                    selectBtn: 2
                                })
                            }
                        },
                    ],
                    {cancelable: false}
                );

            } else {
                const JsonArray = [];
                const selectSkuList = this.props.reservoirState.selectSkuList;
                for (let i = 0; i < selectSkuList.length; i++) {
                    JsonArray.push({productId: selectSkuList[i].sku, quantityMoved: selectSkuList[i].stock})
                }
                Alert.alert(
                    '移动操作',
                    '确定移动' + this.state.selectSkuSize + '件产品从' + this.props.reservoirState.currentPositionId + '到' + this.props.reservoirState.targetPositionId + '?',
                    [
                        {
                            text: '确定',
                            onPress: () => reservoirActions.multiStockMove(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId,
                                this.props.reservoirState.targetPositionId, JsonArray, this.state.selectSkuSize)
                        },
                        {text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
                    ],
                    {cancelable: false}
                );
            }
        }
    }

    //导入全部SKU
    _importAllSku() {
        const {reservoirActions, reservoirState}=this.props;
        const currentSkuList = reservoirState.currentSkuList;
        let allSku = [];
        for (let a of currentSkuList) {
            allSku.push({sku: a.productId, stock: a.quantityOnHandTotal, commendLocationSeqId: a.commendLocationSeqId})
        }
        reservoirActions.importAllSku(allSku);
    }

    //切换功能按钮
    _switchBtn(currentBtn) {
        if (this.props.reservoirState.currentPositionId == null) {
            Alert.alert(
                '原位置不能为空',
                '请先扫描或输入原位置标识',
                [
                    {text: '确定', onPress: () => console.log('用户点击了确定按钮')},
                ],
                {cancelable: false}
            );
        } else {
            this._isFocused();
            this.setState({
                selectBtn: currentBtn,
            })
        }
    }

    //清空数据
    _clearData() {
        Alert.alert(
            '数据清空',
            '您确定要清空？',
            [
                {text: '确定', onPress: () => this.props.reservoirActions.clearData()},
                {text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
            ],
            {cancelable: false}
        );
    }

    //文本框获得焦点
    _isFocused() {
        const that = this;
        setTimeout(function () {
            that.refs.aTextInputRef.focus();
            that.showMenu();
            that.hideMenu();
        }, 100);
    }

    //键盘弹出事件响应
    keyboardDidShowHandler(event) {
        console.log('键盘弹起了');
    }

    //监听键盘收起事件
    _keyboardDidHide() {
        console.log('键盘收起了');
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {sku, stock, commendLocationSeqId}=item;
        const commendLocationSeqArray = commendLocationSeqId ? commendLocationSeqId.split(',') : null;
        return (
            <TouchableOpacity style={styles.item} onPress={this._modifyNumber.bind(this, item)}>
                <View style={{flex: 1}}>
                    <Text style={styles.txt}>{sku}</Text>
                    {
                        commendLocationSeqId ? <Text style={[styles.txt, {
                            fontSize: 14,
                            color: '#777'
                        }]}>库位推荐:{commendLocationSeqArray[0]}</Text> : null
                    }
                </View>
                <Text style={{fontWeight: 'bold'}}>{stock}</Text>
                <Icon/>
            </TouchableOpacity>
        )
    };


    _renderSeparator(sectionID, rowID) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 0.8,
                    backgroundColor: '#ddd',
                }}
            />
        );
    }

    render() {
        const {reservoirState, selectStore}=this.props;
        return (
            <View style={styles.container} {...this._panResponder.panHandlers} >
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '商品库位移动',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>
                {
                    reservoirState.loading ? Util.loading :
                        <View style={styles.main}>
                            <View style={[styles.form, {height: this.state.buttonViewHeight}]}>
                                <TextInput style={styles.input}
                                           autoCapitalize='characters'
                                           placeholder={reservoirState.placeholderText}
                                           placeholderTextColor="#7a7a7a"
                                           underlineColorAndroid='transparent'
                                           returnKeyLabel="完成"
                                           keyboardType="default"
                                           autoFocus={true}
                                           editable={this.state.editable}
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
                                            style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 1 ? '#F37B22' : '#cccccc'}]}
                                            onPress={()=> {
                                                this._switchBtn(1)
                                            }}>
                                            <Text style={styles.position_btn_text}>原位置</Text>
                                            <Text
                                                style={styles.position_btn_text}>{reservoirState.currentPositionId}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.position}>
                                        <TouchableOpacity
                                            style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 2 ? '#F37B22' : '#cccccc'}]}
                                            onPress={()=> {
                                                this._switchBtn(2)
                                            }}>
                                            <Text style={styles.position_btn_text}>目标位置</Text>
                                            <Text
                                                style={styles.position_btn_text}>{reservoirState.targetPositionId}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.position}>
                                        <TouchableOpacity
                                            style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 3 ? '#F37B22' : '#cccccc'}]}
                                            onPress={()=> {
                                                this._switchBtn(3)
                                            }}>
                                            <Text style={styles.position_btn_text}>扫描产品</Text>
                                            <Text
                                                style={styles.position_btn_text}>共{this.state.selectSkuSize}件</Text>
                                        </TouchableOpacity>
                                        {
                                            reservoirState.currentPositionId == null || reservoirState.currentSkuList.length > 99 ?
                                                null :
                                                <TouchableOpacity
                                                    style={[styles.position_btn, {backgroundColor: '#28a745'}]}
                                                    onPress={()=>this._importAllSku()}
                                                >
                                                    <Text style={styles.position_btn_text}>导出原位置所有商品</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                            {
                                reservoirState.selectSkuList.length > 0 ?
                                    <View style={{flex: 1}}>
                                        <ListView
                                            style={styles.list}
                                            dataSource={this.state.dataSource}
                                            renderRow={this._renderRow}
                                            renderSeparator={this._renderSeparator}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            keyboardShouldPersistTaps='always'
                                        />
                                    </View>
                                    : null
                            }
                        </View>
                }
                <Menu
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity onPress={this.showMenu}>
                        </TouchableOpacity>
                    }
                >
                    <MenuItem onPress={this.hideMenu}>功能一</MenuItem>
                </Menu>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving} onPress={()=> {
                        this._multiStockMove()
                    }}>
                        <Text style={styles.footer_btn_text}>移动</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.emptying} onPress={()=> {
                        this._clearData()
                    }}>
                        <Text style={styles.footer_btn_text}>清空</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    componentWillMount() {
        //捕捉手势  还没研究明白  先这么用着吧 后续优化
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                //console.log(evt, gestureState.moveX,gestureState.moveY)
                // gestureState.{x,y}0 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                //console.log('最近一次的移动距离', evt, gestureState.moveX, gestureState.moveY);
                if (gestureState.moveY - this.state.buttonHidden === gestureState.moveY) {
                    this.setState({
                        buttonHidden: gestureState.moveY
                    });
                }
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                console.log(gestureState.moveY - this.state.buttonHidden);
                if (gestureState.moveY - this.state.buttonHidden < -Util.windowSize.height * 0.25) {
                    this.setState({
                        buttonViewHeight: 0,
                        buttonHidden: 0
                    })
                } else if (gestureState.moveY - this.state.buttonHidden > Util.windowSize.height * 0.15) {
                    this.setState({
                        buttonViewHeight: null,
                        buttonHidden: 0
                    })
                } else {
                    this.setState({
                        buttonViewHeight: null,
                        buttonHidden: 0
                    })
                }
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            //监听键盘弹出事件
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
                this.keyboardDidShowHandler.bind(this));
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        });
    }

    componentWillUnmount() {
        const {reservoirActions}=this.props;
        //清空数据
        reservoirActions.clearData();
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        const selectSkuSize = nextProps.reservoirState.selectSkuList;
        let number = 0;
        selectSkuSize.map((item)=> {
            number = number + parseInt(item.stock)
        });

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const data = nextProps.reservoirState.selectSkuList;
        this.setState({
            dataSource: ds.cloneWithRows(data),
            selectSkuSize: number,
            selectBtn: nextProps.reservoirState.selectBtn,
            editable: nextProps.reservoirState.editable,
            currentSkuList: nextProps.reservoirState.currentSkuList,
            text: nextProps.reservoirState.text,
            verifySkuList: nextProps.reservoirState.verifySkuList
        });
        if (nextProps.reservoirState.status === 'Focused') {
            this._isFocused()
        }
    }
}

export default Reservoir
